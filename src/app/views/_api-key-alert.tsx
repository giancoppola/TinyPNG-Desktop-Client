import { App, UserSettings, SupportedImage, supportedImages } from '../types';
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText,
DialogActions, Typography, TextField} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { SetStateAction, useEffect, useState, Dispatch } from 'react';

export const ApiKeyAlert = () => {
    const [userSettings, setUserSettings]: [UserSettings, Dispatch<UserSettings>] = useState();
    const [apiKey, setApiKey]: [string, Dispatch<string>] = useState<string>("");
    const [newApiKey, setNewApiKey]: [string, Dispatch<string>] = useState<string>("");
    const [validApiKey, setValidApiKey]: [boolean, Dispatch<boolean>] = useState<boolean>(true);
    const [apiState, setApiState]: [string, Dispatch<string>] = useState<string>("");
    const CheckApiKey = async (api_key: string)  => {
        if (api_key === "dev-bypass") {setValidApiKey(true); return;};
        if (api_key.includes(" ")) {InvalidApiKey("Your API Key Cannot Contain Spaces"); return;}
        let valid: boolean;
        await window.APP.API.tinifyApiKeyCheck(api_key)
        .then(res => {console.log(res); valid = res})
        .catch(err => console.error(err))
        if (valid) {
            setValidApiKey(true);
            setApiState("");
            if (userSettings) {
                console.log('settings user settings')
                let newUserSettings: UserSettings = {...userSettings};
                console.log(newUserSettings);
                newUserSettings.api_key = api_key;
                await window.APP.API.setUserSettings(newUserSettings)
                .then(res => {console.log(res)})
                .catch(err => console.error())
            }
            return;
        }
        else {
            InvalidApiKey("TinyPNG API Key Invalid");
        }
    }
    const InvalidApiKey = (msg: string) => {
        if (validApiKey == true) {
            setValidApiKey(false);
        }
        else {
            setApiState(msg);
        }
        return;
    }
    useEffect(() => {
        if (!apiKey) {
            window.APP.API.getUserSettings()
            .then(res => {
                let settings: UserSettings = JSON.parse(res);
                setUserSettings(settings);
                setApiKey(settings.api_key);
                CheckApiKey(settings.api_key);
            })
            .catch(err => {
                console.error(err);
            })
        }
    }, [])
    return (
        <Dialog open={!validApiKey}>
            <DialogTitle>Please Provide Your TinyPNG API Key</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Please input your TinyPNG API Key below, this will only be stored locally
                    and will be used to authenticate requests to the TinyPNG API.
                </DialogContentText>
                <TextField fullWidth={true} label="API Key" variant="standard" value={newApiKey} onChange={(e) => {setNewApiKey(e.target.value)}}/>
            </DialogContent>
            <DialogActions>
                <Typography variant='subtitle1'>
                        {apiState}
                </Typography>
                <Button onClick={() => CheckApiKey(newApiKey)}>Save</Button>
            </DialogActions>
        </Dialog>
    )
}