const { contextBridge, ipcRenderer } = require('electron');
const Store = require('electron-store');
const store = new Store({ name: 'blender-tutor-store' });

contextBridge.exposeInMainWorld('electronAPI', {
  saveProgress: (data) => {
    store.set('progress', data);
    return true;
  },
  loadProgress: () => {
    return store.get('progress') || {};
  },
  toggleFullscreen: () => ipcRenderer.invoke('toggle-fullscreen'),
  setFullscreen: (value) => ipcRenderer.invoke('set-fullscreen', value)
});
