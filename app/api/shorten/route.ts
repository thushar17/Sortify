import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";
import { createLinkSchema } from "@/lib/validation";
import { auth } from "@/auth";

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
    const body = await req.json()
    const result = createLinkSchema.safeParse(body)
    console.log(result)
    if(!result.success){
        return NextResponse.json(
            {error: result.error.issues[0].message,},
            {status: 400}
        )
    }
    const url = result.data.url
    const slug = result.data.slug
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
            userId: user.id
        }
    })

    return NextResponse.json({
        success: true,
        shortUrl: `${process.env.NEXT_PUBLIC_APP_URL}/${link.slug}`
    })
}
