const jwt = require('jsonwebtoken')

async function authUser (req, res, next) {
    let token = req.headers.authorization.split(' ')[1]
try{
        let decoded = jwt.verify(token, process.env.ACCESS_JWT_SECRET)

   if(decoded){
       req.user = decoded
   }

}
catch(err){
        res.status(401).json(err)
}
next()
}
async function adminAuthentication(req,res,next){
    let token = req.headers.authorization.split(' ')[1];
    console.log(token)
    let decoded
    try {
         decoded = await jwt.verify(token, process.env.JWT_SECRET)
        console.log(decoded)
        if(decoded.role!=='admin'){
            return res.status(401).send({error:"unauthorized access",err})
        }
    }
    catch(err){
   return res.status(500).send({"error":"adminAuthErorr",err})
    }
req.user = decoded;
next()
}


module.exports ={adminAuthentication,authUser}

