const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/user');
const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());
const auth = require("./middleware/auth");

mongoose.connect('mongodb://127.0.0.1:27017/blogging',(err)=>{
    if(!err)return console.log('connected !!');
    return (err);
});

app.post("/welcome", auth, (req, res) => {
    res.status(200).send("Welcome");
});

app.use(['/user','/users'], userRouter);

app.listen(PORT , ()=>{
    console.log(`Server is running on port ${PORT}`);
})