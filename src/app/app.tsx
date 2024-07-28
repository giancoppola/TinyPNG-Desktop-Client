import { createRoot } from 'react-dom/client';
import { App, ImgCompressSettings, ApiKeyCheckResponse } from './types';
import { SetStateAction, useEffect, useState, Dispatch } from 'react';
import { ThemeProvider, CssBaseline, createTheme, Button, Typography, Divider } from '@mui/material';

import { UserSettings } from './types';

import { Options, Settings } from './views/_settings';
import { ImgCompress } from './views/_img-compress';
import { ApiKeyAlert } from './views/_api-key-alert';
import { Convert } from './views/_settings.convert';
import { ApiKeyCheck } from './app_tools';

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

	// API Key State
    const [apiKey, setApiKey]: [string, Dispatch<string>] = useState<string>("");

	// API Key Alert States
	const [validApiKey, setValidApiKey]: [boolean, Dispatch<boolean>] = useState<boolean>(true);
	const [apiState, setApiState]: [string, Dispatch<string>] = useState<string>("");
	const [alertShowCount, setAlertShowCount]: [number, Dispatch<number>] = useState<number>(0);

	// Compressions for your API key this month state
	const [compressCount, setCompressCount]: [number, Dispatch<number>] = useState<number>(0);

	// Output location state
	const [overwriteFile, setOverwriteFile]: [boolean, Dispatch<boolean>] = useState<boolean>(true);
    const [outputLoc, setOutputLoc]: [string, Dispatch<string>] = useState("");

	const GetUserSettings = async () => {
		await window.APP.API.getUserSettings()
		.then(res => {
			let settings: UserSettings = JSON.parse(res);
			setSettings(settings);
			setApiKey(settings.api_key);
			setOutputLoc(settings.output_location);
			setOverwriteFile(settings.overwrite_file);
		})
		.catch(err => {console.error(err)});
	}
	const SetUserSettings = async () => {
        let newSettings: UserSettings = {
            api_key: apiKey,
            output_location: outputLoc,
            overwrite_file: overwriteFile,
        };
		console.log("New User Settings:", newSettings);
        setSettings(newSettings);
		console.log(newSettings);
        window.APP.API.setUserSettings(newSettings)
        .then(result => {
            console.log(result);
            setSaveResult(result);
        });
		window.APP.API.tinifyCompressionsCheck(apiKey)
		.then(res => setCompressCount(res))
        setTimeout(() => {
            setSaveResult("");
        }, 10000)
    }
	const CheckApiKey = async (api_key: string) => {
		let response: ApiKeyCheckResponse;
		await ApiKeyCheck(api_key)
		.then(res => response = res)
		.catch(err => console.error(err))
		if (response.valid) {
			setValidApiKey(response.valid);
			setAlertShowCount(alertShowCount+1);
			setApiKey(response.api_key);
			window.APP.API.tinifyCompressionsCheck(apiKey)
			.then(res => setCompressCount(res))
		}
		else {
			setValidApiKey(response.valid);
			response.msg ? setApiState(response.msg) : null;
		}
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
	}, [apiKey, outputLoc, overwriteFile])
	return (
		<>
			{ settings != null && settings != undefined &&
				<ThemeProvider theme={darkTheme}>
					<CssBaseline />
					<section className='app__main-wrapper'>
						<ApiKeyAlert apiKey={apiKey} setApiKey={setApiKey} checkApiKey={CheckApiKey}
						apiState={apiState} validApiKey={validApiKey} alertShowCount={alertShowCount}/>
						<Typography variant="h6" component='h1' className='app__title'>TinyPNG Desktop Client</Typography>
						<ImgCompress userSettings={settings}/>
						<Divider/>
						<Options>
							<Typography variant='h6' component='h2'
							className='settings__title'>Options</Typography>
							<Divider/>
							{/* <Convert/> */}
							<Settings apiKey={apiKey} setApiKey={setApiKey} outputLoc={outputLoc}
							setOutputLoc={setOutputLoc} overwriteFile={overwriteFile} setOverwriteFile={setOverwriteFile}
							saveResult={saveResult} compressCount={compressCount}/>
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