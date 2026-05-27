const jwt = require("jsonwebtoken");

function verifyToken(req, res, next){

  const token = req.headers["authorization"];

  if(!token){
    return res.status(401).json({ error: "No token" });
  }

  try{
    const decoded = jwt.verify(token, "secretkey123");
    req.userId = decoded.userId || decoded.id;
    next();
  } catch(err){
    res.status(401).json({ error: "Invalid token" });
  }
}

module.exports = verifyToken;