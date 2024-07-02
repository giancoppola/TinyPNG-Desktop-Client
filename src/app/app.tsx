import { createRoot } from 'react-dom/client';
import { App } from './types';
import { SetStateAction, useEffect, useState, Dispatch } from 'react';

import { PageView } from './views/_page-view';
import { NavMenu } from './views/_menu';

const Title = () => {
	return (
		<h1 className='app__title'>GC Tools</h1>
	)
}

const MainWrapper = () => {
	return (
		<main className='app__main-wrapper'>
			<NavMenu/>
			<PageView/>
		</main>
	)
}

const App = () => {
	return (
		<>
			<Title/>
			<MainWrapper/>
		</>
	)
}

const root = createRoot(document.getElementById("app"));
export const CreateApp = () => {
	root.render(<App/>);
}