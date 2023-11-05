require('dotenv').config();
const express=require('express');
const app=express();
const port=3000;
const flash=require("connect-flash");
const parser=require("cookie-parser");
const session=require("express-session");
app.use(parser(process.env.MYCK));
app.use(
    session({
        secret:process.env.MYSK,
        resave:false,
        saveUninitialized:false,
        cookie:{secure:false},
    })
);
app.use(flash());
app.get("/",(req,res)=>{
    req.flash("love","珊");
   return res.send("main page"+" i <h1>love</h1>"+req.flash("love"));
});
app.get("/setcookie",(req,res)=>{
    res.cookie("yourcookie","oreo",{signed:true});
    return res.send("already set");
});
app.get("/seecookie",(req,res)=>{
    console.log(req.signedCookies.yourcookie);
    return res.send("see cookie "+req.signedCookies.yourcookie);
});
app.get("/setsession",(req,res)=>{
    req.session.example="something not important";
    return res.send("在伺服器設定session data,在browser設置已經簽名的session_id");
});
app.get("/seesession",(req,res)=>{
    console.log(req.session);
    return res.send("看一下已經設定好的session data");
});
app.get("/ver",(req,res)=>{
    req.session.ver=true;
    res.send("成功登入了hehe 去看秘密吧");
});
app.get("/login",(req,res)=>{
    if(!req.session.ver){
        res.send("我覺得你先等等 請登入再看秘密");
    }else{
        res.send("<h1>登入成功我好愛孟珊</h1>");
    }
});
app.listen(port,()=>{
    console.log('example app listening on port ${port}');
});