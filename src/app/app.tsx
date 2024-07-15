import { createRoot } from 'react-dom/client';
import { App } from './types';
import { SetStateAction, useEffect, useState, Dispatch } from 'react';
import { ThemeProvider, CssBaseline, createTheme, Button, Typography } from '@mui/material';

import { Options } from './views/_settings';
import { ImgCompress } from './views/_file-drop';

const darkTheme = createTheme({
	palette: {
	  mode: 'dark',
	},
});

const MainWrapper = () => {

	return (
		<ThemeProvider theme={darkTheme}>
      		<CssBaseline />
			<section className='app__main-wrapper'>
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