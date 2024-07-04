import { App, UserSettings } from '../../types';
import { SetStateAction, useEffect, useState, Dispatch, DragEvent } from 'react';

export const ImgCompress = () => {
    const [status, setStatus]: [string, Dispatch<string>] = useState("");
    const [apiKey, setApiKey]: [string, Dispatch<string>] = useState("");
    const HandleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (!apiKey) {
            UpdateStatus("API key not set!");
            return
        }
        let onlyImages = CheckOnlyImages(e.dataTransfer.files);
        console.log(onlyImages);
        if (!onlyImages) {
            UpdateStatus("Invalid file types! Tiny PNG only accepts WEBP, JPG, and PNG.");
            return
        }
        console.log(e.dataTransfer.files)
    };
    const HandleDragover = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };
    const CheckOnlyImages = (files: FileList): boolean => {
        const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
        for (const f of files) {
            if (!IMAGE_TYPES.includes(f.type)) {
                return false;
            }
        }
        return true;
    }
    const UpdateStatus = (msg: string) => {
        setStatus(msg)
        setTimeout(() => {
            setStatus("");
        }, 10000)
    }
    const GetAPIKey = async () => {
        await window.APP.API.getUserSettings()
        .then(data => {
            let settings: UserSettings = JSON.parse(data);
            setApiKey(settings.tiny_png_api_key);
        })
    }
    useEffect(() => {
        if (!apiKey) {
            GetAPIKey();
        }
    }, [])
    return (
        <>
            <h2>Tiny PNG Image Compress</h2>
            <div
            onDrop={e => {HandleDrop(e)}} onDragOver={e => {HandleDragover(e)}}
            className='img-drag-drop'>Drag your image here
            </div>
            <p className='status-msg'>{status}</p>
        </>
    )
}