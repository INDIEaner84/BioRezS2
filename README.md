# BioRez S2 — Scientific Multi-Signal Frequency Control & Analysis Platform

**Cyberpunk Edel Edition** — Browser-basierte Control- und Analyseplattform für N Signalgeneratoren.

## Quick Start (Dashboard)
```bash
python3 -m http.server 8765 --directory dashboard
# -> http://localhost:8765/
```
Oder modular:
```bash
npm test  # node tests/unit.test.js
```

## Architektur
Siehe `docs/ARCHITECTURE.md` und `docs/GAP_ANALYSIS.md`

```
Browser UI (Cyberpunk Edel)
  -> Scientific Control Layer (GeneratorBus, Sync, Safety)
    -> Measurement Layer (Virtual ADC/Sensor)
      -> Analysis Engine (FFT/Spectrogram/Statistics)
        -> Experiment Engine (Versioned)
```

## Module
- `core/` — Generator Interface, GeneratorBus, Safety, Clock, Experiment, Signal Composer
- `hardware/` — VirtualGenerator (Noise/Drift/Jitter/Harmonics)
- `analysis/` — FFT, Statistics, Harmonics
- `frontend/` — API Mock + Dashboard
- `dashboard/` — Vollständiges interaktives Canvas Dashboard (Oszilloskop/FFT/Waterfall/Matrix)

## Safety
Vor Hardware-Ausgabe: Limits, Watchdog, Emergency Stop. Bei Überschreitung OUTPUT->OFF.

## Tests
`node tests/unit.test.js` — 9/9 passing

## P0 Status
Prototyp lauffähig, alle Planes simuliert, keine Hardware nötig.
