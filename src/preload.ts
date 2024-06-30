// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { Display, contextBridge, ipcRenderer } from "electron";

// App data from context bridge, similar to Model data in .NET MVC should be null checked
contextBridge.exposeInMainWorld('APP', {
    'versions': {
        node: process.versions.node,
        chrome: process.versions.chrome,
        electron: process.versions.electron
    },
    'API': {
        ping: () => sendPing(),
        displays: () => sendDisplays(),
    }
})

const sendPing = async () => {
    const ping = await ipcRenderer.invoke("ping");
    console.log(ping);
}

const sendDisplays = async () => {
    const displays = await ipcRenderer.invoke("displays")
    return displays
}