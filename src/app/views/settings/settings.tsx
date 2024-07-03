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
            setTinyAPIKey(JSON.parse(settings).tiny_png_api_key);
        })
    }
    const setUserSettings = () => {
        let newSettings: UserSettings = {
            tiny_png_api_key: tinyAPIKey,
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
                    <p>Tiny PNG API Key</p>
                    <input name='tinyAPI' value={tinyAPIKey} onChange={e => setTinyAPIKey(e.target.value)} />
                </li>
            </ul>
            <button onClick={setUserSettings}>Save</button>
            <p>{saveResult}</p>
        </>
    )
}