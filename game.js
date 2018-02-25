// # INIT
document.addEventListener("DOMContentLoaded",function(){
        //resources
        resPointer = document.getElementById("resPointer");
        resBackground = document.getElementById("resBackground");
        resBackgroundTop = document.getElementById("resBackgroundTop");
        resBackgroundBottom = document.getElementById("resBackgroundBottom");
        resBashub = document.getElementById("resBashub");
        resBashubTrigger = document.getElementById("resBashubTrigger");
    //init
    myCanvas = document.getElementById("gameCanvas");
    ctx = myCanvas.getContext("2d");
    document.addEventListener("mousemove", mouseMove);
    document.addEventListener("mousedown", mousePush);
    gInterval = setInterval(game, 1000/60);
    
    ctx.mozImageSmoothingEnabled = true;
    ctx.webkitImageSmoothingEnabled = true;
    ctx.msImageSmoothingEnabled = true;
    ctx.imageSmoothingEnabled = true;
});

//coords
ambush = [
{
    x:647,
    y:470,
    modifier: 1.4
},{
    x:961,
    y:510,
    modifier: 1
},{
    x:1053,
    y:572,
    modifier: 1.2
},{
    x:1205,
    y:567,
    modifier: 1.6
},{
    x:1338,
    y:566,
    modifier: 1.8
}
    ,{
    x:1750,
    y:357,
    modifier: 3
}
];

//bashub
bashub = [];
for(var i = 0; i<ambush.length;i++){
    bashub.push({
        x: ambush[i].x,
        y: ambush[i].y,
        yv: 0,
        width: 30 * ambush[i].modifier,
        height: 43 * ambush[i].modifier,
        destination: ambush[i].y - 43 * ambush[i].modifier,
        hidden: true,
        show: function(istemp){
            if(istemp == true){
                var obj = this;
                setTimeout(function(){
                    obj.hide();
                },2000+Math.floor(Math.random()*4000))
            }
            this.hidden = false;
            this.yv = -1;
        },
        hide: function(optspeed){
            
            this.hidden = true;
            if(optspeed == undefined){
                this.yv = 1;
            } else{
                this.yv = optspeed;
            }
        }
    });
}
hbashub = [];
// conf
mx = my = undefined;
showkill = false;
    //usr stats
    huntedBashubs = 0;
// # GAME
ai();
game = function(){
    ctx.fillStyle = "#222";
    ctx.fillRect(0,0,myCanvas.width,myCanvas.height); 
    
    ctx.drawImage(resBackgroundTop,0,0,myCanvas.width,myCanvas.height);
    
    for(var i = 0;i<bashub.length;i++){
        
       if(bashub[i].hidden == false && bashub[i].y <= bashub[i].destination){
           bashub[i].yv = 0;
       }
       if(bashub[i].hidden == true && bashub[i].y >= bashub[i].destination+bashub[i].height){
           bashub[i].yv = 0;
       } 
       if(mx >= bashub[i].x && mx <= bashub[i].x+bashub[i].width){
            if(my >= bashub[i].y && my <= bashub[i].y+bashub[i].height){
                ctx.drawImage(resBashubTrigger,bashub[i].x,bashub[i].y,bashub[i].width,bashub[i].height);
            }  
        }
        ctx.drawImage(resBashub,bashub[i].x,bashub[i].y+=bashub[i].yv,bashub[i].width,bashub[i].height);
        
    }
    
    ctx.drawImage(resBackgroundBottom,0,0,myCanvas.width,myCanvas.height);
    ctx.drawImage(resPointer,mx-25,my-25,50,50);
    
    if(showkill == true){
        ctx.font = "22px Oswald";
        ctx.fillStyle = "red";
        ctx.fillText("KILLED!",mx+30,my);
    }
}
// # FUNCTIONS

function mouseMove(evt){
    mx = evt.clientX;
    my = evt.clientY;
}
function mousePush(){
    var audioElement = document.getElementById("shotgunSound");

    if(audioElement.paused){
        audioElement.play();
        
        for(var i = 0;i<bashub.length;i++){
           if(mx >= bashub[i].x && mx <= bashub[i].x+bashub[i].width){
                if(my >= bashub[i].y && my <= bashub[i].y+bashub[i].height){
                    huntedBashubs++;
                    document.getElementById("guiKilledBashub").innerHTML = huntedBashubs;
                    
                    myCanvas.style.filter = "brightness(110%)";
                    document.getElementById("guiKilledBashub").style.color = "#fccf53";
                    setTimeout(function(){
                        myCanvas.style.filter = "";
                        document.getElementById("guiKilledBashub").style.color = "";
                    },300);
                    
                    document.getElementById("killSound").play();
                    bashub[i].hide(4);
                    
                    showkill = true;
                    setTimeout(function(){
                        showkill = false;
                    },300)
                }  
            }

        }
    }
}

function ai(){
    for(var i = 0;i<bashub.length;i++){
        if(bashub[i].hidden == true){
            hbashub.push(bashub[i]);
        }
    }
    hbashub[Math.floor(Math.random() * hbashub.length)].show(true);
    setTimeout(ai,1000+Math.floor(Math.random()*2500));
    
}