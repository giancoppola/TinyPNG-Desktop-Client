import { createRoot } from 'react-dom/client';
import { App } from './types';
import { SetStateAction, useEffect, useState, Dispatch } from 'react';
import { ThemeProvider, CssBaseline, createTheme, Button, Typography } from '@mui/material';

import { PageView } from './views/_page-view';

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
				<PageView/>
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