const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let pythonProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // Nota: En producción idealmente usa preload scripts
    },
  });

  // En desarrollo carga la URL de Vite, en producción cargará el archivo html
  const isDev = process.env.NODE_ENV !== 'production';
  const startUrl = isDev ? 'http://localhost:5173' : `file://${path.join(__dirname, '../frontend/dist/index.html')}`;

  mainWindow.loadURL(startUrl);

  mainWindow.on('closed', () => (mainWindow = null));
}

function startPython() {
  // Ajustamos la ruta según el sistema operativo
  // En Linux/Mac buscamos en backend/venv/bin/python
  const pythonExecutable = path.join(__dirname, '../backend/venv/bin/python');
  const scriptPath = path.join(__dirname, '../backend/app.py');

  pythonProcess = spawn(pythonExecutable, [scriptPath]);

  pythonProcess.stdout.on('data', (data) => {
    console.log(`[Python]: ${data}`);
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`[Python Error]: ${data}`);
  });
}

app.on('ready', () => {
  startPython();
  createWindow();
});

// Matar el proceso de Python cuando cerramos la ventana
app.on('will-quit', () => {
  if (pythonProcess) {
    pythonProcess.kill();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});