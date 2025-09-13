import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const verifyJwt = (email) => {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return { error: "No token provided" };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // If you pass an email, enforce match
    if (email && decoded.email !== email) {
      return { error: "Forbidden: Email mismatch" };
    }

    return { user: decoded }; // contains email (and maybe role if stored)
  } catch (err) {
    return { error: "Forbidden: Invalid or expired token" };
  }
};