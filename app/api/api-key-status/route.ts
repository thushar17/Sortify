import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
    const session = await auth()
     if (!session?.user?.email) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  const user = await prisma.user.findUnique({
    where:{
        email: session.user.email
    },
    select:{
        apiKeyHash: true,
    }
  })

  return NextResponse.json({
     hasApiKey: !!user?.apiKeyHash,
  })
}