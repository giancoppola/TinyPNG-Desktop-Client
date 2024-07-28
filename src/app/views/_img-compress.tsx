import { App, UserSettings, ImgCompressSettings, ImgFile, ImgFileStatus, ApiCompleteResponse } from '../types';
import { useEffect, useState, Dispatch } from 'react';

import { FileSelect } from './_file-select';

interface Props {
    userSettings: UserSettings;
}
export const ImgCompress = (props: Props) => {
    const [fileList, setFileList]: [Array<ImgFile>, Dispatch<Array<ImgFile>>] = useState<Array<ImgFile>>([]);
    const Start = async () => {
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
    }
    const UpdateFileStatus = (file: ImgFile, status: ImgFileStatus, status_msg: string) => {
        let newFileList = [...fileList];
        newFileList[fileList.indexOf(file)].status = status;
        newFileList[fileList.indexOf(file)].status_msg = status_msg;
        setFileList(newFileList);
    }
    useEffect(() => { console.log(props.userSettings) }, [props.userSettings])
    return (
        <>
            <FileSelect fileList={fileList} setFileList={setFileList} userSettings={props.userSettings} start={Start}/>
        </>
    )
}