import jwt from "jsonwebtoken";

//check if user is authenticated
export const checkAuth = (req, res, next) => {
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");

  if (!token) {
    return res.status(403).json({ message: "Invalid token" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    req.userId = decodedToken._id;
    next();
  } catch (error) {
    throw new Error(error.message);
  }
};
