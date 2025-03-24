const { app, BrowserWindow, ipcMain, clipboard } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    icon: path.join(__dirname, 'MyIcon.iconset/favicon-192.png'),
    backgroundColor: '#1e1e1e',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('execute-command', (event, command) => {
  exec(command, (error, stdout, stderr) => {
    if (error) {
      event.reply('command-result', { error: stderr });
      return;
    }
    event.reply('command-result', { output: stdout });
  });
});

ipcMain.on('copy-to-clipboard', (event, text) => {
  clipboard.writeText(text);
  event.reply('clipboard-copied', true);
});