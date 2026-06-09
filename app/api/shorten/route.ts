import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";
import { createLinkSchema } from "@/lib/validation";
import { auth } from "@/auth"; 
import { createLinkLimiter } from "@/lib/rateLimit";
import bcrypt from 'bcryptjs'
export async function POST(req:Request) {
     const session = await auth()
    if(!session?.user?.email)
{
    return Response.json(
        {error :"unauthorized"},
        {status: 400}
    )
} 
const user = await prisma.user.findUnique({
        where:{
            email: session?.user?.email
        }
    })

    if (!user) {
  return Response.json(
    { error: "User not found" },
    { status: 404 }
  );
}

// rate limit
  const userEmail = session.user.email
  const {success} = await createLinkLimiter.limit(userEmail)
   if(!success){
    return NextResponse.json(
        {message: "Link limit Exceeded"},
        {status: 429}
    )
   }
    const body = await req.json()
    const result = createLinkSchema.safeParse(body)
    if(!result.success){
        return NextResponse.json(
            {error: result.error.issues[0].message,},
            {status: 400}
        )
    }
    const url = result.data.url
    const slug = result.data.slug
    const expiresAt = result.data.expiresAt
    const password = result.data.password
    const hassedPassword = password?.trim() ?
                            await bcrypt.hash(password,10): null
    let finalslug
if (slug?.trim()){
    const existing = await prisma.link.findUnique({
        where:{
            slug:slug
        }
    })
  
    if (existing) {
  return NextResponse.json(
    { error: "Slug already exists" },
    { status: 400 }
  );
}
finalslug = slug
}
else{
    finalslug = nanoid(6)
}
const link = await prisma.link.create({
        data:{
            originalUrl: url,
            slug: finalslug,
            expiresAt: expiresAt? new Date(expiresAt): null,
            userId: user.id,
            password: hassedPassword
            
        }
    })

    return NextResponse.json({
        success: true,
        shortUrl: `${process.env.NEXT_PUBLIC_APP_URL}/${link.slug}`
    })
}
