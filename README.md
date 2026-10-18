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

Die Excel-Masterdatei liegt **nicht** im öffentlichen Website-ZIP. Export: `python tools/export_excel_v17.py /pfad/zu/farn_schluessel_v17_erstentwurf_28_taxa.xlsx`. Bei Änderungen zunächst auf Testbranch hochladen, dann prüfen und erst nach Freigabe veröffentlichen.
