import { App, UserSettings } from '../types';
import { Button, TextField, Typography, Divider, Accordion, AccordionDetails, AccordionSummary, AccordionActions } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { SetStateAction, useEffect, useState, Dispatch } from 'react';

import { Convert } from './_settings.convert';

const Settings = () => {
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
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}
            aria-controls="panel1-content"
            id="panel1-header">Settings</AccordionSummary>
            <AccordionDetails>
                <ul className='settings-list'>
                    <li className="settings-list__item">
                        <TextField className='settings-list__input settings-list__text-field' label="Tiny PNG API Key" name='tinyAPIKey' value={tinyAPIKey} onChange={e => setTinyAPIKey(e.target.value)} />
                    </li>
                    <li className="settings-list__item">
                        <TextField className='settings-list__input' label="Tiny PNG Output Location" name='tinyAPIOutLoc' value={tinifyOutLoc} onChange={e => setTinifyOutLoc(e.target.value)} />
                        <Button className='settings-list__btn' variant="outlined" onClick={ChooseOutputFile}>Select</Button>
                    </li>
                </ul>
                <AccordionActions>
                    <Typography variant='subtitle1' component='p' className='status-msg'>{saveResult}</Typography>
                    <Button className='settings-list__save' onClick={setUserSettings}>Save</Button>
                </AccordionActions>
            </AccordionDetails>
        </Accordion>
    )
}

export const Options = () => {
    return (
        <section className="settings">
            <Typography variant='h6' component='h2'
            className='settings__title'>Options</Typography>
            <Divider/>
            <Convert/>
            <Settings/>
        </section>
    )
}