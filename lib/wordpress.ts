"use server"

export const checkUrl = async (url: string): Promise<boolean> => {  
    // Initialize as falsy
    let isWordPress: boolean = false;

    try {
        // Send a HEAD request to the provided URL
        const response = await fetch(url, {
            method: "HEAD",
        })
        // Check the headers for the presence of the WordPress API
        // Further checks will be needed to determine if the site is WordPress
        // when the Rest API is disabled
        const headerLinks = response.headers.get("link");
        if (headerLinks?.includes("https://api.w.org")) {
            isWordPress = true;
        }
    } catch (error) {
        console.log("Error parsing response headers: ", error);
    }

    // Return the result as a boolean
    return isWordPress!!;
}