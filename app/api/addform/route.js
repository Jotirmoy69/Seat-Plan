"use server";

import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
  const uri = process.env.MONGODB_URI;
  const body = await request.json();

  const client = new MongoClient(uri);


  try {
    await client.connect();
    const database = client.db("Seat_Plan");
    const collection = database.collection("Forms");

    const result = await collection.insertOne(body);

    if (result.acknowledged) {
      return NextResponse.json(
        { message: "Form Added Successfully", status: 200 },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Failed to add Form" },
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
