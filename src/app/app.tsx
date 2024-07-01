import { createRoot } from 'react-dom/client';
import { App } from './types';
import { SetStateAction, useEffect, useState, Dispatch } from 'react';

import { Displays } from './modules/_displays';

const App = () => {
	return (
		<>
			<h1>GC Tools</h1>
			<Displays/>
		</>
	)
}

const root = createRoot(document.getElementById("app"));
export const CreateApp = () => {
	root.render(<App/>);
}