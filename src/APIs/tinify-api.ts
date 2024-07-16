import { app, BrowserWindow, ipcMain, screen, dialog, Dialog, OpenDialogReturnValue } from 'electron';
import tinify = require("tinify");
import path = require("path");
import { ImgCompressSettings } from '../app/types';

export const TinifyAPI = () => {
    ipcMain.handle("tinifyFiles", async (event: Electron.IpcMainInvokeEvent, settings: ImgCompressSettings) => {
		let files: string[] = [];
        tinify.key = settings.api_key;
        for (const filePath of settings.file_names) {
            let nameArr = filePath.split("/");
            let name = nameArr[nameArr.length - 1];
            let fileType = "." + name.split(".")[1];
            name = name.split(".")[0];
            const source = tinify.fromFile(filePath);
            source.toFile(`${settings.output_loc}/${name}${fileType}`);
        }
        return files;
	});
}