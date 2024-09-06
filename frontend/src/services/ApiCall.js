import axios from 'axios'

export const commonrequest = async (methods, url, body, header) => {
    try {
        const response = await axios({
            method: methods,
            url,
            headers: header || {
                "Content-Type": "application/json"
            },
            data: body
        });
        return response;
    } catch (error) {
        console.error(`API call error at ${url}:`, error);
        throw error;  
    }
};
