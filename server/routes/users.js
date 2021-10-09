const express=require('express');
const router=express.Router();
const User=require('../models/User');


// updating user account
router.put("/:id",async(req,res)=>{
    if(req.body.userId===req.params.id||req.body.isAdmin){
        if(req.body.password){
            try{
                const salt=await bcrypt.genSalt(10);
                req.body.password=await bcrypt.hash(req.body.password,salt);
            }catch(err){
                return res.status(500).json(err);
            }
        }
        try{
            const user =await User.findByIdAndUpdate(req.params.id,{
                $set:req.body 
            });
            res.status(200).json("Account updated");
        }catch(err){
            return res.status(500).json(err);
        }
    }
    else{
        res.status(403).json("you can update only your account");
    }
})


//deleting user account
router.delete("/:id",async(req,res)=>{
    if(req.body.userId===req.params.id||req.body.isAdmin){
      
        try{
            const user =await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account deleted");
        }catch(err){
            return res.status(500).json(err);
        }
    }
    else{
        res.status(403).json("you can delete only your account");
    }
})


//getting a user

router.get("/:id",async(req,res)=>{
    try{
        const user = await User.findById(req.params.id);
        const {password,updatedAt, ...other}=user._doc;
        res.status(200).json(other);

    }
    catch(err){
        res.status(200).json(err);
    }
})


//follow a user

router.put("/:id/follow",async(req,res)=>{
        if(req.body.userId !== req.params.id){
            try{
                const user= User.findById(req.params.id);
                const currentUser=findById(req.body.id);
                if(!user.followers.includes(req.body.userId)){
                    await user.updateOne({$push:{followers:req.body.userId}});
                    await currentUser.updateOne({$push:{followings:req.body.userId}});
                    res.status(200).json("User has been followed");
                }
                else{
                    res.status(403).json("you already followed this user");
                }
            }catch(err){
                res.status(500).json(err);
            }
        }
        else{
            res.status(403).json("You can't follow yourself");
        }
})



//unfollow a user


router.put("/:id/unfollow",async(req,res)=>{
    if(req.body.userId !== req.params.id){
        try{
            const user= User.findById(req.params.id);
            const currentUser=findById(req.body.id);
            if(user.followers.includes(req.body.userId)){
                await user.updateOne({$pull:{followers:req.body.userId}});
                await currentUser.updateOne({$pull:{followings:req.body.userId}});
                res.status(200).json("User has been unfollowed");
            }
            else{
                res.status(403).json("you dont follow this user");
            }
        }catch(err){
            res.status(500).json(err);
        }
    }
    else{
        res.status(403).json("You can't unfollow yourself");
    }
})



 module.exports=router;

