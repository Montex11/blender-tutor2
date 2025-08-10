const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

function createWindow () {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    },
    show: false,
  });

  // Load react dev server in development, otherwise load build index.html
  if (isDev) {
    win.loadURL('http://localhost:3000');
  } else {
    win.loadFile(path.join(__dirname, '..', 'build', 'index.html'));
  }

  win.once('ready-to-show', () => {
    win.show();
  });

  // Fullscreen toggle via IPC
  ipcMain.handle('toggle-fullscreen', (event) => {
    const isFull = win.isFullScreen();
    win.setFullScreen(!isFull);
    return !isFull;
  });

  ipcMain.handle('set-fullscreen', (event, value) => {
    win.setFullScreen(!!value);
    return win.isFullScreen();
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
