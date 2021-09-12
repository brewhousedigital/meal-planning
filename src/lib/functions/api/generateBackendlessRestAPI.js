export const generateBackendlessRestAPI = (APP_ID, API_KEY) => {
    // Build the REST API
    // generateBackendlessRestAPI(process.env['BACKENDLESS_APP_ID'], process.env['BACKENDLESS_API_KEY_REST'])
    const APP_URL = "https://api.backendless.com/";
    return APP_URL + APP_ID + "/" + API_KEY;
}
