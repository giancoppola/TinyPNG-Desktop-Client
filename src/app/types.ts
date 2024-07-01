import { Display } from "electron";

// will be accessible globally in project
declare global {
    // extends the normal Window object
    interface Window {
        APP: App;
    }
}

interface Versions {
    node: string;
    chrome: string;
    electron: string;
}

type DisplaysFunction = () => Promise<Array<Display>>;
type DisplayFunction = () => Promise<Display>;
interface API {
    displays: DisplaysFunction;
    primaryDisplay: DisplayFunction;
}

export interface App {
    versions: Versions;
    API: API;
}