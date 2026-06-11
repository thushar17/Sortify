import { NextResponse } from "next/server";
import { authenticateApiKey } from "@/lib/api-auth";
import { createLinkSchema } from "@/lib/validation";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

export async function POST(req:Request) {
    const apiKey = req.headers.get("x-api-key")
    const user = await authenticateApiKey(apiKey|| "")
    if (!user) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }
  const data = await req.json()


   const result = createLinkSchema.safeParse(data)
   if (!result.success) {
  return NextResponse.json(
    {
      error:
        result.error.issues[0].message,
    },
    {
      status: 400,
    }
  );
}
const url = result.data.url;
const slug = result.data.slug;
let finalSlug

// custom slug logic
if(slug?.trim()){
   const existing =await prisma.link.findUnique({
    where:{
        slug
    }
   })
    if (existing) {
  return NextResponse.json(
    { error: "Slug already exists" },
    { status: 400 }
  );
}
finalSlug =slug
}
else{
 finalSlug = nanoid(6)
}

const link = await prisma.link.create({
    data:{
        originalUrl: url,
        slug: finalSlug,
        userId: user.id
    }
})



  return NextResponse.json({
    success: true,
    shortUrl: `${process.env.NEXT_PUBLIC_APP_URL}/${link.slug}`
  });
}

export async function GET(req:Request) {
    const apiKey = req.headers.get("x-api-key")
    const user = await authenticateApiKey(apiKey || "")
    if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const links = await prisma.link.findMany({
    where:{
        userId: user.id
    },
    include: {
      clicks: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return NextResponse.json({
    links: links.map((link)=>({
        id: link.id,
        slug: link.slug,
        originalUrl: link.originalUrl,
        click: link.clicks.length,
        createdAt: link.createdAt
    }))
  })
}