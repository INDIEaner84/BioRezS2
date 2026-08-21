# Spooky2 Integration

## Datenbank
- `csharp/Spooky2Provider/Resources/openspooky.db` ( .NET Binary, 397KB) + `presets2.db`
- Im Repo vorhanden, aber verschlüsselt (Reverse Lookup fehlt). Preset TXT Dateien (`List4="10=180,20=180"`) werden via `core/preset.js` geparst.
- Import im Dashboard: `TXT` oder `List4` Drop -> `parsePresetText` -> `presetToExperiment` -> `Sequencer` Timeline. Kein DB-Kopieren nötig.

## Hardware anstecken
1. Treiber: Linux auto, Windows `CP210x_VCP_Windows`, macOS prüfen.
2. Test: `s2 status` -> sollte `Generator 0 Available` zeigen. `s2 run generator=0 preset=".../Detox/Contact/Intestinal Parasites (C) - BY.txt"` (Simulation `s2 run simulation=on ...` ohne Hardware).
3. Dashboard: Läuft im `VIRTUAL` Modus (6 Generatoren simuliert). Für echte Hardware:
   - `node backend/server.js` läuft als Bridge mit `SafetyLayer` davor.
   - `hardware/spooky2-adapter.js` ruft `s2 control generator= X frequency=...` auf.
   - Im Dashboard `G1 HELIOS` -> `...` -> `Hardware: S2 HW G0` erscheint nach `Discover`.
   - `EMERGENCY STOP` schaltet via `s2 control output=off` unabhängig vom UI.

## Warum nicht direkt Browser-USB?
Browser darf nie zeitkritische Hardware direkt steuern (Spec §35). `Control Plane` + `Safety Layer` (20V/1MHz Limit, Watchdog 5s) liegt immer vor Hardware.

## Simulation vs Real
- `simulation=on` (Default im Dashboard) -> `VirtualGenerator` mit Noise/Drift, 0 Risiko.
- `simulation=off` + `Discover` -> echte `Spooky2 XM` wird als `GeneratorBus` Mitglied hinzugefügt, Kalibrierung `unknown` bis manuell kalibriert.

## Kosten/Limit
`s2` ist leichtgewichtig, ideal für Raspberry Pi. Keine proprietäre UI kopiert — nur `ProgramStep` Logik als Inspiration.
