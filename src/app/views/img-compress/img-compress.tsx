import { App, UserSettings, ImgCompressSettings } from '../../types';
import { SetStateAction, useEffect, useState, Dispatch, DragEvent } from 'react';
import { Typography } from '@mui/material';

export const ImgCompress = () => {
    const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
    const [status, setStatus]: [string, Dispatch<string>] = useState("");
    const [apiKey, setApiKey]: [string, Dispatch<string>] = useState("");
    const [outDir, setOutDir]: [string, Dispatch<string>] = useState("");
    const HandleDrop = async (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        let newCompressSettings: ImgCompressSettings;
        try {
            newCompressSettings = BuildSettings(e.dataTransfer.files);
            UpdateStatus("");
        }
        catch (e) {
            let error = e as Error;
            UpdateStatus(error.message);
            return
        }
        console.log(newCompressSettings);
        console.log(e.dataTransfer.files);
    };
    const HandleDragover = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };
    const BuildSettings = (files: FileList): ImgCompressSettings => {
        let newSettings: ImgCompressSettings;
        if (!apiKey) throw new Error("No API key set!");
        if (!outDir) throw new Error("No output location set!");
        let fileList: string[] = [];
        for (let f of files) {
            if (IMAGE_TYPES.includes(f.type)) {
                fileList.push(f.path);
            }
        }
        if (fileList.length < 1) throw new Error("Invalid file types! Tiny PNG only accepts WEBP, JPG, and PNG.");
        newSettings = {
            api_key: apiKey,
            output_loc: outDir,
            file_names: fileList,
            convert: false,
            resize: false,
            preserve_metadata: false,
        }
        return newSettings;
    }
    const UpdateStatus = (msg: string) => {
        setStatus(msg)
        setTimeout(() => {
            setStatus("");
        }, 10000)
    }
    const GetSettings = async () => {
        await window.APP.API.getUserSettings()
        .then(data => {
            let settings: UserSettings = JSON.parse(data);
            setApiKey(settings.tiny_png_api_key);
            setOutDir(settings.tinify_output_location);
        })
    }
    useEffect(() => {
        if (!apiKey || !outDir) {
            GetSettings();
        }
    }, [])
    return (
        <>
            <Typography variant="h2">Tiny PNG Image Compress</Typography>
            <div
            onDrop={e => {HandleDrop(e)}} onDragOver={e => {HandleDragover(e)}}
            className='img-drag-drop'>Drag your image here
            </div>
            <p className='status-msg'>{status}</p>
        </>
    )
}