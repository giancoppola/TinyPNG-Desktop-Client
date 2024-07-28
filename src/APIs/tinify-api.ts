import { app, BrowserWindow, ipcMain, screen, dialog, Dialog, OpenDialogReturnValue } from 'electron';
import tinify = require("tinify");
import path = require("path");
import fs = require("fs");
import { ImgCompressSettings, ApiCompleteResponse, ImgFile } from '../app/types';

const GenerateNewFilePath = (output_location:string, path: string): string => {
    // The new output location may not yet exist, so check for it and create new dir if needed
    if (!fs.existsSync(output_location)) {
        fs.mkdirSync(output_location);
    }
    const fileArr = path.split("/");
    const file = fileArr[fileArr.length - 1];
    return `${output_location}/${file}`
}

const TinifyFile = async (settings: ImgCompressSettings): Promise<ApiCompleteResponse> => {
    try{
        let newLocation = settings.overwrite_file == false ? GenerateNewFilePath(settings.output_loc, settings.file.path) : settings.file.path;
        console.log(newLocation);
        await tinify.fromFile(settings.file.path).toFile(newLocation);
        let newFileSize: string;
        let newFile = await fs.openAsBlob(newLocation);
        newFileSize = (newFile.size / 1000000).toFixed(2);
        let savedSpace = (parseFloat(settings.file.size_in_mb) - parseFloat(newFileSize)).toFixed(2);
        return {
            success: true,
            msg: `Success! New file is ${newFileSize}MB, saving ${savedSpace}MB`
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
        await TinifyFile(settings)
        .then (result => res = result)
        .catch (err => console.log(err))
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

export const TinifyCompressionsCheck = async () => {
    ipcMain.handle("tinifyCompressionsCheck", async (event: Electron.IpcMainInvokeEvent, apiKey: string) => {
        tinify.key = apiKey;
        return tinify.compressionCount;
    })
}

export const TinifyAPI = () => {
    TinifyAPIFiles();
    TinifyAPIKeyCheck();
    TinifyCompressionsCheck();
}