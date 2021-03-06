const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

global.sharedObject = {
    'user' : null
};

var test = "hallo";

let mainWindow

function createWindow() {
    mainWindow = new BrowserWindow({
        minWidth: 1280,
        minHeight: 720
    })

    mainWindow.loadURL(url.format({
        protocol: 'file:',
        pathname: path.join(__dirname, 'app/index.html'),
        slashes: true
    }))

    mainWindow.webContents.openDevTools()

    mainWindow.on('closed', function () {
        mainWindow = null
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow()
    }
})