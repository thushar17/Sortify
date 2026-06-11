import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export async function authenticateApiKey(apiKey: string) {
    
    if(!apiKey){
        return null
    }
    const apiKeyPrefix = apiKey.replace("sk_sortify_","").slice(0,8)

    const user = await prisma.user.findUnique({
        where:{
            apiKeyPrefix
        }
    })
    if(!user?.apiKeyHash){
        return null
    }
    const valid = await bcrypt.compare(apiKey, user.apiKeyHash)
    if(!valid){
        return null
    }
    return user
}