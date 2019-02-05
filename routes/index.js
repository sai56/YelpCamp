let express = require("express"),
     router = express.Router(),
    passport= require("passport"),
    user    = require("../models/user");

router.get("/",function(req,res){
    res.render("landing");
})


//show register form

router.get("/register",function(req,res){
    res.render("register");
})

router.post("/register",function(req,res){
    
    let newUser = new user({username:req.body.username});
    
    user.register(newUser,req.body.password,function(err,user){
        if(err){
            req.flash("error",err.message);
            
            return res.render("register");
        }
        passport.authenticate("local")(req,res,function(){
            req.flash("success","Welcome to YelpCamp "+user.username);
            res.redirect("/campgrounds");
        })
        
    });
    
})

router.get("/login",function(req,res){
    res.render("login");
});

router.post("/login",passport.authenticate("local",{
    successRedirect:"/campgrounds",
    failureRedirect:"/login"
}),function(req,res){});


router.get("/logout",function(req,res){
    req.logout();
    req.flash("success","Successfully logged out");
    res.redirect("/");
})


function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash("error","You have to be logged in");
        res.redirect("/login");
    }
}

module.exports = router;