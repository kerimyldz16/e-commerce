import { supabase } from "../config/supabase.js";
//token control
export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      throw new Error("Invalid token");
    }

    req.user = data.user;
    next();
  } catch (error) {
    console.error("Error verifying token:", error.message);
    res.status(403).json({ message: "Invalid token" });
  }
};
