"use server";

import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
  const uri = process.env.MONGODB_URI;
  const { number, capacity } = await request.json();

  const client = new MongoClient(uri);


  try {
    await client.connect();
    const database = client.db("Seat_Plan");
    const collection = database.collection("Rooms");

    const result = await collection.insertOne({
      number,
      capacity,
    });

    if (result.acknowledged) {
      return NextResponse.json(
        { message: "Room Added Successfully", status: 200 },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Failed to add room" },
        { status: 500 }
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
