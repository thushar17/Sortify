import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    const body = await req.json()

    const {slug, password} = body

    const link = await prisma.link.findUnique({
        where:{
            slug
        }
    })
   if (!link) {
  return NextResponse.json(
    {
      error: "Link not found",
    },
    {
      status: 404,
    }
  );
}

    if (!link.password) {
    return NextResponse.json(
      {
        error: "This link is not protected",
      },
      {
        status: 400,
      }
    );
  }

  const isValid = await bcrypt.compare(
    password, link.password
  )
   if (!isValid) {
    return NextResponse.json(
      {
        error: "Incorrect password",
      },
      {
        status: 401,
      }
    );
  }
  const cookieStore= 
    await cookies()

    cookieStore.set(
        `verified-${slug}`,
        "true",
        {
    httpOnly: true,
    maxAge: 60 * 60,
    path: "/",
  }
    )
  return NextResponse.json({
    success: true,
  });
}