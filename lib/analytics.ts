export function getBrowser(userAgent: string){
    if(userAgent.includes("Chrome")){
        return "Chrome"
    }
    if(userAgent.includes("Firefox")){
        return "Firefox"
    }
    if(userAgent.includes("Safari")){
        return "Safari"
    }
    return "Unknown"
    
}

export function getDevice(userAgent: string){
    return userAgent.includes("Mobile")
    ? "Mobile"
    : "Desktop"
}