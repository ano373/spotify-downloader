export function constructUrl(baseUrl, queryParams) {
    const urlObj = new URL(baseUrl);
    const params = new URLSearchParams(queryParams);
    urlObj.search = params.toString();
    return urlObj.toString();
}

export function setlocalStorage(key, value){
    localStorage.setItem(key, value);
}

export function getlocalStorage(key){
    try {
        return localStorage.getItem(key);
    } catch (error) {
        console.error("Error accessing localStorage:", error);
        return error;
    }
    
}