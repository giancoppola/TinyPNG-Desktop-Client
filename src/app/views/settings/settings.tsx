import { App, UserSettings } from '../../types';
import { SetStateAction, useEffect, useState, Dispatch } from 'react';

export const Settings = () => {
    const [settings, setSettings]: [UserSettings, Dispatch<UserSettings>] = useState();
    const getUserSettings = () => {
        window.APP.API.getUserSettings()
        .then(settings => {
            console.log("user settings", JSON.parse(settings));
            setSettings(JSON.parse(settings));
        })
    }
    const setUserSettings = () => {
        
    }
    useEffect(() => {
        if (!settings) {
            getUserSettings();
        }
    }, [])
    return (
        <>
            <h2>Settings</h2>
        </>
    )
}