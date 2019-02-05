let express     = require("express"),
    router      = express.Router(),
    campGround  = require("../models/campground");
    
//INDEX - displays a list of all campgrounds

router.get("/",function(req,res){
   
    campGround.find({},function(err,campgrounds){
        if(err){
            req.flash("error","Could not load the campgrounds");
            res.redirect("/");
        }
        else{
            res.render("campgrounds/index",{camps:campgrounds});
        }
    })
})



//CREATE - creates a new campground

router.post("/",isLoggedIn,function(req,res){
    
    let name = req.body.name;
    let img = req.body.image;
    let dsc = req.body.description;
    
    let author = {
      id:req.user._id,
      username:req.user.username
    };
    let newCampGround = {name:name,image:img,description:dsc,author:author};
    
    campGround.create(newCampGround,function(err,campground){
        if(err){
            req.flash("error","Failed to create a new campground");
            res.redirect("/campgrounds");
        }
        else{
           
            res.redirect("/campgrounds");
        }
    })
    
})


//NEW - displays a form to add a new campground

router.get("/new",isLoggedIn,function(req,res){
    res.render("campgrounds/new");
})


//SHOW - shows more info of a particular campground

router.get("/:id",function(req,res){
    let campGroundId=req.params.id;
    
    campGround.findById(campGroundId).populate("comments").exec(function(err,foundCampGround){
        
        if(err){
            req.flash("error","Could not find the campground");
            res.redirect("/campgrounds");
        }else{
            res.render("campgrounds/show",{foundCampGround:foundCampGround});
        }
    })
    
    
})


//EDIT
router.get("/:id/edit",checkCampgroundOwnership,function(req,res){
    campGround.findById(req.params.id,function(err,foundcampGround){
        if(err){
            req.flash("error","Something went wrong");
            res.redirect("/campgrounds");
        }else{
            res.render("campgrounds/edit",{campground:foundcampGround});
        }    
    })
    
})


//UPDATE
router.put("/:id",checkCampgroundOwnership,function(req,res){
    campGround.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCamp){
        if(err){
            req.flash("Could not find the campground");
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/"+updatedCamp._id);
        }
    })
})


//Delete
router.delete("/:id",checkCampgroundOwnership,function(req,res){
    campGround.findByIdAndRemove(req.params.id,function(err){
        if(err){
            req.flash("error","Cound not delete campground");
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    });
})

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash("error","You have to be logged in");
        res.redirect("/login");
    }
}

function checkCampgroundOwnership(req,res,next){
    if(req.isAuthenticated()){
        campGround.findById(req.params.id,function(err,foundcampGround){
            if(err){
                req.flash("error","Could not find campground");
                res.redirect("/campgrounds");
            }else{
                if(foundcampGround.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error","You do not have the permission to do that");
                    res.redirect("/campgrounds");
                }
            }
        })
    } else {
        req.flash("error","You have to be logged in");
        res.redirect("/login");
    }   
}

module.exports = router;