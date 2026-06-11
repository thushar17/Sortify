import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generateApiKey } from "@/lib/api-key";
import bcrypt from "bcryptjs";



export async function POST(req: Request) {
    

    const session = await auth()

if(!session?.user?.email){
    return NextResponse.json(
    {
      error: "Unauthorized",
    },
    {
      status: 401,
    }
  );
}

const apiKey = generateApiKey()
const apiKeyPrefix = apiKey
.replace("sk_sortify_","")
.slice(0,8) 
const apiKeyHash =await bcrypt.hash(apiKey, 10)

await prisma.user.update({
    where:{
        email: session?.user?.email
    },
    data:{
        apiKeyHash,
        apiKeyPrefix
    }
})

return NextResponse.json({
    apiKey,
})
}
