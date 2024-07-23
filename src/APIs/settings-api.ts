import { app, BrowserWindow, ipcMain, screen, dialog, Dialog, OpenDialogReturnValue } from 'electron';
import path = require("path");
import fs = require("fs");

export const SettingsAPI = () => {
    const FOLDER = __dirname.split(".webpack")[0];
    // Get app user settings JSON
	ipcMain.handle("getUserSettings", () => {
		const dataFile = "./src/data/user_data.json";
		try {
			const data = fs.readFileSync(path.join(FOLDER, dataFile), { encoding: "utf-8" });
			// returns a string
			return data;
		}
		catch (e) {
			console.log(e.message);
			return e.message;
		}
	});
	// Set app user settings JSON
	ipcMain.handle("setUserSettings", async (event: Electron.IpcMainInvokeEvent, settings: string) => {
		const dataFile = "./src/data/user_data.json";
        const savedMsg = "Settings saved!";
		try {
			fs.writeFileSync(path.join(FOLDER, dataFile), settings, { encoding: "utf-8" });
			// returns a string
			return savedMsg;
		}
		catch (e) {
			console.log(e.message);
			return e.message;
		}
	});
}