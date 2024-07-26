import { Button, TextField, Typography, Divider, Accordion, AccordionDetails, AccordionSummary, AccordionActions,
FormGroup, FormControlLabel, Switch, InputAdornment, IconButton } from '@mui/material';
import { ExpandMore, Visibility, VisibilityOff } from '@mui/icons-material';
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
    overwriteFile: boolean;
    setOverwriteFile: Function;
}

export const Settings = (props: SettingsProps) => {
    const [apiKeyError, setApiKeyError]: [boolean, Dispatch<boolean>] = useState<boolean>(false);
    const [apiKeyErrorMsg, setApiKeyErrorMsg]: [string, Dispatch<string>] = useState<string>("");
    const [newApiKey, setNewApiKey]: [string, Dispatch<string>] = useState("");
    const [newOverwriteFile, setNewOverwriteFile]: [boolean, Dispatch<boolean>] = useState<boolean>(true);
    const [outputLocError, setOutputLocError]: [boolean, Dispatch<boolean>] = useState<boolean>(false);
    const [outputLocErrorMsg, setOutputLocErrorMsg]: [string, Dispatch<string>] = useState<string>("");
    const [newOutputLoc, setNewOutputLoc]: [string, Dispatch<string>] = useState("");
    const [showApiKey, setShowApiKey]: [boolean, Dispatch<boolean>] = useState<boolean>(false);
    const SwitchOverwriteFile = () => {
        setNewOverwriteFile(!newOverwriteFile);
    }
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
    const OutLocValid = (): boolean => {
        if (!newOverwriteFile) {
            if (!newOutputLoc) {
                setOutputLocError(true);
                setOutputLocErrorMsg("Please provide an output location");
                return false;
            }
            else {
                setOutputLocError(false);
                setOutputLocErrorMsg("");
                return true
            }
        }
        setOutputLocError(false);
        setOutputLocErrorMsg("");
        return true;
    }
    const SaveSettings = async () => {
        let response: ApiKeyCheckResponse;
        await ApiKeyCheck(newApiKey)
        .then(res => response = res)
        .catch(err => console.error(err));
        setApiKeyError(!response.valid);
        if (response.valid) {
            setApiKeyErrorMsg("");
        }
        else {
            response.msg ? setApiKeyErrorMsg(response.msg) : null;
            return;
        }
        if(!OutLocValid()) { return };
        props.setApiKey(newApiKey);
        props.setOutputLoc(newOutputLoc);
        props.setOverwriteFile(newOverwriteFile);
    }
    useEffect(() => {
        setNewApiKey(props.apiKey);
        setNewOutputLoc(props.outputLoc);
        setNewOverwriteFile(props.overwriteFile);
    }, [])
    // Check if the core state for those values has changed from another source
    useEffect(() => {
        setNewApiKey(props.apiKey);
        setNewOutputLoc(props.outputLoc);
        setNewOverwriteFile(props.overwriteFile);
    }, [props.apiKey, props.outputLoc, props.overwriteFile]);
    return (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}
            aria-controls="panel1-content"
            id="panel1-header">Settings</AccordionSummary>
            <AccordionDetails>
                <ul className='settings-list'>
                    <li className="settings-list__item">
                        <TextField error={apiKeyError} helperText={apiKeyErrorMsg}
                        className='settings-list__input settings-list__text-field'
                        fullWidth={true} label="API Key" name='tinyAPIKey'
                        value={newApiKey} onChange={e => setNewApiKey(e.target.value)}
                        type={showApiKey ? 'text' : 'password'}
                        InputProps={{
                            endAdornment:
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => {setShowApiKey(!showApiKey)}}
                                        onMouseDown={() => {setShowApiKey(!showApiKey)}}
                                        edge="end"
                                        >
                                        {showApiKey ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                        }}
                        />
                    </li>
                    <li className="settings-list__item">
                        <FormGroup>
                            <FormControlLabel labelPlacement='start' control={
                                <Switch checked={newOverwriteFile} onChange={SwitchOverwriteFile} />
                            } label="Overwrite existing file when compressing" />
                        </FormGroup>
                    </li>
                    <li className="settings-list__item">
                        <TextField error={outputLocError} helperText={outputLocErrorMsg} disabled={newOverwriteFile} className='settings-list__input' fullWidth={true} label="Output Location" name='tinyAPIOutLoc' value={newOutputLoc} onChange={e => setNewOutputLoc(e.target.value)} />
                        <Button disabled={newOverwriteFile} className='settings-list__btn' variant="outlined" onClick={ChooseOutputFile}>Select</Button>
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