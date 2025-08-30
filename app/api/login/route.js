"use server";

import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
  const uri = process.env.MONGODB_URI;
  const { username, password } = await request.json();

  const client = new MongoClient(uri);


  try {
    await client.connect();
    const database = client.db("Seat_Plan");
    const collection = database.collection("Users");

    const result = await collection.findOne({
      username,
      password,
    });

    if (result) {
      return NextResponse.json(
        { message: "Login successful", status: 200 },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Invalid username or password" },
        { status: 401 }
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
