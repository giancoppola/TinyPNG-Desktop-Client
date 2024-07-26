import { App, UserSettings, ImgCompressSettings, ImgFile } from '../types';
import { SetStateAction, useEffect, useState, Dispatch, DragEvent, MouseEvent, ChangeEvent } from 'react';
import { Box, Link, Typography, Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface Props {
    fileList: ImgFile[];
}
export const StartCompress = (props: Props) => {
    return (
        <Box display='flex' justifyContent='flex-end' gap='1rem' alignItems='center' margin='1rem 0'>
            { props.fileList.length > 0 &&
                <Typography>
                    {`${props.fileList.length} file${props.fileList.length > 1 ? 's' : ''} ready to compress`}
                </Typography>
            }
            <Button disabled={props.fileList.length > 0 ? false : true}>
                Start
            </Button>
        </Box>
    )
}