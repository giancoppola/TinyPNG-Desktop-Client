import { App, UserSettings, ImgCompressSettings, ImgFile } from '../types';
import { SetStateAction, useEffect, useState, Dispatch, DragEvent, MouseEvent, ChangeEvent } from 'react';
import { Box, Link, Typography, Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface Props {
    files: number,
    start: Function
}
export const StartCompress = (props: Props) => {
    return (
        <Box display='flex' justifyContent='flex-end' gap='1rem' alignItems='center' margin='1rem 0'>
            { props.files > 0 &&
                <Typography>
                    {`${props.files} file${props.files > 1 ? 's' : ''} ready to compress`}
                </Typography>
            }
            <Button onClick={() => {props.start()}} disabled={props.files > 0 ? false : true}>
                Start
            </Button>
        </Box>
    )
}