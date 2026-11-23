# FloraOOE Farnschlüssel – V17 Testversion

**Stand:** 18.10.2026, technischer Testentwurf, noch nicht veröffentlicht.

V17 baut auf V15 auf, der Taxonfilter V16 ist zurückgestellt. Die botanische Excel-Masterdatei ist separat und privat aufzubewahren.

## Neue Funktionen

- 28 Taxa mit eigenständig formulierten Beschreibungen und Standorttexten (DE/EN)
- 28 Taxa mit diagnostischen Merkmalen, insgesamt 71 gekennzeichnete Ausprägungen
- Werte in `values` enthalten **keine** `#!`-Zeichen, Markierungen stehen in `diagnostic_values`
- Artendetailansicht: Beschreibung, Standort, besonders wichtige Merkmale und vollständige Merkmalsübersicht
- Excel-Datenbasis V23 (Bearbeitungsstand V17)
- Botanischer Status aller Daten bleibt vorläufig

## Testen

Im Projektverzeichnis `python -m http.server 8000` ausführen und http://localhost:8000/ öffnen. Sprache umschalten; insbesondere *Cystopteris montana*, *Adiantum capillus-veneris* und *Cryptogramma crispa* prüfen.

## Datenpflege

Die Excel-Masterdatei liegt **nicht** im öffentlichen Website-ZIP. Export: `python tools/export_excel_v18.py /pfad/zu/farn_schluessel_v17_erstentwurf_28_taxa.xlsx`. Bei Änderungen zunächst auf Testbranch hochladen, dann prüfen und erst nach Freigabe veröffentlichen.

## V18 – Teilungsgrad und nicht anwendbare Merkmale

Die Excel V18 ist die Datenquelle. `not_applicable` wird als Taxonwert im JSON gespeichert und nicht als auswählbarer Zustand angezeigt. Solche Taxa werden bei einer positiven Merkmalsauswahl ausgeschlossen; leere und `unknown`-Werte bleiben dagegen mögliche Treffer. Ein Merkmal wird ausgeblendet, wenn es bei allen verbleibenden Taxa als `not_applicable` kodiert ist.

Export: `python tools/export_excel_v18.py /Pfad/zur/farn_schluessel_v18_teilungsgrad_nicht_anwendbar.xlsx`

Wichtig: Taxa ohne Angabe sind weiterhin unbestimmt; die fachliche Gesamtprüfung steht aus.


## V19 Testfassung
- Gattungsinformationen in `data/genera.json` (Excel-Blatt `5_genera`), aufklappbar in Artdetails.
- Neue eigenständige SVG-Schemata für fünf vorhandene Ausprägungen von `leaf_type` und neun von `frond_division_degree`. Die Merkmalscodes und Matrixwerte bleiben erhalten.
- Laufende `#!`-Korrekturen aus V18 übernommen (Polystichum braunii, Athyrium filix-femina, Pseudathyrium alpestre).
- Gattungen sind **keine** zusätzlichen Bestimmungskandidaten.
- Gattungstexte sind fachliche Entwürfe; botanische Gesamtprüfung ausstehend.
- Für Neugenerierung: `python tools/export_excel_v19.py /pfad/zur/v19.xlsx`. Ein vollständiger V18-Neuexport sollte nur mit aktualisierter Metadatenerstellung kombiniert werden.

## V20 – mehrere Pflanzengruppen (Entwicklungsbranch)

**Status (16.11.2026):** Technischer Entwicklungsstand auf `test/v20-mehrere-pflanzengruppen`; **noch nicht nach `main` veröffentlicht**.

- Die bestehende Farnbestimmung wird unter `/farne/` eingebunden; die allgemeine Startseite bleibt erhalten.
- Der Pfad `/viola/` ist im aktuellen GitHub-Stand **nur eine Platzhalterseite**. Die lokal bereits getestete, interaktive Viola-Fassung ist noch nicht vollständig in diesen Branch übertragen. Insbesondere fehlen dort derzeit `config/viola.json` und `data/viola/*.json`.
- Vorgesehen ist eine gemeinsame Softwarebasis für mehrere Pflanzengruppen. Ist eine Pflanzengruppe über den Pfad vorgegeben, soll ihre Auswahlbox nicht angezeigt werden; Farben können je Pflanzengruppe variieren (Viola: violett).
- Fachlich überprüfte Merkmalsdaten und eine vollständige lokale Funktionsprüfung sind Voraussetzung für eine Veröffentlichung. Die botanischen Arbeitsstände sind ausdrücklich noch nicht abschließend geprüft.

