'use strict';

const electron = require('electron');
const {Menu} = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const windowStateKeeper = require('electron-window-state');


let willQuitApp = false;
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow () {
  let mainWindowState = windowStateKeeper({
    defaultWidth: 701,
    defaultHeight: 450
  });


  mainWindow = new BrowserWindow({
      height: mainWindowState.height,
      resizable: true,
      width: mainWindowState.width,
      minWidth: 120,
      minHeight: 38,
      acceptFirstMouse: true,
      icon: 'icon.png',
      titleBarStyle: 'hidden'
  });


  mainWindow.setMenu(null);
  mainWindow.loadURL('file://' + __dirname + '/app/index.html');
  //mainWindow.webContents.openDevTools();

  mainWindow.on('close', function(e) {
    if (willQuitApp || process.platform !== 'darwin') {
      /* the user tried to quit the app */
      mainWindow = null;
    } else {
      /* the user only tried to close the window */
      e.preventDefault();
      mainWindow.hide();
    }
  });
  
  mainWindowState.manage(mainWindow);


  // Create the Application's main menu
  if (process.platform == 'darwin') { // To enable shortcuts on OSX

    var template = [{
          label: "Harmony",
          submenu: [
              { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
              { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
              { type: "separator" },
              { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
              { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
              { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
              { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" },
              { type: "separator" },
              { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
          ]}
      ];

      Menu.setApplicationMenu(Menu.buildFromTemplate(template));
  }


}

app.setName('Harmony');

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

// 'activate' is emitted when the user clicks the Dock icon (OS X)
app.on('activate', function () {
  mainWindow.show();
});

// 'before-quit' is emitted when Electron receives 
// the signal to exit and wants to start closing windows
app.on('before-quit', function () {
  willQuitApp = true;
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});