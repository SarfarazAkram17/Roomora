import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import collections from "@/lib/db";

export async function POST(req) {
  try {
    const { photo, name, email, password, role = "user" } = await req.json();

    // 1. Basic validation
    if (!photo || !name || !email || !password) {
      return NextResponse.json(
        { message: "Name, photo, email, and password are required" },
        { status: 400 }
      );
    }

    // 2. Check if user already exists
    const existingUser = await collections.users.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create new user
    const newUser = {
      photo,
      name,
      email,
      password: hashedPassword,
      role,
      createdAt: new Date().toISOString(),
    };

    await collections.users.insertOne(newUser);

    // 5. Create JWT token
    const token = jwt.sign(
      { email, role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // token valid for 7 days
    );

    // 6. Send token in HttpOnly cookie
    const response = NextResponse.json(
      {
        message: "User registered successfully",
        user: { photo, name, email, role },
      },
      { status: 201 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}