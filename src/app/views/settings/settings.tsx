import { App, UserSettings } from '../../types';
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
            setTinyAPIKey(settings.tiny_png_api_key);
            setTinifyOutLoc(settings.tinify_output_location);
        })
    }
    const setUserSettings = () => {
        let newSettings: UserSettings = {
            tiny_png_api_key: tinyAPIKey,
            tinify_output_location: tinifyOutLoc,
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
            <h2>Settings</h2>
            <ul className="settings-list">
                <li className="settings-list__item">
                    <p className='settings-list__category'>Tiny PNG API Key</p>
                    <input className='settings-list__input' name='tinyAPIKey' value={tinyAPIKey} onChange={e => setTinyAPIKey(e.target.value)} />
                </li>
                <li className="settings-list__item">
                    <p className='settings-list__category'>Tiny PNG Output Location</p>
                    <input className='settings-list__input' name='tinyAPIOutLoc' value={tinifyOutLoc} onChange={e => setTinifyOutLoc(e.target.value)} />
                    <button onClick={ChooseOutputFile}>Set</button>
                </li>
            </ul>
            <button onClick={setUserSettings}>Save</button>
            <p className='status-msg'>{saveResult}</p>
        </>
    )
}