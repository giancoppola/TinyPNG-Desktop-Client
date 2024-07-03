import { app, BrowserWindow, ipcMain, screen } from 'electron';
import path = require("path");
import fs = require("fs");

export const DisplayAPI = () => {
    // Send app all displays
	ipcMain.handle('displays', () => {
		const displays = screen.getAllDisplays();
		return displays;
	});
	// Send app primary display
	ipcMain.handle("primaryDisplay", () => {
		const display = screen.getPrimaryDisplay();
		return display;
	});
}