// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";

// App data from context bridge, similar to Model data in .NET MVC should be null checked
contextBridge.exposeInMainWorld('APP', {
	'versions': {
		node: process.versions.node,
		chrome: process.versions.chrome,
		electron: process.versions.electron
	},
	'API': {
		displays: () => getDisplays(),
		primaryDisplay: () => getPrimaryDisplay(),
		getUserData: () => getUserData(),
	}
})

const getDisplays = async () => {
	const displays = await ipcRenderer.invoke("displays");
	return displays;
}

const getPrimaryDisplay = async () => {
	const display = await ipcRenderer.invoke("primaryDisplay");
	return display;
}

const getUserData = async () => {
	const data = await ipcRenderer.invoke("userData");
	return data;
}

const setUserData = async (data: any) => {
	// something
}