"use server";

import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function DELETE(request) {
  const uri = process.env.MONGODB_URI;
  const { number } = await request.json();

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("Seat_Plan");
    const collection = database.collection("Rooms");

    const result = await collection.findOneAndDelete({ _id: new ObjectId(number) });

    if (result || result.value) {
      return NextResponse.json(
        { message: "Room removed successfully", status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Room not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
