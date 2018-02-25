// # INIT
document.addEventListener("DOMContentLoaded",function(){
        //resources
        resPointer = document.getElementById("resPointer");
        resBackground = document.getElementById("resBackground");
        resBashub = document.getElementById("resBashub");
        resBashubTrigger = document.getElementById("resBashubTrigger");
    //init
    myCanvas = document.getElementById("gameCanvas");
    ctx = myCanvas.getContext("2d");
    document.addEventListener("mousemove", mouseMove);
    document.addEventListener("mousedown", mousePush);
    gInterval = setInterval(game, 1000/30);
    
    ctx.mozImageSmoothingEnabled = true;
    ctx.webkitImageSmoothingEnabled = true;
    ctx.msImageSmoothingEnabled = true;
    ctx.imageSmoothingEnabled = true;
});

//coords
ambush = [
{
    x:80,
    y:575
},{
    x:805,
    y:785
},{
    x:1673,
    y:500
}
];

//bashub
bashub = [];
for(var i = 0; i<ambush.length;i++){
    bashub.push({
        x: ambush[i].x,
        y: ambush[i].y-20,
        yv: 0,
        destination: ambush[i].y - 75,
        width: 60,
        height: 85,
        hidden: true,
        show: function(){
            this.hidden = false;
            this.yv = -1;
        },
        hide: function(){
            this.hidden = true;
            this.yv = 1;
        }
    });
}

mx = my = undefined;
// # GAME

game = function(){
    ctx.fillStyle = "#222";
    ctx.fillRect(0,0,myCanvas.width,myCanvas.height); 
    
    for(var i = 0;i<bashub.length;i++){
        
       if(bashub[i].hidden == false && bashub[i].y == bashub[i].destination){
           bashub[i].yv = 0;
       }
       if(bashub[i].hidden == true && bashub[i].y == bashub[i].destination+55){
           bashub[i].yv = 0;
       } 
       if(mx >= bashub[i].x && mx <= bashub[i].x+bashub[i].width){
            if(my >= bashub[i].y && my <= bashub[i].y+bashub[i].height){
                ctx.drawImage(resBashubTrigger,bashub[i].x,bashub[i].y+=bashub[i].yv,bashub[i].width,bashub[i].height);
            }  
        }
        ctx.drawImage(resBashub,bashub[i].x,bashub[i].y+=bashub[i].yv,bashub[i].width,bashub[i].height);
        
    }
    
    ctx.drawImage(resBackground,0,0,myCanvas.width,myCanvas.height);
    ctx.drawImage(resPointer,mx-25,my-25,50,50);
}
// # FUNCTIONS

mouseMove = function(evt){
    mx = evt.clientX;
    my = evt.clientY;
}
mousePush = function(){
    var audioElement = document.getElementById("shotgunSound");
    bashub[1].hide();
    if(audioElement.paused){
        audioElement.play();
        console.log("szczal");
        bashub[1].show();
    }
}