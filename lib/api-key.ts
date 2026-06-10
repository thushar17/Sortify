import crypto from 'crypto'

export function generateApiKey(){
    return(
        "sk_sortify_" + 
        crypto.randomBytes(24).toString("hex")
    )
}