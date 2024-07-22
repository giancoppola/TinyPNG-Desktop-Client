import { App, UserSettings, SupportedImage, supportedImages } from '../types';
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText,
DialogActions, Typography, TextField} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { SetStateAction, useEffect, useState, Dispatch } from 'react';

type APIKeyCheck = (apiKey: string) => boolean;
interface Props {
    apiKey: string;
    setApiKey: Function;
    checkApiKey: Function;
    apiState: string;
    validApiKey: boolean;
}

export const ApiKeyAlert = (props: Props) => {
    const [newApiKey, setNewApiKey]: [string, Dispatch<string>] = useState<string>("");
    useEffect(() => {
        props.checkApiKey(props.apiKey);
    }, [])
    return (
        <Dialog open={!props.validApiKey}>
            <DialogTitle>Please Provide Your TinyPNG API Key</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Please input your TinyPNG API Key below, this will only be stored locally
                    and will be used to authenticate requests to the TinyPNG API.
                </DialogContentText>
                <TextField placeholder={props.apiKey} fullWidth={true} label="API Key" variant="standard" value={newApiKey} onChange={(e) => {setNewApiKey(e.target.value)}}/>
            </DialogContent>
            <DialogActions>
                <Typography variant='subtitle1'>
                        {props.apiState}
                </Typography>
                <Button onClick={() => props.checkApiKey(newApiKey)}>Save</Button>
            </DialogActions>
        </Dialog>
    )
}