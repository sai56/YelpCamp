let express     = require("express"),
     router     = express.Router({mergeParams:true}),
    comment     = require("../models/comments"),
    campGround  = require("../models/campground");


router.get("/new",isLoggedIn,function(req,res){
    
    campGround.findById(req.params.id,function(err,foundCamp){
        if(err){
            req.flash("error","Could not find campground");
            res.redirect("/campgrounds");
        }else{
            res.render("comments/new",{foundCampground:foundCamp}); 
        }
    })
    

})

router.post("/",isLoggedIn,function(req,res){
    let newComment = req.body.comments;
    campGround.findById(req.params.id,function(err,campground){
        if(err){
            req.flash("error","Could not find campground");
            res.redirect("back");
        }else{
            comment.create(newComment,function(err,comment){
                if(err){
                    req.flash("error","Could not create comment");
                    res.redirect("back");
                }else{
                    
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success","Comment added successfully");
                    res.redirect("/campgrounds/"+req.params.id);
                }
            })
        }
    })
})

//EDIT 

router.get("/:comment_id/edit",checkCommentOwnership,function(req,res){
    let campgroundId = req.params.id;
    comment.findById(req.params.comment_id,function(err,comment){
        if(err){
           req.flash("error","Could not find comment");
           res.redirect("/campgrounds");
        }else{
            res.render("comments/edit",{campgroundId:campgroundId,comment:comment});
        }
    })
    
})


//UPDATE

router.put("/:comment_id",checkCommentOwnership,function(req,res){
    comment.findByIdAndUpdate(req.params.comment_id,req.body.comments,function(err,updatedComment){
        if(err){
            req.flash("error","Could not find comment");
            res.redirect("/campgrounds/"+req.params.id);
        }else{
            req.flash("success","Edited comment successfully");
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
})

//DELETE

router.delete("/:comment_id",checkCommentOwnership,function(req,res){
    comment.findByIdAndDelete(req.params.comment_id,function(err){
        if(err){
            req.flash("error","Cound not delete comment");
            res.redirect("/campgrounds/"+req.params.id);
        }else{
            req.flash("success","Successfully deleted comment");
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
    
})


function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash("error","You have to be logged in");
        res.redirect("/login");
    }
}

function checkCommentOwnership(req,res,next){
    if(req.isAuthenticated()){
        comment.findById(req.params.comment_id,function(err,foundComment){
            if(err){
                req.flash("error","Could not find the comment");
                res.redirect("back");
            }else{
                if(foundComment.author.id.equals(req.user._id)){
                   next(); 
                }else{
                    req.flash("error","You do not have the permission to do that");
                   res.redirect("back"); 
                }
            }
        })
    }else{
        req.flash("error","You have to be logged in");
        res.redirect("/login");
    }
}

module.exports = router;
    