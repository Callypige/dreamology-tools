import connectMongoDB from "@/libs/mongodb";
import Dream from "@/models/Dream";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// 📝 PUT - Update a specific dream
export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  const data = await request.json();

  await connectMongoDB();

  const updated = await Dream.findOneAndUpdate(
    { _id: id, user: session.user.id }, // ensure user owns the dream
    data,
    { new: true }
  );

  if (!updated) {
    return NextResponse.json({ error: "Dream not found or access denied" }, { status: 404 });
  }

  return NextResponse.json({ message: "Dream updated successfully", dream: updated }, { status: 200 });
}

// 📥 GET - Retrieve a specific dream
export async function GET(request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  await connectMongoDB();

  const dream = await Dream.findOne({ _id: id, user: session.user.id });

  if (!dream) {
    return NextResponse.json({ error: "Dream not found or access denied" }, { status: 404 });
  }

  return NextResponse.json({ dream }, { status: 200 });
}
