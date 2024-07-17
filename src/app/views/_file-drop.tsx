import { App, UserSettings, ImgCompressSettings } from '../types';
import { SetStateAction, useEffect, useState, Dispatch, DragEvent } from 'react';
import { Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export const ImgCompress = () => {
    const DRAG_READY = 'Drag your image here';
    const DROP_READY = 'Drop your image to get started!'
    const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
    const [status, setStatus]: [string, Dispatch<string>] = useState("");
    const [apiKey, setApiKey]: [string, Dispatch<string>] = useState("");
    const [outDir, setOutDir]: [string, Dispatch<string>] = useState("");
    const [dragoverClass, setDragoverClass]: [string, Dispatch<string>] = useState("");
    const HandleDrop = async (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragoverClass('');
        let newCompressSettings: ImgCompressSettings;
        try {
            newCompressSettings = BuildSettings(e.dataTransfer.files);
            TinifyFiles(newCompressSettings);
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
        setDragoverClass('dragover');
    };
    const HandleDragLeave = (e: DragEvent<HTMLElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragoverClass('');
    }
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
    const TinifyFiles = async (settings: ImgCompressSettings) => {
        await window.APP.API.tinifyFiles(settings)
        .then(data => console.log(data))
        .catch(err => console.log(err));
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
            setApiKey(settings.api_key);
            setOutDir(settings.output_location);
        })
    }
    useEffect(() => {
        if (!apiKey || !outDir) {
            GetSettings();
        }
    }, [])
    return (
        <>
            <div
            onDrop={e => {HandleDrop(e)}} onDragOver={e => {HandleDragover(e)}}
            onDragLeave={e => {HandleDragLeave(e)}}
            className={`img-drag-drop ${dragoverClass}`}>
                <CloudUploadIcon fontSize='large'/>
                <Typography component='p' variant='subtitle1'>{DRAG_READY}</Typography>
            </div>
            <p className='status-msg'>{status}</p>
        </>
    )
}