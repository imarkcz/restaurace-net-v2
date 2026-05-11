# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Co tento projekt je

**Variant B** webu pro Restaurant NET v Uherském Hradišti — alternativní design k hlavní verzi v `../NET RESTAURACE WEB/`. Klient si vybírá mezi A (editorial luxury) a B (photography-driven hospitality).

- **Inspirace:** Feliciano template (Colorlib) — dark hero s flat-lay food photography, cursive script accents, dish card grids
- **Obsah:** Identický s variantou A — adresa Jindřícha Průchy 310, telefon +420 572 552 597
- **Repo:** vlastní GitHub (oddělené od `restaurace-net`)
- **Produkce:** vlastní Vercel deploy (oddělený URL)

## Tech stack

| Soubor | Účel |
|---|---|
| `index.html` | Celá stránka, ~340 řádků, sekce oddělené `═══` komentáři |
| `style.css` | Styly v jednom souboru, ~1000 řádků |
| `script.js` | Externí JS (na rozdíl od v1, která má inline script) — modernější struktura |
| `images/` | Sdílené assets se v1 (hero.mp4/webm, salonek.webp, vstup.webp) |

## Příkazy

```bash
# Lokální dev
python -m http.server 8081
# → http://localhost:8081

# Deploy (po setup GitHub + Vercel)
git add . && git commit -m "..." && git push
```

## Design systém — odlišnosti od v1

Stejné typografické základy (Source Sans 3 body, Cormorant Garamond display), ale přibyl **třetí font**:

- **Allura** (cursive script) — section eyebrows („Restaurant", „Akce", „Naše menu", „Polední menu", „Spokojení hosté", „Kontakt")
- **Cormorant Garamond** — uppercase headlines, dish names italic, big numbers, hero title
- **Source Sans 3** — body, buttons, labels

### Barvy
```css
--bg-dark:   #0E0C0A    /* almost-black s warm tint, ne #000 */
--bg-cream:  #FAF5EC    /* warm content background */
--bg-white:  #FFFFFF
--gold:      #C9A659    /* primary accent */
--gold-2:    #B8943C    /* deeper gold pro headline italic */
--gold-warm: #E0BE76    /* lighter — na tmavém pozadí */
--gold-tag:  #FFC230    /* "Rezervovat" CTA tag */
--text:      #1A1614
```

## Struktura sekcí

1. **Nav** — fixed glass pill, transparent → dark s blur při scrollu
2. **Hero** — fullscreen tmavý, video background, cursive „Restaurant" + uppercase „POCTIVÁ & MORAVSKÁ" + 4 floating dish cards
3. **About** — split fotka (salonek lg + vstup sm), telefon CTA, 4 stat counters s animací
4. **Services** — 3 cards (Narozeniny, Firemní, Svatby) s SVG ikonami v gold kruzích
5. **Menu (Specialties)** — 6-card grid s placeholders pro fotky jídel, „Rezervovat" badge
6. **Daily menu** — kompaktní list dnešní nabídky (z menicka.cz)
7. **Banner** — full-width salónek photo s overlay text „Oslavte vše, co stojí za to"
8. **Testimony** — 3 review karty s gold quote markem
9. **Contact** — 2-col + map (CSS filter pro dark mode mapa)
10. **Footer** — 4-col tmavý

## JavaScript funkce

`script.js` má 9 modulů:
- Nav scroll state
- Hamburger mobile menu
- Hero video bulletproof fade-in + slow-cinema 0.85× playback
- Dnešní datum česky
- IntersectionObserver scroll-reveal
- Scroll-spy aktivní link
- Smooth scroll s nav offsetem
- **Stat counter animation** (ease-out-expo) — animuje 0 → target value
- **Magnetic 3D tilt** dish cards (pouze pro hover-capable devices)
- Hero mouse parallax (jemný drift)

## Pravidla designu

Stejná jako v1 + dodatečně:
- Cursive script (Allura) **vždy v gold barvě** — eyebrows, brand, footer
- Section eyebrows v cursive + uppercase serif title kombinace — Feliciano signature pairing
- Dish cards mají **placeholder photo gradient** (až klient dodá fotky, nahradíme `<img>`)
- Banner image má **sepia + brightness 0.45** filter pro dramatický look

## TODO před produkcí

- [ ] **Fotky jídel** — momentálně placeholder boxy s [ FOTO ] textem. Klient musí dodat min. 10 fotek jídel pro hero cards + menu grid + dish-card thumbnails.
- [ ] **Daily menu data** — aktuálně tvrdě zapsané. Stejný plán automatizace přes menicka.cz scrape jako u v1.
- [ ] **Recenze** — stále placeholder (Lucie Novotná atd.). Nahradit reálnými z Google profile.
- [ ] **Formulář** — `action="#"`, napojit na FormSpree / Web3Forms.

## Vztah k variantě A

Toto je **alternativní design**, ne nahrazení. Klient si vybírá. Pokud zvolí v2:
- Migrují se aktuální data (kontakt, polední menu) sem
- v1 archivovat (ale ne smazat — historie)
- v2 nasadit na hlavní doménu

Pokud zvolí v1: tato složka zůstává jako reference, později se může zlikvidovat.

## Skills aplikované

- `frontend-design` — premium production UI
- `high-end-visual-design` — Hospitality / Photography-Driven archetyp (ne Editorial Luxury jako v1)
- `design-taste-frontend` — anti-emoji, custom cubic-bezier, anti-3-col-cards (porušujeme záměrně pro Services/Menu — match s template inspirací)
- `impeccable` — WCAG-AA contrast, no `#000`, layout transitions on transform, OKLCH-ready palette

## Užitečné

- Lokální dev: `python -m http.server 8081` (jiný port než v1 který běží na 8080, ať můžou běžet paralelně)
- Web vytvořil: **Mark Bobčík**
