# Interactive Portfolio — Life Timeline Experiment

This is an experimental personal portfolio built around the idea of a **life journey**, not a collection of sections.

Instead of navigating pages, the viewer scrolls through a timeline. Each scroll advances the experience into a new stage, represented as its own environment.

At every stage, two perspectives coexist:
- the **technical work** I was doing at that point
- the **broader story** and context around it

Both views are visible together, revealing different interpretations of the same moment rather than forcing a single narrative.

---

## Conceptual References

The structure is intentionally inspired by narrative systems outside the web:

- **MCU-style worlds**  
  Different planets represent distinct stages of the timeline — separate environments that still belong to one continuous arc.

- **Assassin’s Creed–inspired DNA mode**  
  The timeline can be revisited through memory, lineage, and context, not just surface events.

- **Split Fiction–style dual perspective**  
  A moving divider reveals two perspectives simultaneously, showing how technical output and personal growth overlap rather than diverge.

These references inform the structure, not the visuals alone.

---

## Technical Overview

**Stack**
- HTML, CSS, JavaScript
- React (used as a thin rendering shell)
- Three.js for 3D environments

Most of the work lives outside typical framework abstractions and focuses on:
- scroll intent vs animation timing
- state continuity across transitions
- preventing visual snapping between stages
- managing performance differences across machines

The visuals are deliberate, but the real complexity is in keeping the system coherent over time.

---

## Status

This project is still evolving.

Some parts are intentionally left open, and not every edge is fully smoothed. The goal is not polish for its own sake, but clarity of idea and structure.

---

## Links

- **Live site:** https://www.abdullahomer.com
- **Code:** this repository

---

## Notes

This is not meant to be a template or a best-practice example.  
It’s an exploration of how narrative, motion, and system design can coexist in a personal space.
