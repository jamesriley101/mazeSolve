/*global $ */

$("#flipImage").flip({
    trigger: "manual"
})

window.setInterval(function(){
    rotateImage();
}, 2500);

var imageUrls = {
    "nameImage":     "https://i.imgur.com/9sWSdtJ.jpg",
    "mathImage":     "https://i.imgur.com/3lCHNCl.png",
    "mechImage":     "https://i.imgur.com/azR4WfP.png",
    "controlsImage": "https://i.imgur.com/gN8tZxh.png",
    "webImage":      "https://i.imgur.com/V0p4rmn.jpg"
}

var imageRotation = {
        "nameImage": "mathImage", 
        "mathImage": "mechImage", 
        "mechImage": "controlsImage", 
        "controlsImage": "webImage", 
        "webImage": "nameImage"
};

var rotateImage = function(){
    if ($("#flipImage").data("flip-model").isFlipped){
        var nextImage = imageRotation[$(".back img").attr("id")];
        $("#" + nextImage.slice(0, -5)).addClass("bolden");
        $("#" + $(".back img").attr("id").slice(0, -5)).removeClass("bolden");
        $(".front img").attr("src", imageUrls[nextImage]);
        $(".front img").attr("id", nextImage);
        $("#flipImage").flip(false);
    }
    else {
        var nextImage = imageRotation[$(".front img").attr("id")];
        $("#" + nextImage.slice(0, -5)).addClass("bolden");
        $("#" + $(".front img").attr("id").slice(0, -5)).removeClass("bolden");
        $(".back img").attr("src", imageUrls[nextImage]);
        $(".back img").attr("id", nextImage);
        $("#flipImage").flip(true);
    }
};

// $(".specialties").on("mouseenter", function(){
//     var spec = this;
//     $(spec).addClass("bolden");
//     if ($("#flipImage").data("flip-model").isFlipped){
//         $(".front img").attr("src", imageUrls[$(spec).attr("id")]);
//         $(".front img").attr("id", $(spec).attr("id"));
//         $("#flipImage").flip(false);
//     } else {
//         $(".back img").attr("src", imageUrls[$(spec).attr("id")]);
//         $(".back img").attr("id", $(spec).attr("id"));
//         $("#flipImage").flip(true);
//     }
// })

// $(".specialties").on("mouseleave", function(){
//     $(this).removeClass("bolden");
// })

// $(".specialties").on("mouseenter", function(){
//     var spec = this;
//     if ($("#flipImage").data("flip-model").isFlipped){
        
//         $("#flipImage").flip(false);
//     } else {
        
//         $("#flipImage").flip(true);
//     }
// })