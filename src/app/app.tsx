import { createRoot } from 'react-dom/client';
import { App } from './types';
import { Display } from 'electron';
import { SetStateAction, useEffect, useState, Dispatch } from 'react';

// Carousel imports
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

const Displays = () => {
	const [displays, setDisplays]: [Array<Display>, Dispatch<SetStateAction<Array<Display>>>] = useState([]);
	const [primary, setPrimary]: [Display, Dispatch<SetStateAction<Display>>] = useState();
	const [error, setError]: [string, Dispatch<SetStateAction<string>>] = useState("");
	const getDisplays = async () => {
		console.log("getting displays");
		window.APP.API.displays()
		.then((data) => {
			console.log('returning data');
			setDisplays(data);
			console.log(data);
		})
		.catch(e => {console.error(e); setError(e)});
	}
	const getPrimary = async () => {
		console.log("getting primary");
		window.APP.API.primaryDisplay()
		.then((data) => {
			console.log('returning data');
			setPrimary(data);
			console.log(data);
		})
		.catch(e => {console.error(e); setError(e)});
	}
	const isPrimary = (label: string) : boolean =>  {
		if (label === primary.label) {
			return true;
		}
		return false;
	}
	useEffect(() => {
		if (!displays.length) {
			getDisplays();
		}
		if (!primary) {
			getPrimary();
		}
	}, [])
	return (
		<section>
			<h2>Displays</h2>
			{error && (
				<div>
					<p>Ran into an error getting displays! See below;</p>
					<p>{error}</p>
				</div>
			)}
			{!error &&
				<Carousel className='displays'>
					{displays.map((display, index) => (
						<div key={index} className={`display ` + (isPrimary(display.label) ? "primary" : "")}>
							<h3 className='display__title'>{display.label} <span className='display__primary'>{isPrimary(display.label) ? " - primary" : ""}</span></h3>
							<p className='display__details'>{`Details: ${display.bounds.width}x${display.bounds.height}px @ ${display.displayFrequency.toFixed(0)}hz`}</p>
							<p className='display__zoom'>{`Zoom: ${display.scaleFactor}x`}</p>
						</div>
					))}
				</Carousel>
			}
		</section>
	)
}

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