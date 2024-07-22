import { createRoot } from 'react-dom/client';
import { App, ImgCompressSettings } from './types';
import { SetStateAction, useEffect, useState, Dispatch } from 'react';
import { ThemeProvider, CssBaseline, createTheme, Button, Typography } from '@mui/material';

import { UserSettings } from './types';

import { Options } from './views/_settings';
import { ImgCompress } from './views/_file-drop';
import { ApiKeyAlert } from './views/_api-key-alert';
import { Api } from '@mui/icons-material';

const darkTheme = createTheme({
	palette: {
	  mode: 'dark',
	},
});

const MainWrapper = () => {
	const [settings, setSettings]: [UserSettings, Dispatch<UserSettings>] = useState();
	const [imgSettings, setImgSettings]: [ImgCompressSettings, Dispatch<ImgCompressSettings>] = useState();
    const [saveResult, setSaveResult]: [string, Dispatch<string>] = useState("");
    const [userSettings, setUserSettings]: [UserSettings, Dispatch<UserSettings>] = useState();
    const [apiKey, setApiKey]: [string, Dispatch<string>] = useState<string>("");
    const [outputLoc, setOutputLoc]: [string, Dispatch<string>] = useState("");
	useEffect(() => {
		GetUserSettings();
	}, [])
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
	return (
		<ThemeProvider theme={darkTheme}>
      		<CssBaseline />
			<section className='app__main-wrapper'>
				<ApiKeyAlert/>
				<Typography variant="h6" component='h1' className='app__title'>TinyPNG Desktop Client</Typography>
				<ImgCompress/>
				<Options/>
			</section>
		</ThemeProvider>
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