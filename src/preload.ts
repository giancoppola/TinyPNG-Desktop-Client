// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";
import { UserSettings, ImgCompressSettings } from "./app/types";

// App data from context bridge, similar to Model data in .NET MVC should be null checked
contextBridge.exposeInMainWorld('APP', {
	'versions': {
		node: process.versions.node,
		chrome: process.versions.chrome,
		electron: process.versions.electron
	},
	'API': {
		getUserSettings: () => getUserSettings(),
		setUserSettings: (settings: UserSettings) => setUserSettings(settings),
		getFolder: () => getFolder(),
		getFiles: () => getFiles(),
		tinifyFiles: (settings: ImgCompressSettings) => tinifyFiles(settings),
		tinifyApiKeyCheck: (apiKey: string) => tinifyApiKeyCheck(apiKey),
		tinifyCompressionsCheck: (apiKey: string) => tinifyCompressionsCheck(apiKey),
	}
})

const getUserSettings = async () => {
	const data = await ipcRenderer.invoke("getUserSettings");
	return data;
}

const setUserSettings = async (settings: UserSettings) => {
	const res = await ipcRenderer.invoke("setUserSettings", JSON.stringify(settings));
	return res;
}

const getFolder = async () => {
	const dir = await ipcRenderer.invoke("getFolder");
	return dir;
}

const getFiles = async () => {
	const files = await ipcRenderer.invoke("getFiles");
	return files;
}

const tinifyFiles = async (settings: ImgCompressSettings) => {
	const res = await ipcRenderer.invoke("tinifyFiles", settings);
	return res;
}

const tinifyApiKeyCheck = async (apiKey: string) => {
	const res = await ipcRenderer.invoke("tinifyApiKeyCheck", apiKey);
	return res;
}

const tinifyCompressionsCheck = async (apiKey: string) => {
	const res = await ipcRenderer.invoke("tinifyCompressionsCheck", apiKey);
	return res;
}