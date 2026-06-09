import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"



type Props = {
    params: Promise<{
        slug: string
    }>
}
export async function GET(
    req:Request,
    {params}: Props 
) {
    const {slug} = await params;
    const link = await prisma.link.findUnique({
        where:{
            slug,
        },
        include:{
            clicks: true
        }
    })

    if(!link){
       return NextResponse.json({
          error: "Link not found"
       },{
        status: 404,
       })
    }
   const browsers : Record<string , number>= {}
   
   for(const click of link.clicks){
     const browser = click.browser || "unknown"
      browsers[browser]=
      (browsers[browser]|| 0)+1
   }

   const devices : Record <string , number> = {}
   for(const click of link.clicks){
    const device = click.device || "unknown"

    devices[device] =
     (devices[device]||0)+ 1
   }
   const countries: Record<string, number> = {};
   for (const click of link.clicks) {
  const country =
    click.country || "Unknown";

  countries[country] =
    (countries[country] || 0) + 1;
}
    return NextResponse.json(
        {
            totalClicks: link.clicks.length, 
            browsers,
            devices,
            countries
        }
    )
}