// ####################################################
// # GAME #############################################
// ####################################################
//localStorage.setItem("isset",0);
function gameblock(){
    // # INIT
        //resources
            resBackground = document.getElementById("resBackground");
            resBackgroundTop = document.getElementById("resBackgroundTop");
            resBackgroundBottom = document.getElementById("resBackgroundBottom");
            
            //audio
            document.getElementById("shotgunSound").volume = (storageASOUND/100)*(storageAOVERALL/100);
            document.getElementById("killSound").volume = (storageASOUND/100)*(storageAOVERALL/100);
            document.getElementById("nightvisionSound").volume = (storageASOUND/100)*(storageAOVERALL/100);
            document.getElementById("backgroundMusic").volume = (storageAMUSIC/100)*(storageAOVERALL/100);
            document.getElementById("backgroundMusic").play();
            document.getElementById("reloadsingle1Sound").volume = (storageASOUND/100)*(storageAOVERALL/100); 
            document.getElementById("reloadendSound").volume = (storageASOUND/100)*(storageAOVERALL/100);    
            //textures
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
        document.getElementById("gui").style.display = "block";
        myCanvas = document.getElementById("gameCanvas");
        ctx = myCanvas.getContext("2d");
        document.addEventListener("keydown", keyPush);
        document.addEventListener("mousemove", mouseMove);
        document.addEventListener("mousedown", mousePush);
        gInterval = setInterval(game, 1000/storageFPS);

        ctx.mozImageSmoothingEnabled = true;
        ctx.webkitImageSmoothingEnabled = true;
        ctx.msImageSmoothingEnabled = true;
        ctx.imageSmoothingEnabled = true;
    

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
    
    speedmodifier = defaultFPS/storageFPS;
        //usr stats
        huntedBashubs = 0;
        
        magazine = 8;
        ammunition = magazine;
    // # GAME
    ai();
    function game(){
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
                ctx.drawImage(resBashub[bashub[i].model],bashub[i].x,bashub[i].y+=bashub[i].yv*speedmodifier,bashub[i].width,bashub[i].height);
            }
            if(ntvisionState == true || thvisionState == true){
                ctx.drawImage(resBashubNightvision[bashub[i].model],bashub[i].x,bashub[i].y+=bashub[i].yv*speedmodifier,bashub[i].width,bashub[i].height);
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
                ctx.strokeStyle = storagePFLASERCOLOR;
                ctx.shadowColor = storagePFLASERCOLOR;
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
            storageSTSHOTS++;localStorage.setItem("STSHOTS",storageSTSHOTS);
            ammunition--;
            document.getElementById("ammoleft").innerHTML = ammunition;
            audioElement.play();

            for(var i = 0;i<bashub.length;i++){
               if(mx >= bashub[i].x && mx <= bashub[i].x+bashub[i].width){

                    if(my >= bashub[i].y && my <= bashub[i].y+bashub[i].height && my <= bashub[i].downborder){
                        huntedBashubs++;
                       storageSTKILLED++; localStorage.setItem("STKILLED",storageSTKILLED);
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
        storageSTBULLETRELOADS++; localStorage.setItem("STBULLETRELOADS",storageSTBULLETRELOADS);
        document.getElementById("reloadsingle1Sound").play();
        ammunition++;
        document.getElementById("ammoleft").innerHTML = ammunition;
        if(ammunition != magazine){
            setTimeout(reload,700);
        }
        if(ammunition == magazine){
            setTimeout(function(){
                storageSTMAGRELOADS++; localStorage.setItem("STMAGRELOADS",storageSTMAGRELOADS);
                document.getElementById("reloadendSound").play();
                document.getElementById("reloadbar").style.display = "none";
                isreloading = false;
            },700);
        }
    }
}
function inGameValuesRefresh(){
    speedmodifier = defaultFPS/storageFPS;
    document.getElementById("shotgunSound").volume = (storageASOUND/100)*(storageAOVERALL/100);
    document.getElementById("killSound").volume = (storageASOUND/100)*(storageAOVERALL/100);
    document.getElementById("nightvisionSound").volume = (storageASOUND/100)*(storageAOVERALL/100);
    document.getElementById("backgroundMusic").volume = (storageAMUSIC/100)*(storageAOVERALL/100);
    document.getElementById("reloadsingle1Sound").volume = (storageASOUND/100)*(storageAOVERALL/100); 
    document.getElementById("reloadendSound").volume = (storageASOUND/100)*(storageAOVERALL/100);  
}
// ####################################################
// # MENU #############################################
// # default and storage values
    storageFPS = parseInt(localStorage.getItem("FPS"));
    storageAOVERALL = parseInt(localStorage.getItem("AOVERALL"));
    storageASOUND = parseInt(localStorage.getItem("ASOUND"));
    storageAMUSIC = parseInt(localStorage.getItem("AMUSIC"));
    storageSTKILLED = parseInt(localStorage.getItem("STKILLED"));
    storageSTSHOTS = parseInt(localStorage.getItem("STSHOTS"));
    storageSTMAGRELOADS = parseInt(localStorage.getItem("STMAGRELOADS"));
    storageSTBULLETRELOADS = parseInt(localStorage.getItem("STBULLETRELOADS"));
    storagePFLASERCOLOR = localStorage.getItem("PFLASERCOLOR");

    defaultFPS = 60;
    defaultAOVERALL = 50;
    defaultASOUND = 100;
    defaultAMUSIC = 60;
    defaultSTKILLED = 0;
    defaultSTSHOTS = 0;
    defaultSTMAGRELOADS = 0;
    defaultSTBULLETRELOADS = 0;
    defaultPFLASERCOLOR = "rgba(255, 0, 0, 0.7)";
        //refresh
        function DS_VALUES(){
            storageFPS = parseInt(localStorage.getItem("FPS"));
            storageAOVERALL = parseInt(localStorage.getItem("AOVERALL"));
            storageASOUND = parseInt(localStorage.getItem("ASOUND"));
            storageAMUSIC = parseInt(localStorage.getItem("AMUSIC"));
            storageSTKILLED = parseInt(localStorage.getItem("STKILLED"));
            storageSTSHOTS = parseInt(localStorage.getItem("STSHOTS"));
            storageSTMAGRELOADS = parseInt(localStorage.getItem("STMAGRELOADS"));
            storageSTBULLETRELOADS = parseInt(localStorage.getItem("STBULLETRELOADS"));
            storagePFLASERCOLOR = localStorage.getItem("PFLASERCOLOR");
            
            inGameValuesRefresh();
        }
// # rest of functions
function initConf(){
    switch(parseInt(localStorage.getItem("isset"))){
        case 0:
            localStorage.setItem("FPS",defaultFPS);
            localStorage.setItem("AOVERALL",defaultAOVERALL);
            localStorage.setItem("ASOUND",defaultASOUND);
            localStorage.setItem("AMUSIC",defaultAMUSIC);
            
            localStorage.setItem("STKILLED",defaultSTKILLED);
            localStorage.setItem("STSHOTS",defaultSTSHOTS);
            localStorage.setItem("STMAGRELOADS",defaultSTMAGRELOADS);
            localStorage.setItem("STBULLETRELOADS",defaultSTBULLETRELOADS);
            localStorage.setItem("PFLASERCOLOR",defaultPFLASERCOLOR);
            //confirmation
            localStorage.setItem("isset",1);
            
            DS_VALUES();
            break;
        case 1:
            break;
    }
}
document.addEventListener("DOMContentLoaded",function(){
    initConf();
    menuPlay();
    menuFooter();
    switchCard();
    settings();
    profile();
    information();
});
//BLOCKS

function menuPlay(){
    document.getElementById("mainmenu").getElementsByTagName("li")[0].addEventListener("click",function(){
        document.getElementById("menuHolder").style.display = "none";
        gameblock();
    });
    
}
function menuFooter(){
    document.getElementById("mainmenu_mod").innerHTML = document.lastModified;
    
    var ourstr = document.getElementsByTagName("title")[0].innerHTML;
    
    ourstr = ourstr.slice(0,ourstr.indexOf(" -"));
    document.getElementById("mainmenu_ver").innerHTML = ourstr;
}
function switchCard(){
    var menu = document.getElementById("mainmenu");
    var menuitems = menu.getElementsByTagName("li");
    
    for(var i = 0;i<menuitems.length;i++){
        menuitems[i].addEventListener("click",function(){
            
            for(var j = 0;j<menuitems.length;j++){
                menuitems[j].classList.remove("activeitem");
            }
            this.classList.add("activeitem");
            
            var card = document.getElementsByClassName("card");
            for(var k = 0;k<card.length;k++){
                card[k].style.display = "none";
            }
            if(this.innerHTML != "play"){
                document.getElementById(this.innerHTML).style.display = "block";
            }
        });
    }
}
function alertResetVideo(){
    var alerth = document.getElementById("alertholder");
    alerth.style.display = "block";
    
    document.getElementById("acontent").innerHTML = "Chcesz na pewno zresetowac video?";
    document.getElementById("aok").addEventListener("click",function(){
        alerth.style.display = "none";
        //code if OK
        localStorage.setItem("FPS",defaultFPS);
        DS_VALUES();
        settings();
    });
    document.getElementById("acancel").addEventListener("click",function(){
        alerth.style.display = "none";
        //code if CANCEL
    });
}
function alertResetAudio(){
    var alerth = document.getElementById("alertholder");
    alerth.style.display = "block";
    
    document.getElementById("acontent").innerHTML = "Chcesz na pewno zresetowac video?";
    document.getElementById("aok").addEventListener("click",function(){
        alerth.style.display = "none";
        //code if OK
        localStorage.setItem("AOVERALL",defaultAOVERALL);
        localStorage.setItem("ASOUND",defaultASOUND);
        localStorage.setItem("AMUSIC",defaultAMUSIC);
        DS_VALUES();
        settings();
    });
    document.getElementById("acancel").addEventListener("click",function(){
        alerth.style.display = "none";
        //code if CANCEL
    });
}
function alertResetSaves(){
    var alerth = document.getElementById("alertholder");
    alerth.style.display = "block";
    
    document.getElementById("acontent").innerHTML = "Chcesz na pewno zresetowac video?";
    document.getElementById("aok").addEventListener("click",function(){
        alerth.style.display = "none";
        //code if OK
        localStorage.setItem("STKILLED",defaultSTKILLED);
        localStorage.setItem("STSHOTS",defaultSTSHOTS);
        localStorage.setItem("STMAGRELOADS",defaultSTMAGRELOADS);
        localStorage.setItem("STBULLETRELOADS",defaultSTBULLETRELOADS);
        DS_VALUES();
        settings();
    });
    document.getElementById("acancel").addEventListener("click",function(){
        alerth.style.display = "none";
        //code if CANCEL
    });
}

function settings(){
    //restore buttons events
    var restore = document.getElementById("settings").getElementsByTagName("button");
    for(var i = 0;i<restore.length;i++){
        switch(i){
            case 0:
                restore[i].addEventListener("click",alertResetVideo);
                break;
            case 1:
                restore[i].addEventListener("click",alertResetAudio);
                break;
            case 2:
                restore[i].addEventListener("click",alertResetSaves);
                break;
        }
    }
    //video settings
    var fps = [10,20,30,40,50,60,70,80,90,100,110,120];
    document.getElementById("sttgsFPS").innerHTML = storageFPS+" fps";
   var fpscount = fps.findIndex(function(element){return element== storageFPS});
       document.getElementById("sttgsFPS").addEventListener("click",function(){
        console.log(fps[0]);
        fpscount++;
        if(fpscount >= fps.length){
            fpscount = 0;
        }
        
        document.getElementById("sttgsFPS").innerHTML = fps[fpscount]+" fps";
        localStorage.setItem("FPS",fps[fpscount]);
        DS_VALUES();
    });
    //audio settings
    document.getElementById("audiooverall").value = storageAOVERALL;
    document.getElementById("audiosound").value = storageASOUND;
    document.getElementById("audiomusic").value = storageAMUSIC;
    
    document.getElementById("audiooverall").addEventListener("change",function(){
        localStorage.setItem("AOVERALL",this.value);
        DS_VALUES();
    });
    document.getElementById("audiosound").addEventListener("change",function(){
        localStorage.setItem("ASOUND",this.value);
        DS_VALUES();
    });
    document.getElementById("audiomusic").addEventListener("change",function(){
        localStorage.setItem("AMUSIC",this.value);
        DS_VALUES();
    });
    //statistics
    document.getElementById("statskilled").innerHTML = storageSTKILLED;
    document.getElementById("statsshots").innerHTML = storageSTSHOTS;
    document.getElementById("statsmagreloads").innerHTML = storageSTMAGRELOADS;
    document.getElementById("statsbulletreloads").innerHTML = storageSTBULLETRELOADS;
}
function profile(){
    var laserTile = document.getElementsByClassName("laser");
    
    for(var i = 0;i<laserTile.length;i++){
        
        var colorTile = laserTile[i].getElementsByTagName("div")[0];
        var prop = window.getComputedStyle(colorTile,null).getPropertyValue("background-color");
        if(prop == storagePFLASERCOLOR){
            laserTile[i].classList.add("activelaser");
        }
        
        laserTile[i].addEventListener("click",function(){
            for(var k = 0;k<laserTile.length;k++){
                laserTile[k].classList.remove("activelaser");
            }
            this.classList.add("activelaser");
            var newprop = window.getComputedStyle(this.getElementsByTagName("div")[0],null).getPropertyValue("background-color");
            console.log(newprop);
            localStorage.setItem("PFLASERCOLOR",newprop);
            DS_VALUES();
        });
    }
}
function information(){
    
    var mt = document.getElementsByTagName("meta");
    for(var i = 0; i<mt.length;i++){

        switch(mt[i].getAttribute("name")){
            case "developer":
                document.getElementById("info_developer").innerHTML = mt[i].getAttribute("content");
               break;
            case "designer":
                document.getElementById("info_designer").innerHTML = mt[i].getAttribute("content");
               break;
            case "graphic":
                document.getElementById("info_graphic").innerHTML = mt[i].getAttribute("content");
               break;
        }
    }
    
    document.getElementById("info_modified").innerHTML = document.lastModified;
    var ourstr = document.getElementsByTagName("title")[0].innerHTML;
    ourstr = ourstr.slice(0,ourstr.indexOf(" -"));
    document.getElementById("info_version").innerHTML = ourstr;
    
    
}