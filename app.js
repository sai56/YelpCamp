let express       = require('express'),
    app           = express(),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
    comment       = require("./models/comments"),
    passport      = require("passport"),
    localStrategy  = require("passport-local"),
    campGround    = require("./models/campground"),
    seedDb        = require("./seeds"),
    user          = require("./models/user"),
    flash         = require("connect-flash"),
    methodOverride= require("method-override");

let campgroundRoutes =  require("./routes/campgrounds"),
    commentRoutes    =  require("./routes/comments"),
    indexRoutes      =  require("./routes/index");
    
//seedDb();     //seeding the database 


//PASSPORT CONFIG

app.use(require("express-session")({
    secret:"achur",
    resave:false,
    saveUninitialized:false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());
    
mongoose.connect("mongodb://localhost/yelpcamp",{useNewUrlParser:true});    

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error       = req.flash("error");
    res.locals.success     = req.flash("success");
    next();
})


//ROUTES
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/",indexRoutes);


app.listen(process.env.PORT,process.env.IP,function(){
    console.log("YelpCamp server has started");
})