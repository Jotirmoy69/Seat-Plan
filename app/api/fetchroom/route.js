'use server';

import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  const uri = process.env.MONGODB_URI;

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("Seat_Plan");
    const collection = database.collection("Rooms");

    const data = await collection.find({}).toArray();

    if (!data) {
      return NextResponse.json({ message: "No Data Found" }, { status: 401 });
    }

    return NextResponse.json({
      message: "Room Fetched Successfully",
      status: 200,
      data: data,
    });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json(
      { error: "Internal Server Bhai" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
