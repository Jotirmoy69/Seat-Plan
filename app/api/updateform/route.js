"use server";

import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
  const uri = process.env.MONGODB_URI;
  const body = await request.json();

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("Seat_Plan");
    const collection = database.collection("Forms");

    if (!body._id) {
      return NextResponse.json(
        { message: "Missing _id" },
        { status: 400 }
      );
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(body._id) },
      {
        $set: {
          name: body.name,
          class: body.class,
          boys: body.boys,
          girls: body.girls,
          totalBoys: body.totalBoys,
          totalGirls: body.totalGirls,
        },
      }
    );

    if (result.modifiedCount > 0) {
      return NextResponse.json(
        { message: "Form Updated Successfully", status: 200 },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Form not found or no changes made", status: 404 },
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
