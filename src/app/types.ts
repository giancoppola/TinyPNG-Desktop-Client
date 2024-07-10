import { Display } from "electron";

// will be accessible globally in project
declare global {
    // extends the normal Window object
    interface Window {
        APP: App;
    }
}

export interface UserSettings {
    tiny_png_api_key: string;
    tinify_output_location: string;
    mouse_mover: boolean;
}

type ResizeMethod = "scale" | "fit" | "cover" | "thumb";
type PreserveType = "copyright" | "creation" | "location";
export interface ImgCompressSettings {
    api_key: string;
    output_loc: string;
    file_names: string[];
    convert: boolean;
    conversion_type?: string;
    conversion_bg?: string;
    resize: boolean;
    resize_width?: number;
    resize_height?: number;
    resize_method?: ResizeMethod;
    preserve_metadata: boolean;
    preserve_type?: PreserveType;
}

interface Versions {
    node: string;
    chrome: string;
    electron: string;
}

type DisplaysFunction = () => Promise<Array<Display>>;
type DisplayFunction = () => Promise<Display>;
type PromiseStringFunction = () => Promise<string>;
type SetUserSettingsFunction = (settings: UserSettings) => Promise<string>;
interface API {
    displays: DisplaysFunction;
    primaryDisplay: DisplayFunction;
    getUserSettings: PromiseStringFunction;
    setUserSettings: SetUserSettingsFunction;
    getFolder: PromiseStringFunction;
}

export interface App {
    versions: Versions;
    API: API;
}