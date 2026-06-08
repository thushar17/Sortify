import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {prisma} from '@/lib/prisma'

type Props = {
    params: Promise<{
        id: string
    }>
}

export async function DELETE(
  request: Request,
  { params }: Props
) {
  const { id } = await params;

  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  const link = await prisma.link.findUnique({
    where: {
      id,
    },
  });

  if (!link || link.userId !== user?.id) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  await prisma.link.delete({
    where: {
      id,
    },
  });

  return NextResponse.json({
    message: "Link deleted",
  });
}