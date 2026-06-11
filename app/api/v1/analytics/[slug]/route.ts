import { NextResponse } from "next/server";
import { authenticateApiKey } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(req:Request,
    {params}: Props
) {
    const apiKey = req.headers.get("x-api-key")
    const user = await authenticateApiKey(apiKey || "")
     if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const {slug} = await params

  const link = await prisma.link.findFirst({
    where:{
        slug,
        userId: user.id
    },
    include:{
        clicks: true
    }
  })
   if (!link) {
    return NextResponse.json(
      { error: "Link not found" },
      { status: 404 }
    );
  }

   return NextResponse.json({
    slug: link.slug,
    originalUrl: link.originalUrl,
    totalClicks: link.clicks.length,
    clicks: link.clicks
   })
}