import { app, BrowserWindow, ipcMain, screen, dialog, Dialog, OpenDialogReturnValue } from 'electron';
import tinify = require("tinify");
import path = require("path");
import fs = require("fs");
import { ImgCompressSettings, ApiCompleteResponse, ImgFile } from '../app/types';

const GenerateNewFilePath = (output_location:string, path: string): string => {
    if (!fs.existsSync(output_location)) {
        fs.mkdirSync(output_location);
    }
    const fileArr = path.split("/");
    const file = fileArr[fileArr.length - 1];
    return `${output_location}/${file}`
}

const TinifyNewLocation = async (settings: ImgCompressSettings): Promise<ApiCompleteResponse> => {
    try{
        for (const file of settings.files) {
            let newLocation = GenerateNewFilePath(settings.output_loc, file.path);
            try {
                console.log(file.path);
                await tinify.fromFile(file.path).toFile(newLocation);
            }
            catch (err) {
                if (err.message) {
                    throw new Error(err.message);
                }
                else {
                    throw new Error("Unknown error with Tinify")
                }
            }
        }
        return {
            success: true,
            msg: "Completed all compressions without error"
        }
    }
    catch(err) {
        if (err.message) {
            return {
                success: false,
                msg: err.message
            };
        }
        else {
            return {
                success: false,
                msg: "Unknown error with Tinify"
            };
        }
    }
}

export const TinifyAPIFiles = () => {
    ipcMain.handle("tinifyFiles", async (event: Electron.IpcMainInvokeEvent, settings: ImgCompressSettings): Promise<ApiCompleteResponse> => {
        let res: ApiCompleteResponse;
        tinify.key = settings.api_key;
        if (!settings.overwrite_file) {
            await TinifyNewLocation(settings)
            .then (result => res = result)
            .catch (err => console.log(err))
        }
        return res;
	});
}

export const TinifyAPIKeyCheck = async () => {
    ipcMain.handle("tinifyApiKeyCheck", async (event: Electron.IpcMainInvokeEvent, apiKey: string) => {
        try {
            tinify.key = apiKey;
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