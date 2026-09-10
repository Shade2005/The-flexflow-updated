# UI kit — Marketing website

Five click-through screens recreating the applied website page of the Brand Identity deck (p.7): dark hero, visible 12-column grid, one Signal button, discipline strip at the foot.

| File | Screen |
|---|---|
| `Chrome.jsx` | `GridField` (the drawn 12-column grid), `Section`, `SectionHead`, `Footer`, and the shared `NAV` / `DISCIPLINES` data |
| `HomeScreen.jsx` | The conversion home page — see below |
| `ServicesScreen.jsx` | Three engagement models, retainer toggle, four-step process |
| `WorkScreen.jsx` | Filterable case list — every row carries a figure |
| `AiVisibilityScreen.jsx` | GEO/AEO hero, prompt citation table, three-move method |
| `ContactScreen.jsx` | Full form with validation, submits into the confirmation dialog |

Open `index.html`. Nav, filters, the retainer switch and the contact form are live; nothing talks to a server.

Everything is composed from `components/` — `Button`, `Tag`, `Badge`, `StatBlock`, `RuleBox`, `Eyebrow`, `NavBar`, `DisciplineStrip`, `Input`, `Select`, `Checkbox`, `Radio`, `Switch`, `Dialog`, `Tooltip`. No primitive is reimplemented here.

The deck ships no photography, so no imagery is used — flat Ink sections only, per the visual foundations.

---

## Home page

The home page has one job: turn a visitor into a booked call or a contact-form submission. Section order, top to bottom:

1. **Hero** — problem-first headline (“Someone asked AI who to hire. It didn’t say you.”), primary *Book a call*, secondary *Contact us*, three stat blocks, discipline strip.
2. **Problem / solution** — four sentences clients actually say, each mapped to the discipline that fixes it and a figure with a timeframe.
3. **Services glimpse** — all five disciplines, one line each, linking out. No detail; the depth lives on `/services`.
4. **Founder** — one point of contact, stated as a trade-off rather than a boast. No team roster, no “meet the team”.
5. **Case glimpse** — three placeholders, labelled *Write-up in preparation*. The figures are real reporting; the narratives are pending client approval.
6. **Process** — Audit → Plan → Execute → Results, with the week each one lands.
7. **Booking** — the single booking widget on the whole site. The scheduler iframe drops into the bordered panel; every other CTA on every page points here or to the contact form.
8. **FAQ** — six objections, cost first. There is no pricing page, so the cost answer lives here.
9. **Final CTA** — display headline, one Signal button.

**Copy rules applied.** Outcome before service name: the reader's situation is stated first and the discipline is named second, so the page never reads as a menu. Every claim carries a figure and a timeframe. No pricing is published — `Book a call` and `Contact us` are the only destinations.

**One accent, one job.** Each viewport shows at most one Signal fill. The nav CTA is present only while no other Signal button is on screen; the hero, the booking panel and the final CTA each own the accent in turn. The static build in `site/index.html` implements that with a single `IntersectionObserver` — visibility only, no entrance motion.

**Slot to fill.** The founder signature block reads “Founder / The FlexFlow” with no name. Swap in the real name and, if there is one, a portrait — noting the brand ships no photography, so an Ink-toned image is the only kind that will sit right.
