# FloraOOE Farnschlüssel – V20

**Programmstand und Excel-Datenbasis:** V20. Der botanische Datenstand ist vorläufig.

Unter `/farne/` beginnt die Bestimmung mit der Auswahl einer Pflanzengruppe. Der Schlüssel zeigt danach die passenden Merkmale und die für diese Gruppe in der Matrix belegten Ausprägungen an. Merkmale lassen sich in beliebiger Reihenfolge kombinieren.

## Farnschlüssel in V20

- 162 sichtbare Taxa: 113 Farne, 19 Schachtelhalme, 17 Bärlappe und Moosfarne sowie 13 Natternzungengewächse.
- Gruppenspezifische Merkmalstexte und Ausprägungen auf Deutsch und Englisch.
- Taxondetails mit Beschreibung, Standort, diagnostischen Merkmalen und vorhandenen Gattungstexten.
- Graue Taxonkarten kennzeichnen mögliche Treffer, bei denen zu mindestens einem ausgewählten Merkmal eine Angabe fehlt.
- Unter `/viola/` ist der separate interaktive Veilchenschlüssel erreichbar.

## Lokal testen und Daten exportieren

Aus dem Programmordner:

```text
python -m http.server 8765 --bind 127.0.0.1
```

Öffne [den lokalen Farnschlüssel](http://127.0.0.1:8765/farne/) oder [den lokalen Veilchenschlüssel](http://127.0.0.1:8765/viola/). Zum Prüfen der Gruppenauswahl kann man die Trefferzahlen ohne Filter mit den obigen Zahlen vergleichen und danach ein Merkmal auswählen.

Für einen neuen Export der Farn-Daten werden Python, `openpyxl` und die private Excel-Masterdatei benötigt:

```text
python tools/export_excel_v20.py /Pfad/zur/farn_schluessel_v20.xlsx
```

Das Skript prüft die Taxon-IDs und Merkmalswerte und schreibt `data/taxa.json`, `data/traits.json`, `data/genera.json` und `data/metadata.json`. Es übernimmt nur Taxa mit `visible = ja`. Die Gruppenzuordnung kommt aus `plant_architecture`. Die angebotenen Merkmale und ihre gruppenspezifischen Texte stehen in `config/farne.json`.

## Datenhaltung

- **Öffentlich:** `Sylviahagmueller/FloraOOEFarnschluessel` enthält das Programm und die daraus benötigten JSON-Daten.
- **Privat:** `Sylviahagmueller/FloraOOEFarnschluessel-Daten` enthält die Excel-Masterdatei.
- Botanische Änderungen erfolgen in der Excel-Matrix. Danach werden die JSON-Daten neu exportiert und im Programm geprüft.
- Für datierte Archivstände gilt das Namensschema `FloraOOE_<Gruppe>_V<Programmversion>_YYYYMMDD_NN.xlsx`. Datenstand und botanischer Prüfstatus werden getrennt von der Programmversion dokumentiert.

## Merkmalsmatrix und Exportregeln

- Mehrere zulässige Merkmalszustände werden in Excel durch `|` getrennt.
- Ein angehängtes `#!` kennzeichnet eine anhand der maßgeblichen botanischen Quelle hervorgehobene **einzelne Merkmalsausprägung**, nicht das ganze Merkmal. Im JSON stehen Zustandswerte ohne Marker in `values` und die markierten Werte getrennt in `diagnostic_values`.
- Leere Zellen und `unknown` bedeuten keine gesicherte Merkmalsausprägung; bei der Filterung darf ein Taxon deshalb nicht allein deswegen ausgeschlossen werden.
- `not_applicable` bedeutet biologisch nicht anwendbar; das Filterverhalten ist von `unknown` zu unterscheiden. Es ist kein normal auswählbarer Merkmalszustand.
- Für Viola ist die **Österreichische Exkursionsflora 2026** die vorrangige botanische Arbeitsgrundlage. Ergänzende Quellen und Abweichungen sind im Quellen-/Prüfprotokoll nachzuweisen. Die fachliche Prüfung der 44 Taxa und 35 Merkmale ist noch offen.
- Nach jeder fachlichen Änderung an der Excel-Mastermatrix: Datenexport, Validierung aller Merkmalscodes, Prüfung der Markierungen und lokaler Funktionstest. GitHub-Veröffentlichungen erfolgen erst nach ausdrücklicher Freigabe.

## Frühere Programmstände

- **V17:** zweisprachige Taxontexte und diagnostische Ausprägungen in der Detailansicht.
- **V18:** getrennte Behandlung unbekannter und nicht anwendbarer Werte.
- **V19:** Gattungstexte und zusätzliche Zeichnungen zu Blatttyp und Teilungsgrad.
