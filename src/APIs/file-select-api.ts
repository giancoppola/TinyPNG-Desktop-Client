import { app, BrowserWindow, ipcMain, screen, dialog, Dialog, OpenDialogReturnValue } from 'electron';
import path = require("path");
import fs = require("fs");

export const FilesAPI = () => {
    const FOLDER = __dirname.split(".webpack")[0];
	ipcMain.handle("getFolder", async () => {
		let dir: OpenDialogReturnValue = await dialog.showOpenDialog({
			title: "Choose a directory",
			buttonLabel: "Select Folder",
			properties: ["openDirectory", "createDirectory"]
		})
		return dir.filePaths[0];
	})
	ipcMain.handle("getFiles", async () => {
		let dir: OpenDialogReturnValue = await dialog.showOpenDialog({
			title: "Choose your image files (WEBP, PNG, or JPEG)",
			buttonLabel: "Select Files",
			properties: ["openFile", "multiSelections"]
		})
		return dir.filePaths;
	})
}