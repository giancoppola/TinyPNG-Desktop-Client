import { Button, TextField, Typography, Divider, Accordion, AccordionDetails, AccordionSummary, AccordionActions } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { SetStateAction, useEffect, useState, Dispatch, ReactNode } from 'react';

import { ApiKeyCheckResponse, App, UserSettings } from '../types';
import { ApiKeyCheck } from '../app_tools';

type APIKeyCheck = (apiKey: string) => boolean;
interface SettingsProps {
    apiKey: string;
    setApiKey: Function;
    outputLoc: string;
    setOutputLoc: Function;
    saveResult: string;
}

export const Settings = (props: SettingsProps) => {
    const [apiKeyError, setApiKeyError]: [boolean, Dispatch<boolean>] = useState<boolean>(false);
    const [apiKeyErrorMsg, setApiKeyErrorMsg]: [string, Dispatch<string>] = useState<string>("");
    const [newApiKey, setNewApiKey]: [string, Dispatch<string>] = useState("");
    const [newOutputLoc, setNewOutputLoc]: [string, Dispatch<string>] = useState("");
    const ChooseOutputFile = async () => {
        let dir = await window.APP.API.getFolder()
        .then(data => data);
        if (dir) {
            console.log(dir);
            setNewOutputLoc(dir);
        }
        else {
            console.log("User cancelled");
        }
    }
    const SaveSettings = async () => {
        let response: ApiKeyCheckResponse;
        await ApiKeyCheck(newApiKey)
        .then(res => response = res)
        .catch(err => console.error(err));
        setApiKeyError(!response.valid);
        if (response.valid) {
            props.setApiKey(newApiKey);
            props.setOutputLoc(newOutputLoc);
            setApiKeyErrorMsg("");
        }
        else {
            response.msg ? setApiKeyErrorMsg(response.msg) : null;
        }
    }
    useEffect(() => {
        setNewApiKey(props.apiKey);
        setNewOutputLoc(props.outputLoc);
    }, [])
    // Check if the core state for those values has changed from another source
    useEffect(() => {
        setNewApiKey(props.apiKey);
        setNewOutputLoc(props.outputLoc);
    }, [props.apiKey, props.outputLoc]);
    return (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}
            aria-controls="panel1-content"
            id="panel1-header">Settings</AccordionSummary>
            <AccordionDetails>
                <ul className='settings-list'>
                    <li className="settings-list__item">
                        <TextField error={apiKeyError} helperText={apiKeyErrorMsg} className='settings-list__input settings-list__text-field' fullWidth={true} label="API Key" name='tinyAPIKey' value={newApiKey} onChange={e => setNewApiKey(e.target.value)} />
                    </li>
                    <li className="settings-list__item">
                        <TextField className='settings-list__input' fullWidth={true} label="Output Location" name='tinyAPIOutLoc' value={newOutputLoc} onChange={e => setNewOutputLoc(e.target.value)} />
                        <Button className='settings-list__btn' variant="outlined" onClick={ChooseOutputFile}>Select</Button>
                    </li>
                </ul>
                <AccordionActions>
                    <Typography variant='subtitle1' component='p' className='status-msg'>{props.saveResult}</Typography>
                    <Button className='settings-list__save' onClick={() => SaveSettings()}>Save</Button>
                </AccordionActions>
            </AccordionDetails>
        </Accordion>
    )
}

export const Options = (props:{children: ReactNode}) => {
    return (
        <section className="settings">
            {props.children}
        </section>
    )
}