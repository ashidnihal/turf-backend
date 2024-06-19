const jwt =require('jsonwebtoken')
// token verification

const jwtMiddleware=(req,res,next)=>{
    console.log("inside jwtmidlleware");
 try{
       // get the token
       const token=req.headers['authorization'].slice(7)
       console.log(token);
       // verify the token
       const jwtVerification=jwt.verify(token, "super2024")
       console.log(jwtVerification);//payload-userdid
       req.payload=jwtVerification.userid
       next()
 }
 catch (err) {
    res.status(401).json({"Authorization Error":err.message})
 }
}
module.exports=jwtMiddleware