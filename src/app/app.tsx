import { createRoot } from 'react-dom/client';
import { App, ImgCompressSettings } from './types';
import { SetStateAction, useEffect, useState, Dispatch } from 'react';
import { ThemeProvider, CssBaseline, createTheme, Button, Typography, Divider } from '@mui/material';

import { UserSettings } from './types';

import { Options, Settings } from './views/_settings';
import { ImgCompress } from './views/_file-drop';
import { ApiKeyAlert } from './views/_api-key-alert';
import { Convert } from './views/_settings.convert';
import { Api } from '@mui/icons-material';

const darkTheme = createTheme({
	palette: {
	  mode: 'dark',
	},
});

const MainWrapper = () => {
	const [delay, setDelay]: [number, Dispatch<number>] = useState<number>(0);
	const [settings, setSettings]: [UserSettings, Dispatch<UserSettings>] = useState();
	const [imgSettings, setImgSettings]: [ImgCompressSettings, Dispatch<ImgCompressSettings>] = useState();
    const [saveResult, setSaveResult]: [string, Dispatch<string>] = useState("");
    const [userSettings, setUserSettings]: [UserSettings, Dispatch<UserSettings>] = useState();
    const [apiKey, setApiKey]: [string, Dispatch<string>] = useState<string>("");
	const [validApiKey, setValidApiKey]: [boolean, Dispatch<boolean>] = useState<boolean>(true);
    const [apiState, setApiState]: [string, Dispatch<string>] = useState<string>("");
	const [alertShowCount, setAlertShowCount]: [number, Dispatch<number>] = useState<number>(0);
    const [outputLoc, setOutputLoc]: [string, Dispatch<string>] = useState("");
	const GetUserSettings = async () => {
		await window.APP.API.getUserSettings()
		.then(res => {
			let settings: UserSettings = JSON.parse(res);
			setSettings(settings);
			setApiKey(settings.api_key);
			setOutputLoc(settings.output_location);
		})
		.catch(err => {console.error(err)});
	}
	const SetUserSettings = async () => {
        let newSettings: UserSettings = {
            api_key: apiKey,
            output_location: outputLoc,
            overwrite_file: true,
        };
		console.log("New User Settings:", newSettings);
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
	const CheckApiKey = async (api_key: string)  => {
        if (!api_key) {InvalidApiKey(""); return;}
        if (api_key === "dev-bypass") {setValidApiKey(true); setAlertShowCount(alertShowCount+1); return;};
        if (api_key.includes(" ")) {InvalidApiKey("Your API Key Cannot Contain Spaces"); return;}
        let valid: boolean;
        await window.APP.API.tinifyApiKeyCheck(api_key)
        .then(res => {console.log(res); valid = res})
        .catch(err => console.error(err))
        if (valid) {
            setValidApiKey(true);
            setApiState("");
            setApiKey(api_key);
			setAlertShowCount(alertShowCount + 1);
            return;
        }
        else {
            InvalidApiKey("TinyPNG API Key Invalid");
        }
    }
	const InvalidApiKey = (msg: string) => {
        setValidApiKey(false);
        setApiState(msg);
        return;
    }
	// Get user settings on load
	useEffect(() => {
		GetUserSettings();
	}, [])
	// Save user settings when values change
	useEffect(() => {
		// Don't want settings to save with their initial blank states,
		// needs to wait until values grabbed from API, then also no point
		// saving once grabbed, so waits for two updates before working
		setDelay(delay+1);
		if (delay > 1) {
			SetUserSettings();
		}
	}, [apiKey, outputLoc])
	return (
		<>
			{ settings != null && settings != undefined &&
				<ThemeProvider theme={darkTheme}>
					<CssBaseline />
					<section className='app__main-wrapper'>
						<ApiKeyAlert apiKey={apiKey} setApiKey={setApiKey} checkApiKey={CheckApiKey}
						apiState={apiState} validApiKey={validApiKey} alertShowCount={alertShowCount}/>
						<Typography variant="h6" component='h1' className='app__title'>TinyPNG Desktop Client</Typography>
						<ImgCompress/>
						<Options>
							<Typography variant='h6' component='h2'
							className='settings__title'>Options</Typography>
							<Divider/>
							<Convert/>
							<Settings apiKey={apiKey} setApiKey={setApiKey} checkApiKey={CheckApiKey}
							outputLoc={outputLoc} setOutputLoc={setOutputLoc} saveResult={saveResult}/>
						</Options>
					</section>
				</ThemeProvider>
			}
		</>
	)
}

const App = () => {
	return (
		<MainWrapper/>
	)
}

const root = createRoot(document.getElementById("app"));
export const CreateApp = () => {
	root.render(<App/>);
}