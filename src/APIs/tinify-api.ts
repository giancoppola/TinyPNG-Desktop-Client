import { app, BrowserWindow, ipcMain, screen, dialog, Dialog, OpenDialogReturnValue } from 'electron';
import tinify = require("tinify");
import path = require("path");
import { ImgCompressSettings } from '../app/types';

export const TinifyAPIFiles = () => {
    ipcMain.handle("tinifyFiles", async (event: Electron.IpcMainInvokeEvent, settings: ImgCompressSettings) => {
		let files: string[] = [];
        try {
            tinify.key = settings.api_key;
            for (const filePath of settings.file_names) {
                let nameArr = filePath.split("/");
                let name = nameArr[nameArr.length - 1];
                let fileType = "." + name.split(".")[1];
                name = name.split(".")[0];
                try {
                    await tinify.fromFile(filePath).toFile(`${settings.output_loc}/${name}${fileType}`);
                    files.push(name);
                } catch (err) {
                    if (err instanceof tinify.AccountError) {
                        throw new Error(err.message);
                    } else if (err instanceof tinify.ClientError) {
                        throw new Error(err.message);
                    } else if (err instanceof tinify.ServerError) {
                        throw new Error(err.message);
                    } else if (err instanceof tinify.ConnectionError) {
                        throw new Error(err.message);
                    } else {
                        throw new Error("Random error with Tinify");
                    }
                }
            }
        }
        catch (e) {
            console.log(e.message);
            return e.message;
        }
        return `Compressed ${files}`;
	});
}

export const TinifyAPIKeyCheck = async () => {
    ipcMain.handle("tinifyApiKeyCheck", async (event: Electron.IpcMainInvokeEvent, settings: ImgCompressSettings) => {
        tinify.key = settings.api_key;
        try {
            await tinify.validate()
        }
        catch (e) {
            console.log(e);
            return false;
        }
        return true;
    })
}

export const TinifyAPI = () => {
    TinifyAPIFiles();
    TinifyAPIKeyCheck();
}