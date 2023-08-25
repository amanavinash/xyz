
const User = require('../model/usertable');
const bcrypt =require('bcrypt');
const jwt = require('jsonwebtoken');
function stringValid(string){
    if(string == undefined || string.length ===0 ){
     return true
    }else{
      return false
   }
   }
const signupPost = async(req,res)=>{
   
    try {
        const {name,email,password} = req.body;
    
    if(stringValid(name)|| stringValid(email)|| stringValid(password)){
        res.status(400).json({msg: 'something is missing'})
      }
        const findmatch = await User.findOne({email:email}) ;
        if(findmatch===null){
            const salt =10;
            bcrypt.hash(password,salt,async(err,hash)=>{
                const user = await User.create({name:name,email:email,password:hash});         
               res.status(201).json({newuser:user})
            })
           
        }else {
            return res.status(401).json({newuser:"User  exist"})
        }
    } catch (error) {
        console.log(error)
       return res.status(500).json({message:error.message})
    }
   

}
function generateToken(id,name){
   return jwt.sign({userId:id,name:name},'secretKey')
}


const signinPost =async(req,res)=>{

    try {
        const {email,password}= req.body;
        if (stringValid(email)|| stringValid(password)){
            res.status(400).json({msg: ' missing parameter'})
          }
        const  found = await User.findOne({email:email});
    
        if( found===null){
          res.status(401).json({newuser: found})
           
        }else{
             bcrypt.compare(password, found.password,(err,result)=>{

                if(err){
                    res.status(401).json({newuser:err})

                }

                else if(result===true){
                    
                    res.status(201).json({newuser:'login successfull',token:generateToken(found.id,found.name)}) 
                }
                else{
                    res.status(401).json({message:'please singed in'});
                }
             })
               
    
        }
    } catch (error) {
       return res.status(500).json({message:error.message})
    }
   

}





module.exports = {
    signupPost,
    signinPost,
    generateToken
}