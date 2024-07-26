import { App, UserSettings, ImgCompressSettings, ImgFile } from '../types';
import { SetStateAction, useEffect, useState, Dispatch, DragEvent, MouseEvent, ChangeEvent } from 'react';
import { Link, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import { ImgFileList } from './_file-list';
import { StartCompress } from './_start_compress';

interface FileSelectProps {
    fileList: ImgFile[];
    setFileList: Function;
    userSettings: UserSettings;
    start: Function;
}
const FileSelect = (props: FileSelectProps) => {
    const DRAG_READY = 'Drag your images here';
    const DROP_READY = 'Drop your images to get started!'
    const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
    const [status, setStatus]: [string, Dispatch<string>] = useState("");
    const [dropMsg, setDropMsg]: [string, Dispatch<string>] = useState(DRAG_READY);
    const [dragoverClass, setDragoverClass]: [string, Dispatch<string>] = useState("");
    const HandleDrop = async (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragoverClass('');
        setDropMsg(DRAG_READY);
        BuildFileList(e.dataTransfer.files);
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
    const BuildFileList = (files: FileList) => {
        let invalidFiles: string[] = [];
        let newFileList: ImgFile[] = [];
        let index = 1;
        for (const file of files) {
            if (!IMAGE_TYPES.includes(file.type)) {
                invalidFiles.push(file.path);
                continue;
            }
            let imgFile: ImgFile = {
                path: file.path,
                index: index,
                name: file.name.split(".")[0],
                type: file.name.split(".")[1].toUpperCase(),
                size_in_mb: (file.size / 1000000).toFixed(2),
            }
            index++;
            newFileList.push(imgFile);
        }
        let plural = invalidFiles.length > 1 ? true : false;
        invalidFiles.length > 0 && UpdateStatus(`TinyPNG only accepts WEBP, JPEG, and PNG images. ${invalidFiles.length} file${plural ? 's' : ''} removed.`)
        props.setFileList(newFileList);
        console.log(newFileList);
    }
    const RemoveFileFromList = (file: ImgFile) => {
        let newFileList: ImgFile[] = [...props.fileList];
        newFileList.splice(newFileList.indexOf(file), 1);
        props.setFileList(newFileList);
    }
    const UpdateStatus = (msg: string) => {
        setStatus(msg)
        setTimeout(() => {
            setStatus("");
        }, 3000)
    }
    return (
        <>
            <div
            onDrop={e => {HandleDrop(e)}} onDragOver={e => {HandleDragover(e)}}
            onDragLeave={e => {HandleDragLeave(e)}}
            className={`img-drag-drop ${dragoverClass}`}>
                <CloudUploadIcon fontSize='large'/>
                <Typography component='p' variant='subtitle1'>{dropMsg}</Typography>
                <input
                    hidden
                    aria-hidden
                    type="file"
                    id="fileSelect"
                    multiple
                    onChange={(e) => BuildFileList(e.target.files)}
                />
                <Typography component='p' variant='subtitle1'>or &nbsp;
                    <Link className='select-files' onClick={() => {document.getElementById('fileSelect').click()}}>select your files</Link>
                </Typography>
            </div>
            <Typography variant='caption' width='100%' margin='.5rem 0' textAlign='center' className='status-msg'>{status}</Typography>
            { props.fileList.length > 0 && <ImgFileList file_list={props.fileList} remove_file={RemoveFileFromList}/> }
            <StartCompress files={props.fileList.length} start={props.start}/>
        </>
    )
}

interface Props {
    userSettings: UserSettings;
}
export const ImgCompress = (props: Props) => {
    const [fileList, setFileList]: [Array<ImgFile>, Dispatch<Array<ImgFile>>] = useState<Array<ImgFile>>([]);
    const Start = async () => {
        let imgSettings: ImgCompressSettings = {
            api_key: props.userSettings.api_key,
            output_loc: props.userSettings.output_location,
            overwrite_file: props.userSettings.overwrite_file,
            files: fileList,
            convert: false,
            resize: false,
            preserve_metadata: false,
        }
        await window.APP.API.tinifyFiles(imgSettings)
        .then(res => console.log(res))
        .catch((err) => console.log(err))
    }
    useEffect(() => { console.log(props.userSettings) }, [props.userSettings])
    return (
        <>
            <FileSelect fileList={fileList} setFileList={setFileList} userSettings={props.userSettings} start={Start}/>
        </>
    )
}