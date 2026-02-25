const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserDetails = require('../models/model');
const router = express.Router();


router.post('/register', async(req,res)=>{
    try{
        const {email,password} = req.body;
        const userexist = await UserDetails.findOne({email});
        if(userexist){
            return res.status(400).json({message:"User already exists"});
        }
        const hash = await bcrypt.hash(password,10);
        const newuser = new UserDetails({
            email,
            password:hash,
        });
        await newuser.save();
        res.json({message:'Signup Successful'});
    }catch(err){
        res.status(500).json({message:err.message});
    }
})



router.post('/login',async(req,res)=>{
    try{
        const {email,password} = req.body;
        const user = await UserDetails.findOne({email});
        if(!user){
            return res.status(400).json({message:"User not found"});
        }
        const match = await bcrypt.compare(password,user.password);
        if(!match){
            return res.status(400).json({message:"Wrong password"});
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({message:'Login Successfully',token});
    }catch(err){
        res.status(500).json({message:err.message});
    }
})

// List all users (for admin/testing)
router.get('/users', async (req, res) => {
    try {
        const users = await UserDetails.find({}, 'name email _id');
        res.json({ users });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router