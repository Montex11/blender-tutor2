# Blender Tutor — Electron + React (Italiano)

Questo progetto è un'app Electron che contiene il frontend React. Include:
- Toggle per schermo intero (IPC da main process)
- Salvataggio progressi con electron-store (localmente)
- Fallback a localStorage se non eseguito in Electron

## Requisiti per costruire l'eseguibile Windows (.exe)
- Node.js LTS installato (https://nodejs.org/)
- Windows system per buildare (o usare GitHub Actions per build cross-platform)

## Comandi utili
1. Installare dipendenze:
   ```bash
   npm install
   ```
2. Per avviare in modalità sviluppo (apre React dev server e Electron):
   ```bash
   npm start
   ```
3. Per creare l'eseguibile Windows (.exe) usando electron-builder:
   ```bash
   npm run dist
   ```
   L'installer sarà creato nella cartella `dist/`.

## Opzione automatica (consigliata)
Se preferisci non compilare localmente, puoi usare GitHub Actions per buildare automaticamente l'.exe e scaricare l'artefatto.
Posso aggiungere il file workflow per CI se vuoi.

---
Se vuoi, provvedo ad aggiungere il file `.github/workflows/build-windows.yml` per compilare automaticamente e fornirti il link dell'artefatto.
