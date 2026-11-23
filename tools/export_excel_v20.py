#!/usr/bin/env python3
"""Export the V20 fern workbook to the website's JSON files."""

import argparse
import json
from collections import Counter, defaultdict
from pathlib import Path
from tempfile import NamedTemporaryFile

from openpyxl import load_workbook


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_FILES = ("traits.json", "taxa.json", "genera.json", "metadata.json")
CHOICE_TYPES = {"enum", "boolean"}
NON_SELECTABLE_STATES = {"unknown", "not_applicable"}


def records(sheet, header_row, key, required=(), data_row=None):
    rows = sheet.values
    headers = next(rows)
    for _ in range(1, header_row):
        headers = next(rows)
    columns = [(index, name) for index, name in enumerate(headers) if name]
    names = [name for _, name in columns]
    if duplicates := [name for name, count in Counter(names).items() if count > 1]:
        raise ValueError(f"{sheet.title}: duplicate columns: {duplicates}")
    if missing := {key, *required} - set(names):
        raise ValueError(f"{sheet.title}: missing columns: {sorted(missing)}")
    for row_number, row in enumerate(rows, header_row + 1):
        if data_row is not None and row_number < data_row:
            continue
        record = {name: row[index] for index, name in columns}
        if record[key] is not None:
            yield row_number, record
        elif any(value is not None for value in record.values()):
            raise ValueError(f"{sheet.title}, row {row_number}: missing {key}")


def indexed(rows, key, context):
    result = {}
    for row_number, record in rows:
        identifier = record[key]
        if identifier in result:
            raise ValueError(f"{context}, row {row_number}: duplicate {key} {identifier!r}")
        result[identifier] = record
    return result


def state_values(raw, allowed, multiple, context):
    if isinstance(raw, bool):
        raw = str(raw).lower()
    values, diagnostic = [], []
    for item in str(raw).split("|"):
        part = item.strip()
        marked = part.endswith("#!")
        code = part.removesuffix("#!").strip()
        if code not in allowed or (marked and code in NON_SELECTABLE_STATES):
            raise ValueError(f"{context}: invalid state {part!r}")
        if code not in values:
            values.append(code)
        if marked and code not in diagnostic:
            diagnostic.append(code)
    if len(values) > 1 and not multiple:
        raise ValueError(f"{context}: several states for a single-value trait")
    return values, diagnostic


