import { App, UserSettings } from '../../types';
import { SetStateAction, useEffect, useState, Dispatch } from 'react';

export const Settings = () => {
    const [settings, setSettings]: [UserSettings, Dispatch<UserSettings>] = useState();
    const [saveResult, setSaveResult]: [string, Dispatch<string>] = useState("");
    const [tinyAPIKey, setTinyAPIKey]: [string, Dispatch<string>] = useState("");
    const getUserSettings = () => {
        window.APP.API.getUserSettings()
        .then(settings => {
            console.log("user settings", JSON.parse(settings));
            setSettings(JSON.parse(settings));
        })
    }
    const updateSettings = () => {
        const tinyAPIKey = (document.querySelector("#tinyAPI") as HTMLInputElement).value;
        let newSettings: UserSettings = {
            tiny_png_api_key: tinyAPIKey,
        };
        setSettings(newSettings);
    }
    const setUserSettings = () => {
        updateSettings();
        window.APP.API.setUserSettings(settings)
        .then(result => {
            setSaveResult(result);
        });
        setTimeout(() => {
            setSaveResult("");
        }, 10000)
    }
    useEffect(() => {
        if (!settings) {
            getUserSettings();
        }
        if (settings){
            setTinyAPIKey(settings.tiny_png_api_key);
        }
    }, [])
    return (
        <>
            <h2>Settings</h2>
            <input name='tinyAPI' value={tinyAPIKey} onChange={e => setTinyAPIKey(e.target.value)} />
            <button onClick={setUserSettings}>Save</button>
            <p>{saveResult}</p>
        </>
    )
}