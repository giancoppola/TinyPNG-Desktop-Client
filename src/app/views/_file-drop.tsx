import { App, UserSettings, ImgCompressSettings, ImgFile } from '../types';
import { SetStateAction, useEffect, useState, Dispatch, DragEvent } from 'react';
import { Link, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import { ImgFileList } from './_file-list';

export const ImgCompress = () => {
    const DRAG_READY = 'Drag your images here';
    const DROP_READY = 'Drop your images to get started!'
    const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
    const [status, setStatus]: [string, Dispatch<string>] = useState("");
    const [apiKey, setApiKey]: [string, Dispatch<string>] = useState("");
    const [outDir, setOutDir]: [string, Dispatch<string>] = useState("");
    const [dropMsg, setDropMsg]: [string, Dispatch<string>] = useState(DRAG_READY);
    const [dragoverClass, setDragoverClass]: [string, Dispatch<string>] = useState("");
    const [fileList, setFileList]: [Array<ImgFile>, Dispatch<Array<ImgFile>>] = useState<Array<ImgFile>>([]);
    const HandleDrop = async (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragoverClass('');
        setDropMsg(DRAG_READY);
        let newCompressSettings: ImgCompressSettings;
        try {
            newCompressSettings = BuildSettings(e.dataTransfer.files);
            BuildFileList(e.dataTransfer.files);
            TinifyFiles(newCompressSettings);
            UpdateStatus("");
        }
        catch (e) {
            let error = e as Error;
            UpdateStatus(error.message);
            setFileList([]);
            return
        }
        console.log(newCompressSettings);
        console.log(e.dataTransfer.files);
    };
    const HandleDragover = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragoverClass('dragover');
        setDropMsg(DROP_READY);
    };
    const HandleDragLeave = (e: DragEvent<HTMLElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragoverClass('');
        setDropMsg(DRAG_READY);
    }
    const SelectFiles = async () => {
        let files: string[];
        window.APP.API.getFiles()
        .then(data => {
            console.log(data);
            files = data;
        })
        .catch(err => console.error(err));
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
        if (fileList.length < 1) throw new Error("Invalid file types! TinyPNG only accepts WEBP, JPG, and PNG.");
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
    const BuildFileList = (files: FileList) => {
        let newFileList: ImgFile[] = [];
        let index = 1;
        for (const file of files) {
            let imgFile: ImgFile = {
                path: file.path,
                index: index,
                name: file.name.split(".")[0],
                type: file.name.split(".")[1].toUpperCase(),
                size_in_mb: (file.size / 1000000).toFixed(2),
            }
            index++;
            newFileList.push(imgFile);
            console.log(imgFile);
        }
        setFileList(newFileList);
    }
    const RemoveFileFromList = (file: ImgFile) => {
        let newFileList: ImgFile[] = [...fileList];
        newFileList.splice(newFileList.indexOf(file), 1);
        setFileList(newFileList);
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
                <Typography component='p' variant='subtitle1'>{dropMsg}</Typography>
                <Typography component='p' variant='subtitle1'>or &nbsp;
                    <Link className='select-files' onClick={SelectFiles}>select your files</Link>
                </Typography>
            </div>
            { fileList.length > 0 && <ImgFileList file_list={fileList} remove_file={RemoveFileFromList}/> }
            <Typography className='status-msg'>{status}</Typography>
        </>
    )
}