const jwt = require('jsonwebtoken');
const getuser=async (req,res,next)=>{
    try {
        const token=req.header("auth-token")
        if (!token){
            return res.status(401).send({error:"invalid login"})
        }
        const data=await jwt.verify(token,'shhhhh');
        console.log(data)
        req.user=data;
        next();
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal server error ")
    }

}
module.exports=getuser;