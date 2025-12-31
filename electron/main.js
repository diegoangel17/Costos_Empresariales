const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const net = require('net'); 

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
  const port = 5001; // Tu puerto de Flask
  const client = new net.Socket();

  // Intentamos conectar al puerto 5001
  client.connect(port, '127.0.0.1', () => {
    // ÉXITO: Alguien ya está escuchando en el 5001
    console.log(`[Electron]: El puerto ${port} ya está en uso. Asumiendo que el backend ya está corriendo.`);
    client.destroy(); // Cerramos este test de conexión
    // NO lanzamos pythonProcess, usamos el existente.
  });

  client.on('error', (err) => {
    // ERROR: Nadie escucha en el 5001 (o error de conexión) -> LANZAMOS PYTHON
    console.log(`[Electron]: Puerto ${port} libre. Iniciando servidor Python...`);
    
    // --- AQUÍ VA TU LÓGICA ORIGINAL DE SPAWN ---
    const pythonExecutable = path.join(__dirname, '../backend/venv/bin/python');
    const scriptPath = path.join(__dirname, '../backend/app.py');

    pythonProcess = spawn(pythonExecutable, [scriptPath]);

    pythonProcess.stdout.on('data', (data) => {
      console.log(`[Python]: ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`[Python Error]: ${data}`);
    });
    // -------------------------------------------
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

// --- AGREGAR ESTO PARA EVITAR PROCESOS ZOMBIE ---

function killPythonSubprocess() {
  if (pythonProcess) {
    console.log('Matando proceso de Python...');
    pythonProcess.kill(); // Envía SIGTERM
    pythonProcess = null;
  }
}

// Manejar Ctrl+C en la terminal (Windows/Linux)
process.on('SIGINT', () => {
  killPythonSubprocess();
  app.quit();
  process.exit(0);
});

// Manejar kill genérico
process.on('SIGTERM', () => {
  killPythonSubprocess();
  app.quit();
  process.exit(0);
});