import { App, UserSettings } from '../../types';
import { Button, List, ListItem, TextField, Typography, FormGroup, FormControlLabel, Checkbox, Divider } from '@mui/material';
import { SetStateAction, useEffect, useState, Dispatch } from 'react';

export const Settings = () => {
    const [settings, setSettings]: [UserSettings, Dispatch<UserSettings>] = useState();
    const [saveResult, setSaveResult]: [string, Dispatch<string>] = useState("");
    const [tinyAPIKey, setTinyAPIKey]: [string, Dispatch<string>] = useState("");
    const [tinifyOutLoc, setTinifyOutLoc]: [string, Dispatch<string>] = useState("");
    const getUserSettings = () => {
        window.APP.API.getUserSettings()
        .then(res => {
            let settings: UserSettings = JSON.parse(res);
            setSettings(settings);
            setTinyAPIKey(settings.api_key);
            setTinifyOutLoc(settings.output_location);
        })
    }
    const setUserSettings = () => {
        let newSettings: UserSettings = {
            api_key: tinyAPIKey,
            output_location: tinifyOutLoc,
            overwrite_file: true,
        };
        setSettings(newSettings);
        window.APP.API.setUserSettings(newSettings)
        .then(result => {
            console.log(result);
            setSaveResult(result);
        });
        setTimeout(() => {
            setSaveResult("");
        }, 10000)
    }
    const ChooseOutputFile = async () => {
        let dir = await window.APP.API.getFolder()
        .then(data => data);
        if (dir) {
            console.log(dir);
            setTinifyOutLoc(dir);
        }
        else {
            console.log("User cancelled");
        }
    }
    useEffect(() => {
        if (!settings) {
            getUserSettings();
        }
    }, [])
    return (
        <>
            <Typography className='page-view__title' variant="h3" component="h2">Settings</Typography>
            <Typography variant='h5' component='h4'>Tiny PNG</Typography>
            <Divider/>
            <ul className='settings-list'>
                <li className="settings-list__item">
                    <TextField className='settings-list__input settings-list__text-field' label="Tiny PNG API Key" name='tinyAPIKey' value={tinyAPIKey} onChange={e => setTinyAPIKey(e.target.value)} />
                </li>
                <li className="settings-list__item">
                    <TextField className='settings-list__input' label="Tiny PNG Output Location" name='tinyAPIOutLoc' value={tinifyOutLoc} onChange={e => setTinifyOutLoc(e.target.value)} />
                    <Button className='settings-list__btn' variant="outlined" onClick={ChooseOutputFile}>Select</Button>
                </li>
            </ul>
            <Button className='settings-list__save' variant="contained" onClick={setUserSettings}>Save</Button>
            <p className='status-msg'>{saveResult}</p>
        </>
    )
}