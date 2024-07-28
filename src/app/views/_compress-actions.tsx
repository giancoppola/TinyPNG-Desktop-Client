import { App, UserSettings, ImgCompressSettings, ImgFile } from '../types';
import { SetStateAction, useEffect, useState, Dispatch, DragEvent, MouseEvent, ChangeEvent } from 'react';
import { Box, Link, Typography, Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import { CompressReadyState } from './_img-compress';

interface Props {
    files: number,
    start: Function,
    clear: Function,
    readyState: CompressReadyState,
}
export const CompressActions = (props: Props) => {
    return (
        <Box display='flex' justifyContent='flex-end' gap='1rem' alignItems='center' margin='1rem 0'>
            { props.files > 0 && props.readyState === 'ready' &&
                <Typography>
                    {`${props.files} file${props.files > 1 ? 's' : ''} ready to compress`}
                </Typography>
            }
            <Button onClick={() => {props.clear()}} disabled={props.files < 1 || props.readyState === 'working' ? true : false}>
                Clear
            </Button>
            { props.readyState === 'ready' &&
                <Button onClick={() => {props.start()}} disabled={props.files < 1 ? true : false}>
                    Start
                </Button>
            }
        </Box>
    )
}