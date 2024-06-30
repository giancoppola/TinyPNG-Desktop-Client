import { createRoot } from 'react-dom/client';
import { App } from './types';
import { Display } from 'electron';
import { SetStateAction, useEffect, useState, Dispatch } from 'react';

const Displays = () => {
    const [displays, setDisplays]: [Array<Display>, Dispatch<SetStateAction<Array<Display>>>] = useState([]);
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
    useEffect(() => {
        if (!displays.length) {
            getDisplays();
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
            {!error && displays.map((display, index) => (
                <div key={index}>
                    <h3>{display.label}</h3>
                    <p>{`${display.bounds.width}x${display.bounds.height}px`}</p>
                    <p>{`${display.displayFrequency.toFixed(0)}hz`}</p>
                    
                </div>
            ))}
        </section>
    )
}

const App = () => {
    return (
        <>
            <h1>Hello World</h1>
            <Displays/>
        </>
    )
}

const root = createRoot(document.getElementById("app"));
export const CreateApp = () => {
    root.render(<App/>);
}