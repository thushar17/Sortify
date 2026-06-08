import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(){

    const session = await auth()
    console.log("SESSION:", session);
    if (!session?.user?.email){
        return NextResponse.json(
            {message: "unauthorized"},
            {status: 401}
        )
    }
    const user = await prisma.user.findUnique({
        where:{
            email: session.user.email,
        }
    })
    if (!user) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }
    const links = await prisma.link.findMany({
        where:{
            userId: user.id
        },
        include:{
            clicks: true
        }
    });

    const formattedLinks = links.map((link)=>({
         id: link.id,
         slug: link.slug,
         originalUrl: link.originalUrl,
         totalClicks: link.clicks.length,
         createdAt: link.createdAt

    }))
    return NextResponse.json(formattedLinks)
}
