const express = require('express')
const userModel = require('../model/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const user = express.Router();


user.post('/register',async (req,res)=>{
    try{
        const newUser = new userModel(req.body);
        newUser.password =  await bcrypt.hash(newUser.password, 10);
        //create token
        const userToken = jwt.sign(
            { userId: newUser._id, email:newUser.email },
            "x-access-token",{
                expiresIn: "24h",
            }
        );

        newUser.token = userToken;
        const saveUser = await newUser.save();
        return res.json(saveUser);
    }catch(e){
        return res.json(e);
    }
})

user.post("/login", async(req, res) => {
    try {
        const { email, password } = req.body;

        if (!(email && password)) {
            res.status(400).send("Enter Email and password");
        }

        const userInfo = await userModel.findOne({ email });

        if (userInfo && (await bcrypt.compare(password, userInfo.password))) {
            const token = jwt.sign(
                { userId: userInfo._id, email:userInfo.email },
                "x-access-token",
                {
                    expiresIn: "24h",
                }
            );
            userInfo.token = token;
           return  res.status(200).json(userInfo);
        }
        return res.status(400).send("Invalid Credentials");
    } catch (err) {
        return res.json(err);
    }
});


user.get('/', async (req,res)=>{
    try{
        const users =  await userModel.find({});
        return res.json(users);
    }catch (e){
        res.json(e);
    }
});

user.get('/:id', async(req,res)=>{
    try{
        const user = await userModel.find({_id:req.params.id});
        return res.json(user);
    }catch (e){
        return res.json(e);
    }
});


user.put('/:id',async (req,res)=>{
    try {
        const result = await userModel.updateOne({_id: req.params.id}, req.body);
        return res.json(result);
    }catch{
        res.json({code:"DB_Error"})
    }
})
user.delete('/:id',async(req,res)=>{
    try{
        const user =  await userModel.deleteOne({_id:req.params.id});
        return res.send(user);
    }catch {
        res.json({code:"DB_Error"})
    }
})


module.exports = user;