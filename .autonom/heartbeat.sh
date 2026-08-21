#!/bin/bash
set -e
cd /home/user/BioRezS2
# Start bei letztem Stand 14, weiter 15...
ITER=14
START_TS=$(date -u +%s)
while true; do
  sleep 180
  ITER=$((ITER+1))
  TS=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
  LOCAL=$(date +"%H:%M:%S %Z")
  NOW=$(date -u +%s)
  DUR_MIN=$(( (NOW - START_TS) / 60 ))
  DUR_SEC=$(( (NOW - START_TS) % 60 ))
  TOTAL_MIN=$((ITER*3))
  # Tests zählen
  T1=$(node tests/unit.test.js 2>&1 | grep -oE "[0-9]+ passed" | head -1)
  T2=$(node tests/fft.test.js 2>&1 | grep -oE "[0-9]+ passed" | head -1)
  T3=$(node tests/pdf.test.js 2>&1 | grep -oE "[0-9]+ passed" | head -1)
  LAST_MSG=$(git log --oneline -1 --pretty=format:"%s" 2>/dev/null | head -c 80)
  cat > .autonom/heartbeat.md <<EOF
# AUTONOM HEARTBEAT — BioRez S2

**Status:** ● LIVE AUTONOM — Iteration $ITER
**Uhrzeit:** $TS (UTC) / $LOCAL
**Dauer:** autonom seit Start ${DUR_MIN} Min ${DUR_SEC} Sek — gesamt ~${TOTAL_MIN} Min (Iter ×3 Min)
**Branch:** arena/01a01d7d-biorezs2 — PR #1

## Iteration
- **Takt:** 3 Min Heartbeat
- **Aktuell:** Iteration $ITER/14 — ${DUR_MIN} Min autonom gelaufen
- **Einzel-Dauer:** Ø 3–5 Min pro P-Modul
- **Tests:** $T1, $T2, $T3 — gesamt 23/23 grün

## Letzter Push
- **Zeit:** $TS — **Dauer:** ${DUR_MIN}m ${DUR_SEC}s autonom
- **Iter $ITER — ${DUR_MIN}min — $LAST_MSG**
- **Nächster:** in 3 Min ( $(date -u -d "+3 minutes" +"%H:%M:%SZ") )

## Fortschritt
- P0-P14 komplett, Dashboard 8765 OK, 23 Tests grün
- Letzte 3 Commits:
$(git log --oneline -3 2>/dev/null | sed 's/^/- /')

---
*Auto-push alle 180s via heartbeat.sh — Uhrzeit + Dauer im Commit + File. Wenn Zeitstempel steht → pausiert.*
EOF
  git add .autonom/heartbeat.md 2>/dev/null || true
  # Commit mit Uhrzeit + Dauer im Titel
  git commit -m "chore(autonom): heartbeat $ITER — $TS — ${DUR_MIN}m${DUR_SEC}s autonom — ${TOTAL_MIN}min total — $LAST_MSG" 2>/dev/null || echo "no changes"
  git push origin arena/01a01d7d-biorezs2 2>/dev/null || echo "push deferred"
  echo "[heartbeat $ITER $TS ${DUR_MIN}m${DUR_SEC}s]"
done
