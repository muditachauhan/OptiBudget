const jwt = require("jsonwebtoken");

function verifyToken(req, res, next){

  const token = req.headers["authorization"];

  if(!token){
    return res.status(401).json({ error: "No token" });
  }

  try{
    const decoded = jwt.verify(token, "secretkey");
    req.userId = decoded.userId;
    next();
  } catch(err){
    res.status(401).json({ error: "Invalid token" });
  }
}

module.exports = verifyToken;