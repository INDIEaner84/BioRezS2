# BioRez S2 — Architecture (P1-P3)

## Zielarchitektur

```
Browser UI (Cyberpunk Edel)
  │
  ▼
Scientific Control Layer (API + Safety + Provenance)
  ├── GeneratorBus (N generators, Groups)
  ├── Sync / Phase / Trigger / Clock
  ├── Signal Composer (Addition/Multiplikation/AM/FM/PM/Burst/Sweep)
  └── Safety Layer (limits, watchdog, e-stop)
        │
        ▼
Measurement / Feedback Layer (ADC/Sensor/DAQ)
        │
        ▼
Analysis Engine (FFT/Spectrogram/Statistics/Coherence/Harmonics)
        │
        ▼
Experiment Engine (Versioned, Reproducible)
  ├── Sequencer
  ├── Sweep Engine
  └── Export (CSV/JSON/HDF5/WAV/PNG/SVG/PDF)
```

## Modulstruktur
```
frontend/  -> Dashboard, Plots, Composer, Matrix
core/      -> Generator Interface, GeneratorBus, Clock, Safety, Provenance
hardware/  -> VirtualGenerator, Plugin Interface
analysis/  -> FFT, Spectrogram, Statistics, Harmonics
plugins/   -> GeneratorPlugin, SensorPlugin
experiments/ -> Versioned JSON + Results
tests/     -> Unit + Integration
```

## Hardware Abstraktion
```ts
interface Generator {
  id, name, manufacturer, model, connection, protocol, capabilities,
  sample_rate, clock_source, output_channels, amplitude_range,
  frequency_range, phase_resolution, waveform_types, modulation_capabilities,
  calibration_state, safety_limits
}
```
Implementierungen: Local, USB, Serial, TCP/IP, SCPI, Audio, DAQ, Virtual, Simulation

## Safety Layer
Vor jeder Hardware-Ausgabe:
- absolute frequency/amplitude/DC/duration/duty/slew-rate limits
- watchdog, timeout, emergency stop, disconnect detection
- OUTPUT → OFF bei Überschreitung, unabhängig vom UI-State

## Clock Modell
System Clock vs Generator Clock vs External Reference vs Measurement Clock vs Trigger Clock
Anzeige: source, accuracy, stability, jitter, drift. NTP ≠ Phasensynchronisation.

## Echtzeit
UI -> Control API -> Realtime Engine -> Hardware Adapter
UI nie direkt zeitkritisch. WebSocket für Live-Daten.

## Provenance
Result -> Analysis -> Measurement -> Sensor -> Signal -> Generator -> Experiment -> Configuration
Jeder Lauf: timestamp, software/hardware/firmware, settings, calibration, seeds, results
