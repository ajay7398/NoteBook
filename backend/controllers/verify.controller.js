const verifyUser=async(req,res)=>{
 const token = req.cookies.token;
const jwt = require('jsonwebtoken');
  if (!token) return res.json({ success: false });

  try {
    const decoded = jwt.verify(token, "your_jwt_secret");
    res.json({ success: true, user: decoded });
  } catch (err) {
    res.json({ success: false });
  }
}