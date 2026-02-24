const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

const SAVE_PATH = path.join(app.getPath('userData'), 'save.json');

function createWindow() {
    const win = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    // In development, load from Vite dev server
    if (!app.isPackaged) {
        win.loadURL('http://localhost:5173');
    } else {
        win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
    }
}

// ─── IPC handlers for save / load / delete ──────────────────────

ipcMain.handle('save-game', async (_event, data) => {
    fs.writeFileSync(SAVE_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
});

ipcMain.handle('load-game', async () => {
    if (fs.existsSync(SAVE_PATH)) {
        const raw = fs.readFileSync(SAVE_PATH, 'utf-8');
        return JSON.parse(raw);
    }
    return null;
});

ipcMain.handle('delete-save', async () => {
    if (fs.existsSync(SAVE_PATH)) {
        fs.unlinkSync(SAVE_PATH);
    }
    return true;
});

// ─── App lifecycle ──────────────────────────────────────────────

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    app.quit();
});
