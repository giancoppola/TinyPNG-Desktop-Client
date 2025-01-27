import { App, UserSettings, ImgCompressSettings, ImgFile } from '../types';
import { SetStateAction, useEffect, useState, Dispatch, DragEvent } from 'react';
import { Link, List, ListItem, Typography, IconButton, ListItemAvatar, ListItemText, Avatar, ListItemIcon, LinearProgress, Box } from '@mui/material';
import { CheckCircle, Delete, Error } from '@mui/icons-material';

interface Props {
    file_list: ImgFile[];
    remove_file: Function;
}

export const ImgFileList = (props: Props) => {
    return (
        <List>
            {
                props.file_list.map((file: ImgFile) => (
                    <>
                        <ListItem disabled={file.status === 'working' ? true : false}
                            secondaryAction={
                                <IconButton disabled={file.status === 'working' ? true : false} edge="end" aria-label="delete"
                                onClick={() => props.remove_file(file)}>
                                    <Delete/>
                                </IconButton>
                            }
                        >
                            <ListItemAvatar>
                                <Avatar variant='rounded' src={'file:///'+file.path}/>
                            </ListItemAvatar>
                            <ListItemText
                                primary={file.name}
                                secondary={
                                    <>
                                        <Typography>
                                            {file.type}
                                        </Typography>
                                        <Typography>
                                            {file.size_in_mb + 'MB'}
                                        </Typography>
                                    </>
                                }
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                            primary=''
                            secondary={
                                <>
                                    { file.status === 'error' &&
                                        <Typography className='img-file-status'>
                                            <Error color='error'/>
                                            {file.status_msg}
                                        </Typography>
                                    }
                                    { file.status === 'complete' &&
                                        <Typography className='img-file-status'>
                                            <CheckCircle color='success'/>
                                            {file.status_msg}
                                        </Typography>
                                    }
                                    { file.status === 'working' &&
                                        <Box sx={{ width: '100%' }}>
                                            <LinearProgress/>
                                        </Box>
                                    }
                                </>
                            }
                            />
                        </ListItem>
                    </>
                ))
            }
        </List>
    )
}