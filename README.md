# FloraOOE Farnschlüssel

**Öffentliche Testversion: Programm V15 · Excel-Datenbasis V23** (Stand: 18.10.2026)

[**Farnschlüssel öffnen (GitHub Pages)**](https://sylviahagmueller.github.io/FloraOOEFarnschluessel/)

Interaktiver, zweisprachiger **Multi-Access-Bestimmungsschlüssel** für Gefäßsporenpflanzen Österreichs. Merkmale können in beliebiger Reihenfolge kombiniert werden; unbekannte Merkmale können übersprungen werden. Die Kandidatenliste wird dynamisch gefiltert.

> **Wissenschaftlicher Prototyp / Testversion:** Die botanische Merkmalsmatrix ist noch nicht abschließend geprüft. Bestimmungsergebnisse sind Hilfestellungen, keine verifizierten Artbestimmungen. Die öffentliche Erreichbarkeit bedeutet keine abgeschlossene fachliche oder rechtliche Freigabe durch die ARGE Botanik.

## Aktueller Stand

- **Programm:** V15 (am 18.10.2026 als öffentliche Testversion über GitHub Pages bereitgestellt).
- **Datenbasis:** Excel V23, nach JSON exportiert: **173 Bestimmungstaxa**, **67 Merkmale**. Der Export meldet 0 formale Validierungsprobleme, aber die fachliche Prüfung steht weiterhin aus.
- **Sprachen:** Deutsch / Englisch für die Benutzeroberfläche.
- **Hosting:** GitHub Pages aus **`main` / `(root)`**.
- **Testbranch:** `test/v14-mit-versionsanzeige` (enthält inzwischen ebenfalls V15; Branchname historisch).
- **Daten-Masterdatei:** `farn_schluessel_v23_ausgangsbasis.xlsx` im **privaten** Repository [FloraOOEFarnschluessel-Daten](https://github.com/Sylviahagmueller/FloraOOEFarnschluessel-Daten). Nicht in das öffentliche Repository kopieren.
- **Website:** eigener Link „Über das Projekt“; Versionsanzeige im Footer.

## Funktionsweise

- Merkmalsauswahl in den Stufen **Einfach / Erweitert / Experte** (Standard: Einfach).
- Häufig verwendete Merkmale zuerst; weitere Merkmale nach botanischen Themen gruppiert und aufklappbar.
- Zustände eines Merkmals über Checkboxen auswählbar; mehrere Zustände desselben Merkmals werden mit **ODER**, verschiedene Merkmale mit **UND** kombiniert.
- Fehlende Taxonwerte führen nicht automatisch zum Ausschluss; die Anzeige unterscheidet passende und unsichere Kandidaten.
- Zeichnungen und einzelne lokale Testfotos unterstützen die Bestimmung.
- Die Programmversion ist fest hinterlegt; die angezeigte Excel-Datenversion wird aus `data/metadata.json` abgeleitet.

## Repositories und Datenfluss

| Repository | Zweck | Sichtbarkeit |
| --- | --- | --- |
| [FloraOOEFarnschluessel](https://github.com/Sylviahagmueller/FloraOOEFarnschluessel) | Statische Webanwendung, exportierte JSON-Dateien, Bilder | Öffentlich |
| [FloraOOEFarnschluessel-Daten](https://github.com/Sylviahagmueller/FloraOOEFarnschluessel-Daten) | Wissenschaftliche Excel-Masterdatei V23 | Privat |

Geplanter Arbeitsfluss: **Excel-Masterdatei → Validierung und JSON-Export → Testbranch → Browserprüfung → Freigabe für `main` → GitHub Pages**.

Der JSON-Export und die Excel-Verwaltung erfolgen derzeit noch nicht automatisiert über GitHub. **JSON-Dateien im öffentlichen Repository sind öffentlich einsehbar**, auch wenn die Excel-Datei selbst privat bleibt.

## Projektstruktur

```text
/
├── index.html                  Hauptseite
├── projekt.html                Projektinformation (DE / EN)
├── datenschutz.html            Datenschutzhinweise (Entwurf)
├── bildnachweise.html          Bildnachweise
├── README.md
├── BILDNACHWEISE.md
├── DATENSCHUTZ_ENTWURF.md
├── css/
│   └── main.css
├── js/
│   └── app.js
├── data/
│   ├── metadata.json
│   ├── taxa.json
│   ├── traits.json
│   ├── distribution.json
│   ├── regions.json
│   └── validation.json
└── assets/
    ├── drawings/
    └── photos/
```

Kein eigener Anwendungsserver und keine Datenbank erforderlich; die Website lädt ihre JSON-Dateien im Browser. Das Verzeichnis `assets/photos/` enthält derzeit drei lokal gespeicherte Commons-Testfotos.

## Lokale Prüfung

Im Verzeichnis mit der `index.html` einen lokalen HTTP-Server starten:

```bash
python -m http.server 8000
```

Danach [http://localhost:8000/](http://localhost:8000/) öffnen. Nicht direkt per `file://` starten, da die Anwendung die JSON-Daten mit `fetch()` lädt.

Vor jeder Freigabe zumindest Startseite, Merkmalsfilter, Kandidatenliste, Sprachwechsel, Bilder, Info-Dialoge, Mobilansicht, Versionsanzeige und Linkseiten prüfen.

## Entwicklungsplan / TODO

**Die nachfolgenden Versionen sind Arbeitstitel, keine zugesagten Releases. Änderungen nur nach ausdrücklicher Zustimmung und zunächst auf einem Testbranch.**

### Nächste Funktionen

- [ ] **V16 – Taxon-Anzeigefilter:** Ansichten „nur Gattungen“, „Arten ohne Unterarten“ (Standard) und „alle Taxa einschließlich Unterarten“. Taxonomische Grenzfälle (z. B. Aggregate und Unterarten) vor Umsetzung anhand der Datenstruktur festlegen. Die Filterung der morphologischen Merkmale und der Taxon-Anzeigefilter sollen getrennt bleiben.
- [ ] **V17 – Relevante Merkmalsausprägungen:** In der Excel-Merkmalsmatrix besonders relevante Zustände mit **`#!`** markieren. Maßgeblich ist die **Fettdruck-Hervorhebung der Österreichischen Exkursionsflora**, nicht eine eigenständige Neubewertung. Beim JSON-Export Kennzeichen **vom eigentlichen Merkmalscode trennen**; anschließend eine geeignete dezente Darstellung im Schlüssel prüfen.
- [ ] **V18 – Bestimmungsunterstützung:** Vorschlag für das nächstgeeignete Merkmal überprüfen und weiterentwickeln. Die genaue Ausgestaltung folgt nach der V16/V17-Prüfung.

### Botanische Inhalte und Benutzerfreundlichkeit

- [ ] Taxa, Merkmalsmatrix und schwierige Gruppen fachlich validieren; Quellen vor allem Österreichische Exkursionsflora, Blumen in Schwaben, Info Flora und Flora NHM Wien.
- [ ] Besonders bei ähnlichen Arten und Unterarten diagnostische Merkmalskombinationen mit echten Bestimmungsfällen überprüfen.
- [ ] Für weitere Merkmalsausprägungen fachlich korrekte schematische Zeichnungen und kurze verständliche Erklärungen ergänzen; englische Erläuterungen systematisch vervollständigen.
- [ ] Schwierigkeitseinstufung Einfach / Erweitert / Experte botanisch überprüfen.
- [ ] Zusätzliche rechtssicher dokumentierte Artfotos prüfen.
- [ ] Langfristig weitere Pflanzengruppen und ggf. KI-Unterstützung für das Ausfüllen von Merkmalen evaluieren; **nicht** Teil des aktuellen Releases.

### Veröffentlichung, Qualität und Recht

- [x] GitHub-Pages-Testversion V15 veröffentlicht und visuell im Browser überprüft (18.10.2026).
- [x] Drei Commons-Testfotos lokal eingebunden; Quellen und Lizenzen dokumentiert.
- [x] Externe Google Fonts entfernt; Systemschriften verwendet.
- [x] Projektvorstellung auf eigene Seite `projekt.html` ausgelagert.
- [ ] Gezielte Tests auf Smartphone, Tastaturbedienung, Navigation und in beiden Sprachen vervollständigen.
- [ ] Botanische Korrektheit der Illustrationen prüfen; Herkunft und Verwendungsrechte der generierten Zeichnungen dokumentieren.
- [ ] Verantwortlichkeit, Impressum und Hosting-Angaben vor einer offiziellen Freigabe klären.
- [ ] `datenschutz.html` ist weiterhin als **Entwurf** gekennzeichnet; rechtliche Finalisierung steht aus.
- [ ] Vor einer offiziellen Verlinkung durch die ARGE Botanik eine abgestimmte fachliche und rechtliche Freigabe einholen.
- [ ] Eventuellen späteren Umzug auf einen offiziellen Museums-/Institutions-GitHub-Account planen; relative Projektpfade erleichtern dies.

## Versionshistorie

| Version | Datum | Änderungen |
| --- | --- | --- |
| **V15** | 18.10.2026 | Projektvorstellung in `projekt.html` ausgelagert, Footer verschlankt; Programm V15 / Daten V23; Veröffentlichung als öffentliche GitHub-Pages-Testversion |
| **V14** | 17.–18.10.2026 | Aufklappbare, thematisch gegliederte Merkmale; Reiter Einfach / Erweitert / Experte; zweisprachige Versionsanzeige |
| **V13** | 17.10.2026 | Einführung der gestuften, thematisch gruppierten Merkmalsauswahl |

## Projekt und Bildnachweise

Ein Projekt der **Botanischen Arbeitsgemeinschaft Oberösterreich (ARGE Botanik)**.

- **Idee und fachliche Betreuung:** Dr. Hans-Peter Reinthaler
- **Konzeption und technische Umsetzung:** Dr. Sylvia Hagmüller
- [ARGE Botanik](https://www.argebotanik-ooe.at/)
- [Impressum der ARGE](https://www.argebotanik-ooe.at/about/) (Verantwortlichkeit für diese eigenständige Testwebsite noch zu klären)
- [Bildnachweise](bildnachweise.html) und [Quellendokumentation](BILDNACHWEISE.md)
- [Datenschutzhinweise – Entwurf](datenschutz.html)

**Stand der README:** 18.10.2026. Die README dokumentiert den aktuellen veröffentlichten Zustand und geplante Arbeiten; offene Punkte sind keine bereits implementierten Funktionen.
