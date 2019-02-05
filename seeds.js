let mongoose   = require("mongoose"),
    campGround = require("./models/campground"),
    comment    = require("./models/comments");
    
    
let data = [
    
        {
            
            name:"Cloud's Rest",
            image:"https://media.gettyimages.com/photos/illuminated-green-tent-under-stars-at-night-forest-picture-id614333886?b=1&k=6&m=614333886&s=612x612&w=0&h=D5XJWPl0N7a2VDOcCkE2vqBn6CbYZ6D3W5WZQbuFTTI=",
            description:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
            
        },
         {
            name:"Cloud's Rest",
            image:"https://media.gettyimages.com/photos/illuminated-green-tent-under-stars-at-night-forest-picture-id614333886?b=1&k=6&m=614333886&s=612x612&w=0&h=D5XJWPl0N7a2VDOcCkE2vqBn6CbYZ6D3W5WZQbuFTTI=",
            description:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
            
        },
         {
            name:"Cloud's Rest",
            image:"https://media.gettyimages.com/photos/illuminated-green-tent-under-stars-at-night-forest-picture-id614333886?b=1&k=6&m=614333886&s=612x612&w=0&h=D5XJWPl0N7a2VDOcCkE2vqBn6CbYZ6D3W5WZQbuFTTI=",
            description:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
            
        }
    
    ]    
    
function seedDb(){
   campGround.remove({},function(err){
        if(err){
            console.log(err);
        }else{
            console.log("removed campgrounds");
            data.forEach(function(seed){
                campGround.create(seed,function(err,campground){
                    if(err){
                        console.log(err);
                    }else{
                        console.log("new campground added");
                        comment.create({
                            text:"This is an awesome place",
                            author:"Homer"
                        },function(err,newComment){
                            if(err){
                                console.log(err);
                            }else{
                                campground.comments.push(newComment);
                                campground.save();
                                console.log("Created new comment");
                            }
                        })
                    }
                })
            })
        }
    });
}   

module.exports = seedDb;