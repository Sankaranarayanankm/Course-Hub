import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
  // if (req.method == "OPTIONS") {
  //   return next();
  // }
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Invalid Token",
      });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid Token" });
  }
};

export const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    // if (req.method == "OPTIONS") {
    //   return next();
    // }
    if (!roles.includes(req.user.role)) {
      return res
        .status(401)
        .json({ success: false, message: "You dont have permission for this" });
    }
    next();
  };
};
