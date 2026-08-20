# P0 Discovery — BioRez S2 Scientific Platform + Cyberpunk Edel Dashboard

## Repository-Analyse
- Legacy: C++11 `s2` CLI für Spooky2 Generatoren (USB/Serial) + C# (S2Forms/SimpleForms) WinForms
- Kein Web-Stack, keine API, keine Hardware-Abstraktion
- Stärken: Waveforms, Program-Parsing, Generator-Protokoll vorhanden — als Referenz für VirtualGenerator nutzbar

## Architektur Gap Analyse (Auszug)
- Deterministisches Timing / Trigger Latenz fehlt komplett
- Clock Drift/Jitter/Phase Coherence nicht modelliert
- Hardware-Abstraktion: nur `Generator` class, kein Plugin-Interface
- Calibration / Uncertainty / Provenance nicht vorhanden
- Real-Time: keine Trennung Control/Data/Analysis Plane
- Data Integrity: kein Buffering/Dropped Samples/Backpressure

## Technologieempfehlung für Web-Dashboard
- Frontend: Vanilla HTML/CSS/JS + Canvas 2D (kein Build-Step nötig für P0 Prototyp), später Vite + TS + WebGL für Waterfall
- Backend (zukünftig): Rust oder Go Realtime Engine + WebSocket, SQLite/HDF5 Persistence
- Design: Cyberpunk Edel — dunkles Glas, Neon-Cyan/Magenta, Gold-Akzente, Grid, Partikel, Scanline

## Dashboard (P0 Prototyp) — Geliefert
- Live: Oszilloskop, FFT, Spektrogramm, Korrelation/Phase-Wheel
- GeneratorBus N unlimited, Signal Composer (drag nodes), Matrix, Sequencer, Chain, Health
- Virtueller Generator mit Sinus/Rechteck/Dreieck/Säge/Puls/Noise + Jitter/Drift Simulation
- Safety Layer (Emergency Stop, Watchdog, Limits), Audit Trail, Provenance Tags

## Offene Fragen
- Phys. Hardware-Anbindung: SCPI/Serial/USB via WebSerial oder Backend Bridge?
- PTP vs 10MHz Referenz — Hardware-Entscheidung
