# API — P34

## REST
```
GET    /api/generators
GET    /api/generators/:id
POST   /api/generators/:id/config
POST   /api/generators/:id/start
POST   /api/generators/:id/stop
POST   /api/experiment
GET    /api/experiment/:id
POST   /api/measurement
GET    /api/analysis/:id
GET    /api/health
```

## WebSocket (Live)
```
ws://localhost:3001/ws
-> {t, samples:[256], fft:{peaks}, stats:{rms}}
```

Trennung: UI -> Control API -> Realtime Engine -> Hardware Adapter
UI nie direkt zeitkritisch.

Mock läuft mit `node backend/server.js`
