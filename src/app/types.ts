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

type DisplayFunction = () => Promise<Array<Display>>;
interface API {
    ping: VoidFunction;
    displays: DisplayFunction;
}

export interface App {
    versions: Versions;
    API: API;
}