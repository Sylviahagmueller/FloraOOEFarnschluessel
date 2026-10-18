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
