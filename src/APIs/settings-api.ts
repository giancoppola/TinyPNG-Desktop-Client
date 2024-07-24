import { app, BrowserWindow, ipcMain, screen, dialog, Dialog, OpenDialogReturnValue } from 'electron';
import path = require("path");
import fs = require("fs");

// In main.ts, before app starts we check for whether the user_data.json exists,
// and if not the file is created based on the template in types.ts

export const SettingsAPI = () => {
    const DATA_FILE = path.join(app.getPath("userData"), "user_data.json")
    // Get app user settings JSON
	ipcMain.handle("getUserSettings", () => {
		const dataFile = "/data/user_data.json";
		try {
			const data = fs.readFileSync(DATA_FILE, { encoding: "utf-8" });
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
		const dataFile = "/data/user_data.json";
        const savedMsg = "Settings saved!";
		try {
			fs.writeFileSync(DATA_FILE, settings, { encoding: "utf-8" });
			// returns a string
			return savedMsg;
		}
		catch (e) {
			console.log(e.message);
			return e.message;
		}
	});
}