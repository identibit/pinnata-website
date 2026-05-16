# Hotel A' Pinnata — Sito ufficiale

Boutique hotel sul mare di Lipari, Isole Eolie. Sito statico in HTML/CSS/JS vanilla, deployato su Vercel.

## Struttura

| File | Versione | Note |
|---|---|---|
| `index.html` | **V4 — Cinematic Quiet** | Versione in produzione |
| `v1-editorial.html` | Editorial Mediterraneo | Esplorazione iniziale |
| `v2-minimal.html` | Coastal Minimal | Esplorazione Aman/Aesop |
| `v3-editorial.html` | Editorial Bold | Esplorazione magazine cover |
| `scelta.html` | Hub di confronto | Per navigare tra le 4 versioni |

## Stack

- HTML semantico, CSS vanilla, JS vanilla (zero dipendenze, zero build)
- Font: Fraunces (serif editoriale) + Inter (sans)
- Immagini placeholder via Unsplash CDN
- Mappe: OpenStreetMap embed

## SEO

- Meta tag completi (title, description, keywords, geo)
- Open Graph + Twitter Cards
- **Schema.org JSON-LD**: `Hotel`, `Organization`, e 6 `Event` schema per Google Events rich results
- HTML semantico (article, header, time, ARIA)
- Canonical + hreflang

## Sviluppo locale

```bash
# Apri index.html direttamente nel browser
open index.html

# Oppure usa un server statico (consigliato per testare relative paths)
python3 -m http.server 8000
# → http://localhost:8000
```

## Deploy

Il deploy avviene automaticamente su Vercel a ogni push su `main`.

```bash
git push origin main
```

## Sezioni del sito (V4)

1. Hero cinematografico con reveal lettera-per-lettera
2. Marquee con i claim del brand
3. Intro + counter animati
4. Camere & Suite (sezione pinned: immagine si sincronizza con scroll)
5. Colazione (light, con timbro animato)
6. Eventi & Degustazioni (filtri per categoria, aperto al pubblico esterno)
7. Esperienze esclusive (hover image preview)
8. Pull quote a tutto schermo
9. Diario d'isola (blog)
10. Dove siamo (mappa interattiva + tab trasporti + POI)
11. Booking (form prenotazione)

## Contatti hotel

- Indirizzo: Località Pignataro, 98055 Lipari (ME)
- Telefono: 090 9811697
- Email: hotel@pinnata.it
- Stagione: 1 aprile — 31 ottobre
