import { App, UserSettings, ImgCompressSettings, ImgFile, ImgFileStatus, ApiCompleteResponse } from '../types';
import { useEffect, useState, Dispatch } from 'react';

import { ImgFileList } from './_file-list';
import { CompressActions } from './_compress-actions';
import { FileSelect } from './_file-select';

interface Props {
    userSettings: UserSettings;
}
export type CompressReadyState = 'ready' | 'working' | 'complete';
export const ImgCompress = (props: Props) => {
    const [fileList, setFileList]: [Array<ImgFile>, Dispatch<Array<ImgFile>>] = useState<Array<ImgFile>>([]);
    const [readyState, setReadyState]: [CompressReadyState, Dispatch<CompressReadyState>] = useState<CompressReadyState>('ready');
    const Clear = () => {
        setFileList([]);
        setReadyState('ready')
    }
    const Start = async () => {
        setReadyState('working');
        for (const file of fileList) {
            let imgSettings: ImgCompressSettings = {
                api_key: props.userSettings.api_key,
                output_loc: props.userSettings.output_location,
                overwrite_file: props.userSettings.overwrite_file,
                file: file,
                convert: false,
                resize: false,
                preserve_metadata: false,
            }
            UpdateFileStatus(file, 'working', '');
            await window.APP.API.tinifyFiles(imgSettings)
            .then(res => {
                let result = res as unknown as ApiCompleteResponse;
                console.log(result);
                result.success == true && UpdateFileStatus(file, 'complete', result.msg);
                result.success == false && UpdateFileStatus(file, 'error', result.msg);
            })
            .catch((err) => {
                console.log(err);
                UpdateFileStatus(file, 'error', err.message);
            })
        }
        setReadyState('complete');
    }
    const UpdateFileStatus = (file: ImgFile, status: ImgFileStatus, status_msg: string) => {
        let newFileList = [...fileList];
        newFileList[fileList.indexOf(file)].status = status;
        newFileList[fileList.indexOf(file)].status_msg = status_msg;
        setFileList(newFileList);
    }
    const RemoveFileFromList = (file: ImgFile) => {
        let newFileList: ImgFile[] = [...fileList];
        newFileList.splice(newFileList.indexOf(file), 1);
        setFileList(newFileList);
    }
    useEffect(() => { console.log(props.userSettings) }, [props.userSettings])
    return (
        <>
            <FileSelect fileList={fileList} setFileList={setFileList} userSettings={props.userSettings}/>
            { fileList.length > 0 && <ImgFileList file_list={fileList} remove_file={RemoveFileFromList}/> }
            <CompressActions files={fileList.length} start={Start} clear={Clear} readyState={readyState}/>
        </>
    )
}