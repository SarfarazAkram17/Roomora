import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const verifyJwt = () => {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return { error: "No token provided" };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { user: decoded };
  } catch (err) {
    return { error: "Forbidden: Invalid or expired token" };
  }
};