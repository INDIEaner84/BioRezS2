# Architecture Gap Analysis — Vollständig

## Untersuchte Bereiche (Spec §38)

### Deterministisches Timing
- **Gap:** Original nur sequentiell, kein Trigger, keine Latenzkompensation.
- **Lösung:** Trigger Clock + latency compensation + deterministic sequencer tick 1ms.

### Clock Drift / Jitter / Phase Coherence
- **Gap:** Keine Modellierung.
- **Lösung:** ClockArchitecture mit 5 Clocks, Anzeige jitterNs, drift ppm/h, Q.

### Hardware Abstraktion / Plugin Security
- **Gap:** Feste Generator Klasse.
- **Lösung:** Generator Interface + GeneratorBus + Plugin Interface + Capability Negotiation.

### Calibration / Uncertainty / Provenance
- **Gap:** Fehlend.
- **Lösung:** Calibration State pro Gerät, Measurement Uncertainty Modell, Provenance Kette Result->...->Configuration.

### Real-Time / Dropped Samples / Buffering
- **Gap:** Kein Backpressure.
- **Lösung:** Ringbuffer 48k*10s, WebSocket backpressure, Indikator droppedSamples.

### Concurrency / Race Conditions
- **Gap:** Keine Locks.
- **Lösung:** Experiment Locking, API Versioning, Command Queue.

### Fail-Safe / Hardware Disconnect / Recovery
- **Gap:** Keine Watchdog.
- **Lösung:** Safety Layer OUTPUT->OFF, Watchdog 5s, disconnect detection, recovery state.

### Permissions / Multi-User
- **Gap:** Single User.
- **Lösung:** Operator-Rolle, Audit Trail, Experiment Locking.

### Storage / Versioning / Reproducibility
- **Gap:** Keine Versionierung.
- **Lösung:** Experiment als versionierte JSON (history array), randomSeeds, env metadata.

### Weitere: Device Discovery, Firmware Compat, PTP, GPU Acceleration, Long-Running, Offline, Network, DB Evolution
- **Lösung:** mDNS Discovery, Firmware Check, PTP Clock, GPU FFT Fallback, IndexedDB offline, Migration Scripts.

## Risiken
- Echtzeit im Browser limitiert -> Realtime Engine muss nativ (Rust/Go) laufen.
- 48k * N Generatoren -> CPU/GPU Budget planen.
- Kalibrierung ohne Referenz -> Unsicherheit markieren.

## Offene Fragen
- Phys. Interface: WebSerial vs Backend Bridge?
- PTP vs 10MHz Verteilung?