### Datenhaltung und Repositories

- **Öffentlich:** `Sylviahagmueller/FloraOOEFarnschluessel` – Programmcode und freigegebene, für die Anwendung erforderliche Daten.
- **Privat:** `Sylviahagmueller/FloraOOE_BotanicalData` – Excel-Mastermatrizen, Quellen- und Prüfprotokolle sowie unveröffentlichte botanische Arbeitsstände.
- Die **Excel-Matrix ist die redaktionelle Masterdatenquelle**. JSON-Dateien werden für den Softwareeinsatz daraus exportiert und sollen nicht unabhängig davon fachlich weitergepflegt werden.
- Die privaten Excel-Dateien dürfen nicht ohne gesonderte inhaltliche und rechtliche Prüfung in das öffentliche Repository übernommen werden.

### Versions- und Dateinamenskonvention

`FloraOOE_<Group>_V<SoftwareVersion>_YYYYMMDD_NN.xlsx`

Beispiele (Archivstand 16.11.2026):

- `FloraOOE_Ferns_V20_20261116_01.xlsx`
- `FloraOOE_Viola_V20_20261116_01.xlsx`

`V20` bezeichnet die **vorgesehene Softwareversion**, nicht eine abgeschlossene Prüfung oder nachgewiesene Kompatibilität. Das Datum bezeichnet den Bearbeitungstag, `NN` die laufende Revision dieses Tages. Botanische Matrixrevision, Quellenstand und Prüfstatus werden separat dokumentiert. Die Viola-Arbeitsdatei wurde aus einem früheren V4-/JSON-Teilstand rekonstruiert; ein späterer Exkursionsflora-Abgleich ist damit nicht automatisch enthalten.

### Merkmalsmatrix und Exportregeln

- Mehrere zulässige Merkmalszustände werden in Excel durch `|` getrennt.
- Ein angehängtes `#!` kennzeichnet eine anhand der maßgeblichen botanischen Quelle hervorgehobene **einzelne Merkmalsausprägung**, nicht das ganze Merkmal. Im JSON stehen Zustandswerte ohne Marker in `values` und die markierten Werte getrennt in `diagnostic_values`.
- Leere Zellen und `unknown` bedeuten keine gesicherte Merkmalsausprägung; bei der Filterung darf ein Taxon deshalb nicht allein deswegen ausgeschlossen werden.
- `not_applicable` bedeutet biologisch nicht anwendbar; das Filterverhalten ist von `unknown` zu unterscheiden. Es ist kein normal auswählbarer Merkmalszustand.
- Für Viola ist die **Österreichische Exkursionsflora 2026** die vorrangige botanische Arbeitsgrundlage. Ergänzende Quellen und Abweichungen sind im Quellen-/Prüfprotokoll nachzuweisen. Die fachliche Prüfung der 44 Taxa und 35 Merkmale ist noch offen.
- Nach jeder fachlichen Änderung an der Excel-Mastermatrix: Datenexport, Validierung aller Merkmalscodes, Prüfung der Markierungen und lokaler Funktionstest. GitHub-Veröffentlichungen erfolgen erst nach ausdrücklicher Freigabe.

### Farnschlüssel lokal aus der V20-Matrix testen

Der Export benötigt Python und openpyxl. Aus dem Programmordner:

```text
python tools/export_excel_v20.py /Pfad/zur/farn_schluessel_v20.xlsx
python -m http.server 8765 --bind 127.0.0.1
```

Öffne `http://127.0.0.1:8765/farne/`. Die Auswahl der vier Farn- und Verwandtschaftsgruppen verwendet `plant_architecture`. Die pro Gruppe angebotenen Merkmale stehen in `config/farne.json`.

### Geplante Freigabe von V20

Vor einem Merge nach `main` sind die fehlenden Viola-Anwendungsdateien zu vergleichen bzw. einzubinden sowie Farn- und Viola-Funktionen (Pfade, Merkmalsfilter, Darstellung, `unknown`/`not_applicable` und Caching der CSS-/JS-Dateien) lokal zu testen. Bis dahin bleibt `main` unverändert.
