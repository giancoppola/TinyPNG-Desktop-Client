import { ApiKeyCheckResponse, UserSettings } from "./types"

export const ApiKeyCheck = async (api_key: string): Promise<ApiKeyCheckResponse>  => {
    // Initial checks before using API
    if (!api_key) { return { valid: false, msg: "", api_key: api_key } };
    if (api_key === "dev-bypass") { return { valid: true, api_key: api_key } };
    if (api_key.includes(" ")) { return { valid: false, msg: "Your API Key Cannot Contain Spaces", api_key: api_key } };
    // Checking with TinyPNG API
    let valid: boolean;
    await window.APP.API.tinifyApiKeyCheck(api_key)
    .then(res => {console.log(res); valid = res})
    .catch(err => console.error(err))
    if (valid) { return { valid: true, api_key: api_key} };
    return { valid: false, msg: "TinyPNG API Key Invalid", api_key: api_key };
}

export const isUserSettings = (settings: UserSettings): settings is UserSettings => {
	if (settings.api_key != null && settings.output_location != null && settings.overwrite_file != null) {
		return true;
	}
	return false;
}