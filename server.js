const express = require("express");
const bodyParser=require('body-parser');
const cookieParser=require('cookie-parser');
const userRouter=require("./routes/user.routes");
const postRouter=require("./routes/post.rotes");
require('dotenv').config({path:'./config/.env'});
require("./config/db");
const {checkUser,requireAuth}=require("./middleware/auth.middleware");
const cors = require('cors');

const app=express();

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  'allowedHeaders': ['sessionId', 'Content-Type'],
  'exposedHeaders': ['sessionId'],
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  'preflightContinue': false
}
app.use(cors(corsOptions));



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))
app.use(cookieParser());
//jwt
app.get('*',checkUser);
app.get('/jwtid', requireAuth, (req, res) => {
    res.status(200).send(res.locals.user._id)
  });
//router
app.use('/api/user',userRouter)
app.use('/api/post',postRouter)

//server
app.listen(process.env.PORT,()=>{
    console.log(`listeng ont port ${process.env.PORT}`);
})