import { app, BrowserWindow, ipcMain, screen, dialog, Dialog, OpenDialogReturnValue } from 'electron';
import tinify = require("tinify");
import path = require("path");
import { ImgCompressSettings } from '../app/types';

export const TinifyAPI = () => {
    ipcMain.handle("tinifyFiles", async (event: Electron.IpcMainInvokeEvent, settings: ImgCompressSettings) => {
		let files: string[] = [];
        let errorMsg: string = "";
        try {
            tinify.key = settings.api_key;
            for (const filePath of settings.file_names) {
                let nameArr = filePath.split("/");
                let name = nameArr[nameArr.length - 1];
                let fileType = "." + name.split(".")[1];
                name = name.split(".")[0];
                    await tinify.fromFile(filePath).toFile(`${settings.output_loc}/${name}${fileType}`, (err) => {
                        console.log('here');
                        if (err instanceof tinify.AccountError) {
                            errorMsg = err.message;
                            console.log(err.message);
                            return new Error(err.message);
                        } else if (err instanceof tinify.ClientError) {
                            errorMsg = err.message;
                            console.log(err.message);
                            return new Error(err.message);
                        } else if (err instanceof tinify.ServerError) {
                            errorMsg = err.message;
                            console.log(err.message);
                            return new Error(err.message);
                        } else if (err instanceof tinify.ConnectionError) {
                            errorMsg = err.message;
                            console.log(err.message);
                            return new Error(err.message);
                        } else {
                            errorMsg = err.message;
                            console.log(err.message);
                            return new Error("Random error with Tinify");
                        }
                    });
                files.push(name);
            }
        }
        catch (e) {
            console.log(e.message);
            return e.message;
        }
        console.log("returning");
        return `Compressed ${files}`;
	});
}