const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const {token} = req.cookies;
  console.log(token)
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.userId = decoded.id; // 👈 Save decoded token to request
    next();
  } catch (error) {
    console.log(error)
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = verifyToken;