def export(source, config):
    book = load_workbook(source, read_only=True, data_only=True)
    try:
        taxa = indexed(records(book["1_taxa"], 2, "taxon_id", (
            "scientific_name", "rank", "german_name", "family", "parent_taxon_id", "visible",
            "description_de", "description_en", "habitat_de", "habitat_en",
        )), "taxon_id", "1_taxa")
        definitions = indexed(records(book["3_trait_dictionary"], 2, "trait_code", (
            "label_de", "label_en", "group_name", "data_type", "multi_value", "key_role",
            "display_order", "description", "description_en",
        )), "trait_code", "3_trait_dictionary")
        options = defaultdict(dict)
        for row, state in records(book["4_trait_states"], 1, "trait_code", (
            "state_code", "label_de", "label_en", "explanation_de", "explanation_en",
            "image_path", "review_status",
        )):
            trait, code = state["trait_code"], state["state_code"]
            if trait not in definitions or not code or code in options[trait]:
                raise ValueError(f"4_trait_states, row {row}: invalid or duplicate pair {trait}/{code}")
            options[trait][code] = {
                "code": code,
                **{key: state[key] or "" for key in (
                    "label_de", "label_en", "explanation_de", "explanation_en",
                    "image_path", "review_status",
                )},
            }

        for taxon_id, taxon in taxa.items():
            parent = taxon["parent_taxon_id"]
            if parent and parent not in taxa:
                raise ValueError(f"{taxon_id}: unknown parent {parent}")

        traits = []
        for code, definition in definitions.items():
            if definition["data_type"] not in CHOICE_TYPES or definition["key_role"] == "none":
                continue
            if not options[code]:
                raise ValueError(f"{code}: selectable trait has no states")
            traits.append({
                "code": code,
                "label_de": definition["label_de"] or "",
                "label_en": definition["label_en"] or "",
                "description_de": definition["description"] or "",
                "description_en": definition["description_en"] or "",
                "role": definition["key_role"],
                "group": definition["group_name"],
                "order": definition["display_order"],
                "states": list(options[code].values()),
            })
        traits.sort(key=lambda item: (
            item["order"] is None, item["order"] or 0, item["code"],
        ))
        groups = config.get("identification_groups")
        group_values = set(groups or options["plant_architecture"])
        if groups:
            exported_codes = {trait["code"] for trait in traits}
            if group_values != set(options["plant_architecture"]):
                raise ValueError("The configured plant groups do not match plant_architecture states")
            for group, configuration in groups.items():
                configured_codes = set().union(*(configuration[level] for level in ("simple", "extended", "expert")))
                if missing := configured_codes - exported_codes:
                    raise ValueError(f"{group}: unknown configured traits {sorted(missing)}")
        matrix = indexed(records(book["2_traits_matrix"], 2, "taxon_id", (
            "scientific_name", "record_status", "plant_architecture",
        ), data_row=4), "taxon_id", "2_traits_matrix")
        if not matrix:
            raise ValueError("2_traits_matrix: missing taxon records")
        if missing := set(definitions) - matrix[next(iter(matrix))].keys():
            raise ValueError(f"2_traits_matrix: missing trait columns: {sorted(missing)}")
        entries = []
        for taxon_id, row in matrix.items():
            taxon = taxa.get(taxon_id)
            if taxon is None or taxon["scientific_name"] != row["scientific_name"]:
                raise ValueError(f"{taxon_id}: matrix name does not match 1_taxa")
            visibility = str(taxon["visible"]).strip().casefold()
            if visibility not in {"ja", "nein"}:
                raise ValueError(f"{taxon_id}: expected visible = ja or nein")
            values, diagnostic_values = {}, {}
            for trait in traits:
                code = trait["code"]
                raw = row[code]
                if raw is None or not str(raw).strip():
                    continue
                values[code], diagnostic = state_values(
                    raw, options[code], definitions[code]["multi_value"] == "yes",
                    f"{taxon_id}, {code}",
                )
                if diagnostic:
                    diagnostic_values[code] = diagnostic
            group = values.get("plant_architecture", [])
            if len(group) != 1 or group[0] not in group_values:
                raise ValueError(f"{taxon_id}: expected one configured plant_architecture state")
            if visibility == "ja":
                entries.append({
                    "id": taxon_id,
                    "name": taxon["scientific_name"],
                    "rank": taxon["rank"],
                    "status": row["record_status"],
                    **{key: taxon[key] or "" for key in (
                        "german_name", "family", "description_de", "description_en",
                        "habitat_de", "habitat_en",
                    )},
                    "values": values,
                    "diagnostic_values": diagnostic_values,
                })
        genera = [
            {key: value or "" for key, value in row.items()}
            for row in indexed(records(book["5_genera"], 1, "genus_name"), "genus_name", "5_genera").values()
        ]
        counts = Counter(row["values"]["plant_architecture"][0] for row in entries)
        old_metadata = json.loads((ROOT / "data" / "metadata.json").read_text(encoding="utf-8"))
        metadata = {
            **old_metadata,
            "source_file": source.name,
            "base_excel_version": "V20",
            "editorial_revision": "V20",
            "taxa_count": len(entries),
            "matrix_taxa_count": len(matrix),
            "hidden_taxa_count": len(matrix) - len(entries),
            "group_counts": dict(counts),
            "trait_count": len(traits),
            "primary_count": sum(trait["role"] == "primary" for trait in traits),
            "issues_count": 0,
            "described_taxa_count": sum(bool(row["description_de"]) for row in entries),
            "diagnostic_taxa_count": sum(bool(row["diagnostic_values"]) for row in entries),
            "diagnostic_state_count": sum(
                len(marks) for row in entries for marks in row["diagnostic_values"].values()
            ),
            "not_applicable_state_count": sum(
                "not_applicable" in codes for row in entries for codes in row["values"].values()
            ),
            "not_applicable_trait_count": sum("not_applicable" in options[t["code"]] for t in traits),
            "genus_description_count": len(genera),
        }
        return dict(zip(OUTPUT_FILES, (traits, entries, genera, metadata)))
    finally:
        book.close()


def write_json(output_dir, documents):
    output_dir.mkdir(parents=True, exist_ok=True)
    # Finish validation and serialization before replacing any existing JSON.
    payloads = {name: json.dumps(data, ensure_ascii=False, indent=2) + "\n" for name, data in documents.items()}
    for name, content in payloads.items():
        with NamedTemporaryFile(dir=output_dir, mode="w", encoding="utf-8", newline="\n", delete=False) as file:
            staging_path = Path(file.name)
            file.write(content)
        try:
            staging_path.replace(output_dir / name)
        finally:
            staging_path.unlink(missing_ok=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("workbook", type=Path)
    parser.add_argument("--output-dir", type=Path, default=ROOT / "data")
    args = parser.parse_args()
    config = json.loads((ROOT / "config" / "farne.json").read_text(encoding="utf-8"))
    documents = export(args.workbook, config)
    write_json(args.output_dir, documents)
    print(f"Exported {len(documents['taxa.json'])} visible taxa from {args.workbook.name}.")


if __name__ == "__main__":
    main()
