import { Display } from "electron";

// will be accessible globally in project
declare global {
    // extends the normal Window object
    interface Window {
        APP: App;
    }
}

export const FreshUserData: UserSettings = {
    api_key: "",
    output_location: "",
    overwrite_file: true,
}

export const supportedImages = ['image/webp', 'image/jpeg', 'image/png', '*/*'];
export type SupportedImage = 'image/webp' | 'image/jpeg' | 'image/png' | '*/*';

export interface UserSettings {
    api_key: string;
    output_location: string;
    overwrite_file: boolean;
}

export interface ApiKeyCheckResponse {
    valid: boolean;
    msg?: string;
    api_key: string;
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

type PromiseStringFunction = () => Promise<string>;
type PromiseStringArrFunction = () => Promise<string[]>;
type SetUserSettingsFunction = (settings: UserSettings) => Promise<string>;
type TinifyAPIFunction = (settings: ImgCompressSettings) => Promise<string[]>;
type TinifyAPIKeyCheck = (apiKey: string) => Promise<boolean>;
interface API {
    getUserSettings: PromiseStringFunction;
    setUserSettings: SetUserSettingsFunction;
    getFolder: PromiseStringFunction;
    getFiles: PromiseStringArrFunction;
    tinifyFiles: TinifyAPIFunction;
    tinifyApiKeyCheck: TinifyAPIKeyCheck;
}

export interface App {
    versions: Versions;
    API: API;
}

export interface ImgFile {
    path: string;
    index: number;
    name: string;
    type: string;
    size_in_mb: string;
}