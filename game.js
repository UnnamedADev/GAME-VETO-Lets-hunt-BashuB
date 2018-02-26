// # INIT
document.addEventListener("DOMContentLoaded",function(){
        //resources
        resPointer = document.getElementById("resPointer");
        resBackground = document.getElementById("resBackground");
        resBackgroundTop = document.getElementById("resBackgroundTop");
        resBackgroundBottom = document.getElementById("resBackgroundBottom");
        
        document.getElementById("shotgunSound").volume = 0.3;
        document.getElementById("killSound").volume = 0.4;
        document.getElementById("nightvisionSound").volume = 0.6;
        document.getElementById("backgroundMusic").volume = 0.05;
        document.getElementById("reloadsingle1Sound").volume = 0.3; 
        document.getElementById("reloadendSound").volume = 0.3;    
    
        resBashub = [];
        resBashubTrigger = [];
        resBashubNightvision = [];
    
        resBashub[0] = document.getElementById("resBashub");
        resBashub[1] = document.getElementById("resBashub2");
        resBashubTrigger[0] = document.getElementById("resBashubTrigger");
        resBashubTrigger[1] = document.getElementById("resBashub2Trigger");
        resBashubNightvision[0] = document.getElementById("resBashubNightvision");
        resBashubNightvision[1] = document.getElementById("resBashub2Nightvision");
    //init
    myCanvas = document.getElementById("gameCanvas");
    ctx = myCanvas.getContext("2d");
    document.addEventListener("keydown", keyPush);
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
    modifier: 1.8
},{
    x:1338,
    y:566,
    modifier: 1.6
}
    ,{
    x:1750,
    y:357,
    modifier: 3.5
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
        downborder: ambush[i].y,
        hidden: true,
        model: Math.floor(Math.random()*2),
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
ntvisionState = false;
thvisionState = false;
killtxtcolor = "red";
isreloading = false;
islaser = false;
lasercolor = "rgba(0,255,0,0.7)";
    //usr stats
    huntedBashubs = 0;
    magazine = 8;
    ammunition = magazine;
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
            if(my >= bashub[i].y && my <= bashub[i].y+bashub[i].height && my <= bashub[i].downborder){
                ctx.drawImage(resBashubTrigger[bashub[i].model],bashub[i].x,bashub[i].y,bashub[i].width,bashub[i].height);
            }  
        }
        if(ntvisionState == false && thvisionState == false){
            ctx.drawImage(resBashub[bashub[i].model],bashub[i].x,bashub[i].y+=bashub[i].yv,bashub[i].width,bashub[i].height);
        }
        if(ntvisionState == true || thvisionState == true){
            ctx.drawImage(resBashubNightvision[bashub[i].model],bashub[i].x,bashub[i].y+=bashub[i].yv,bashub[i].width,bashub[i].height);
        }
        
    }
     ctx.drawImage(resBackgroundBottom,0,0,myCanvas.width,myCanvas.height);
    
    //ctx.drawImage(resPointer,mx-25,my-25,50,50);
    
    if(islaser == true){
        for(var k = 0;k<10;k++){
            ctx.beginPath();
            ctx.moveTo(myCanvas.width-myCanvas.width/3+k,myCanvas.height);
            ctx.lineTo(mx,my);
            ctx.lineWidth = 1;
            ctx.strokeStyle = lasercolor;
            ctx.shadowColor = lasercolor;
            ctx.shadowBlur = 20;
            ctx.stroke();
            ctx.closePath();
        }
        ctx.shadowBlur = 0;
    }

    
    if(showkill == true){
        ctx.font = "22px Oswald";
        ctx.fillStyle = killtxtcolor;
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
        if(ammunition == 0){
            console.log("you cant shoot because no ammo");
            document.getElementById("reload").style.display = "block";
            return;
        }
        if(isreloading == true || !document.getElementById("reloadendSound").paused){
            console.log("you cant shoot because reloading now");
            return;
        }
        ammunition--;
        document.getElementById("ammoleft").innerHTML = ammunition;
        audioElement.play();
        
        for(var i = 0;i<bashub.length;i++){
           if(mx >= bashub[i].x && mx <= bashub[i].x+bashub[i].width){

                if(my >= bashub[i].y && my <= bashub[i].y+bashub[i].height && my <= bashub[i].downborder){
                    huntedBashubs++;
                    document.getElementById("guiKilledBashub").innerHTML = huntedBashubs;
                    document.getElementById("guiKilledBashub").style.color = "#fccf53";
                    setTimeout(function(){
                        document.getElementById("guiKilledBashub").style.color = "";
                    },300);
                    document.getElementById("killSound").play();
                    bashub[i].hide(4);
                    
                    showkill = true;
                    setTimeout(function(){
                        showkill = false;
                    },300);
                }  
            }

        }
    }
}
function keyPush(evt){
    console.log(evt.keyCode);
    switch(evt.keyCode){
        case 76:
            // "l"
            switch(islaser){
                case false:
                    islaser = true;
                    break;
                case true:
                    islaser = false;
                    break;
            }
            break;
        case 78:
            // "n"
            ntvision();
            break;
        case 84:
            // "t"
            thvision();
            break;
        case 82:
            // "r"
            if(ammunition != magazine && isreloading == false){
                document.getElementById("reloadbar").style.display = "block";
                isreloading = true;
                document.getElementById("reload").style.display = "none";
                reload();
            }
            break;
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
function ntvision(){
    switch(ntvisionState){
        case false:
            //turn on
            thvisionState = false;
            ntvisionState = true;
            document.getElementById("nightvisionSound").play();
            resBackgroundTop = document.getElementById("resBackgroundTopnightvision");
            resBackgroundBottom = document.getElementById("resBackgroundBottomnightvision");
            myCanvas.style.filter = "brightness(70%) contrast(1.2) invert(0) grayscale(1) sepia(600%) hue-rotate(80deg) saturate(6)";
            document.getElementById("nightvision").style.display = "block";
            killtxtcolor = "white";
            break;
        case true:
            //turn off
            ntvisionState = false;
            resBackgroundTop = document.getElementById("resBackgroundTop");
            resBackgroundBottom = document.getElementById("resBackgroundBottom");
            myCanvas.style.filter = "";
            document.getElementById("nightvision").style.display = "none";
            killtxtcolor = "red";
            break;
    }
}
function thvision(){
    switch(thvisionState){
        case false:
            //turn on
            ntvisionState = false;
            thvisionState = true;
            resBackgroundTop = document.getElementById("resBackgroundTopnightvision");
            resBackgroundBottom = document.getElementById("resBackgroundBottomnightvision");
            myCanvas.style.filter = "brightness(130%) contrast(1.3) invert(0) grayscale(1) saturate(6)";
            document.getElementById("nightvision").style.display = "block";
            killtxtcolor = "white";
            break;
        case true:
            //turn off
            thvisionState = false;
            resBackgroundTop = document.getElementById("resBackgroundTop");
            resBackgroundBottom = document.getElementById("resBackgroundBottom");
            myCanvas.style.filter = "";
            document.getElementById("nightvision").style.display = "none";
            killtxtcolor = "red";
            break;
    }
}
function reload(){
    document.getElementById("reloadsingle1Sound").play();
    ammunition++;
    document.getElementById("ammoleft").innerHTML = ammunition;
    if(ammunition != magazine){
        setTimeout(reload,700);
    }
    if(ammunition == magazine){
        setTimeout(function(){
            document.getElementById("reloadendSound").play();
            document.getElementById("reloadbar").style.display = "none";
            isreloading = false;
        },700);
    }
}