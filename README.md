# FloraOOE Farnschlüssel – GitHub-Pages-Testversion V14

**Status:** Veröffentlichungsvorbereitung, nicht fachlich oder rechtlich freigegeben (16.10.2026).

Statischer, zweisprachiger Multi-Access-Bestimmungsschlüssel für österreichische Gefäßsporenpflanzen. Die Daten wurden aus der wissenschaftlichen Excel-Version V23 exportiert (173 Bestimmungstaxa, 67 Merkmale). Die Matrix ist noch in Bearbeitung; die Bestimmungsergebnisse sind keine gesicherten Artbestimmungen.

## Bereitstellung

Die Dateien dieses Archivs sind für das **Repository-Hauptverzeichnis** vorgesehen (`index.html` direkt im Root). Nach abgeschlossener Freigabe kann GitHub Pages mit Branch `main` und Ordner `/ (root)` aktiviert werden. Bis dahin **nicht öffentlich hochladen**.

## Offene Prüfungen vor Veröffentlichung

- [x] Drei Commons-Testfotos als lokale, verkleinerte JPG-Dateien eingebunden; Urheber, Originalseiten, Lizenz und Änderungen in `BILDNACHWEISE.md` und bei den Artendetails angegeben. Vor endgültiger Veröffentlichung Sichtprüfung empfohlen.
- [x] Google-Fonts-Verbindungen aus `index.html` entfernt und CSS auf Systemschriften umgestellt (Arial/Helvetica, für Überschriften vorzugsweise Arial Narrow). Visuelle Browserprüfung steht noch aus.
- [ ] Illustrationen botanisch prüfen und Nutzungsrechte/Urheberschaft klären.
- [x] Projektzuordnung und Namensnennung von Dr. Hans-Peter Reinthaler und Dr. Sylvia Hagmüller zweisprachig im Footer ergänzt.
- [ ] Offizielles Impressum und Verantwortlichkeit prüfen; ARGE-Impressum ist verlinkt, aber ersetzt nicht automatisch alle Pflichtangaben.
- [ ] `datenschutz.html` (derzeit ausdrücklich **Entwurf**) fachlich/rechtlich prüfen und vor Freigabe finalisieren; Verantwortlichkeit und GitHub-Pages-Hosting bestätigen.
- [ ] Testversionshinweis, Mobilansicht, Navigation, Tastatur, Sprachwechsel, Datenabrufe testen.
- [ ] Wissenschaftlichen `draft`-Status in der Außenkommunikation deutlich machen.

## Struktur

- `index.html` – Einstieg mit Testversionshinweis
- `css/main.css` – Styles (Systemschriften, keine Google-Fonts-Abfragen)
- `js/app.js` – App-Logik, Sprache, lokale Testbilder
- `data/*.json` – exportierte Daten und Metadaten
- `assets/drawings/` – schematische Illustrationen
- `assets/photos/` – drei lokale Testfotos
- `BILDNACHWEISE.md` – Fotoquellen und CC-Lizenzen

Die **Excel-Masterdatei**, Exportskripte, Prüfsummen und andere Sicherungsdateien sind bewusst nicht enthalten. Die JSON-Daten sind allerdings Teil einer öffentlichen Website und nach Upload öffentlich zugänglich.

## Lokaler Test

Im entpackten Verzeichnis `python -m http.server 8000` starten und `http://localhost:8000/` öffnen. Wegen `fetch()` nicht über `file://` testen.

## Späterer Umzug

Relative Pfade ermöglichen die Übertragung in ein Museums-Repository. Für den Umzug müssen noch öffentliche Seitenadressen sowie rechtliche Hinweise angepasst werden.

## Namensnennung

Idee und fachliche Betreuung: **Dr. Hans-Peter Reinthaler**. Konzeption und technische Umsetzung: **Dr. Sylvia Hagmüller**. Ein Projekt der **ARGE Botanik Oberösterreich**.

## Rechtliche HTML-Seiten

`datenschutz.html` und `bildnachweise.html` sind im Footer direkt verlinkt. Der Datenschutztext ist **nur ein Entwurf**, keine rechtliche Freigabe. Ausschließlich die offizielle ARGE-Webseite dient als Kontaktstelle.


## V13 – Merkmalsauswahl (Prüfversion)

- Die Combobox bietet **Einfach** (Standard), **Erweitert** und **Experte**.
- Botanische Kategorien gruppieren die Merkmale innerhalb der Auswahl.
- Auswahl beschränkt nur neu hinzufügbare Merkmale und Merkmalvorschläge; aktive Filter bleiben beim Umschalten bestehen.
- „Alles zurücksetzen“ stellt wieder „Einfach“ und die neun bisherigen Startmerkmale her.
- Zuordnung der Schwierigkeitsstufen ist eine vorläufige UI-Redaktion, fachliche Prüfung folgt.
- Excel, JSON, Taxonliste und Kandidatenlogik bleiben unverändert.


## V14 – Merkmalsauswahl (17.10.2026)

- Sichtbare Reiter **Einfach / Erweitert / Experte**, Standard Einfach.
- Die neun bisherigen Startmerkmale stehen unter **Häufig verwendete Merkmale**.
- Übrige Merkmale sind nach Themen gruppiert und direkt aufklappbar. Merkmalswerte sind als Checkboxen innerhalb der Liste wählbar; Info-Zeichnungen bleiben verfügbar.
- Bereits gesetzte Werte bleiben beim Stufenwechsel erhalten, auch wenn das Merkmal ansonsten nicht in dieser Stufe vorkommt.
- Keine Änderung an `data/`, der taxonomischen Anzeige oder der Kandidatenklassifikation.
- Browserdarstellung und Bestimmungsfälle fachlich prüfen, bevor die Testversion öffentlich wird.


## V14 – Versionsanzeige (lokale Ergänzung)

- Footer zeigt die Programmversion V14 und die Excel-Datenversion aus `data/metadata.json` (derzeit V23).
- Beschriftungen passen sich an Deutsch/Englisch an.
- Keine Änderung der Excel-Datei, JSON-Daten oder Bestimmungs- und Filterlogik.
- Keine GitHub-Veröffentlichung.

## V15 – Schlanker Footer und Projektseite (18.10.2026)

- Die Projektvorstellung und Namensnennungen wurden von der Hauptseite auf `projekt.html` verschoben.
- Der Footer enthält nur noch die Links zu Projekt, ARGE, Impressum, Datenschutz, Bildnachweisen und Metadaten sowie die Versionsanzeige.
- Programmversion V15; Excel-Datenbasis V23 unverändert.
- Änderungen ausschließlich im Testbranch; Browserprüfung ausständig.
