import { App, UserSettings, ImgCompressSettings, ImgFile } from '../types';
import { SetStateAction, useEffect, useState, Dispatch, DragEvent } from 'react';
import { Link, List, ListItem, Typography, IconButton, ListItemAvatar, ListItemText, Avatar } from '@mui/material';
import { Delete } from '@mui/icons-material';

interface Props {
    file_list: ImgFile[];
    remove_file: Function;
}

export const ImgFileList = (props: Props) => {
    return (
        <List>
            {
                props.file_list.map((file: ImgFile) => (
                    <ListItem
                        secondaryAction={
                            <IconButton edge="end" aria-label="delete"
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
                ))
            }
        </List>
    )
}