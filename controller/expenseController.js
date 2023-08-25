const Expense = require('../model/expensetable');
const User = require('../model/usertable');
const sequelize = require('../model/database');
const postexpense = async(req,res,next)=>{
const check=req.body.price;
   try{
    if(!check){
        throw new Error('Price is Mandetory')
    }
    let price = req.body.price;
    let description = req.body.category;
    let category = req.body.description;
    if(price.length === 0 ){
      return res.status(400).json({success: false, message: ' please enter price '})
 }
    const data = await Expense.create({price,category,description,userId:req.user.id});
  
     try {
    res.status(201).json({newuser:data});
     } catch (error) {
        return res.status(500).json({success: false, error: err})
     }
}catch(error){
    res.status(500).json({err:error})};
};
const getexpense = async  (req,res,next)=>{
  try{
  const pagelimit=Number(req.query.query2);
  const page=Number(req.query.query1);
  const totalUserExpense = await Expense.find().count({userId:req.user.id});
  const users = await Expense.find({userId:req.user.id}).skip((page-1)*pagelimit).limit(pagelimit);
    //string validator
    if(users.length>0 && users!==null && users!==undefined){
       res.status(200).json({success:true,message:"Successfully",users,lastPage:Math.ceil(totalUserExpense/pagelimit)
    })
    }else{
      res.status(200).json({success:true,msg:"No expense",users});
    }
  }
  catch(err){
    console.log(err)
  }

}

//Delete 

const deleteexpense=async(req,res)=>{
    try{    
  const Delete = await Expense.deleteOne({_id:req.params.id});
  res.status(200).json({massage : 'successful',deleteddata: Delete })
  }catch(err){
        console.log(err);
        res.status(500).json({error:err})
        
    }
};
module.exports={
    postexpense,
    getexpense,
    deleteexpense,
    
}