import { createRoot } from 'react-dom/client';
import { App } from './types';
import { Display } from 'electron';
import { SetStateAction, useEffect, useState, Dispatch } from 'react';

import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper.min.css';

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
	const isPrimary = (label: string) => {
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
				<Swiper className='displays swiper'
				spaceBetween={50} slidesPerView={1}
				onSlideChange={() => console.log('slide change')}
				onSwiper={(swiper) => console.log(swiper)}
				>
					{displays.map((display, index) => (
						<SwiperSlide key={index} className={`display swiper-slide ` + (isPrimary(display.label) ? "primary" : "")}>
							<h3 className='display__title'>{display.label} <span className='display__primary'>{isPrimary(display.label) ? " - primary" : ""}</span></h3>
							<p className='display__details'>{`Details: ${display.bounds.width}x${display.bounds.height}px @ ${display.displayFrequency.toFixed(0)}hz`}</p>
							<p className='display__zoom'>{`Zoom: ${display.scaleFactor}x`}</p>
						</SwiperSlide>
					))}
				</Swiper>
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