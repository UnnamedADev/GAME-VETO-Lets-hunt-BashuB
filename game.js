// ####################################################
// # GAME #############################################
// ####################################################
function gameblock(){
    // # INIT
        //resources
            resBackground = document.getElementById("resBackground");
            resBackgroundTop = document.getElementById("resBackgroundTop");
            resBackgroundBottom = document.getElementById("resBackgroundBottom");
            
            //audio
            document.getElementById("backgroundMusic").volume = (storageAGAMEMUSIC/100)*(storageAOVERALL/100);
            document.getElementById("backgroundMusic").play();
            
            shotgunSound = new Audio("sounds/shotgun_sound.mp3");
            killSound = new Audio("sounds/kill_sound.mp3");
            nightvisionSound = new Audio("sounds/nightvision_sound.mp3");
            backgroundMusic = new Audio("sounds/background_music.mp3");
            reloadSingleSound = new Audio("sounds/reload_single1.mp3");
            reloadEndSound = new Audio("sounds/reload_end.mp3");
    
            shotgunSound.volume = (storageASOUND/100)*(storageAOVERALL/100);
            killSound.volume = (storageASOUND/100)*(storageAOVERALL/100);
            nightvisionSound.volume = (storageASOUND/100)*(storageAOVERALL/100);
            reloadSingleSound.volume = (storageASOUND/100)*(storageAOVERALL/100);
            reloadEndSound.volume = (storageASOUND/100)*(storageAOVERALL/100);

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
    //shot balls
    shotball = [];
    function Shot(){
        this.ax = 1300;
        this.ay = myCanvas.height;
        this.bx = 1300;
        this.by = myCanvas.height;
        this.dx = mx+Math.floor(Math.random()*50-25);
        this.dy = my+Math.floor(Math.random()*50-25);
        this.frames = 5;
        if(this.bx <= this.dx){
            this.xv = (this.dx-this.bx)/this.frames;
        }
        if(this.bx >= this.dx){
            this.xv = -(this.bx-this.dx)/this.frames;
        }
        this.yv = (this.by-this.dy)/this.frames;
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
    
    roundMode = storagePFROUNDTYPE;
    roundMode = roundMode.slice(0,roundMode.indexOf(" "));
    roundType = storagePFROUNDTYPE;
    roundType = roundType.slice(roundType.indexOf(" ")+1,roundType.length);
    
    speedmodifier = defaultFPS/storageFPS;
        //usr stats
        huntedBashubs = 0;
        
        magazine = 8;
        ammunition = magazine;
    // # GAME
    ai();
    setshots();
    function game(){
        ctx.fillStyle = "#222";
        ctx.fillRect(0,0,myCanvas.width,myCanvas.height); 
        ctx.shadowBlur = 0;
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

        } ctx.drawImage(resBackgroundBottom,0,0,myCanvas.width,myCanvas.height);

        //draw laser
        if(islaser == true){
            for(var k = 0;k<10;k++){
                ctx.beginPath();
                ctx.moveTo(1400+k,myCanvas.height);
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
        

        //draw bullets
        for(var r = 0;r<shotball.length;r++){
            
            if(shotball[r].by >= shotball[r].dy){
                shotball[r].bx += shotball[r].xv;
                shotball[r].by -= shotball[r].yv;
            }
            if(shotball[r].by <= shotball[r].dy){
                shotball[r].by = shotball[r].dy;
                shotball[r].bx = shotball[r].dx;
            }
            
            if(shotball[r].by <= shotball[r].dy && shotball[r].ay >= shotball[r].dy){
                shotball[r].ax += shotball[r].xv;
                shotball[r].ay -= shotball[r].yv;
            }
            
            for(var p = 0;p<5;p++){
                ctx.beginPath();
                ctx.moveTo(shotball[r].ax+p*2, shotball[r].ay);
                ctx.lineTo(shotball[r].bx,shotball[r].by);
                ctx.lineWidth = shotsWidth;
                ctx.strokeStyle = shotsColor;
                ctx.shadowColor = shotsColor;
                ctx.shadowBlur = shotsBlur;
                ctx.stroke();
                ctx.closePath();
            }
            if(shotball[r].ay <= shotball[r].dy){
                shotball[r].ay = shotball[r].dy;
                shotball[r].ax = shotball[r].dx;
                shotball.shift();
            }
        }
        ctx.shadowBlur = 0;


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
        if(shotgunSound.paused){
            if(ammunition == 0){
                //no ammo
                document.getElementById("reload").style.display = "block";
                return;
            }
            if(isreloading == true || !document.getElementById("reloadendSound").paused){
                //reloading
                return;
            }
            storageSTSHOTS++;localStorage.setItem("STSHOTS",storageSTSHOTS);
            ammunition--;
            
            //push balls for shot
            switch(roundMode){
                case "std":
                    for(var i = 0;i<7;i++){
                        shotball.push(new Shot());
                    }
                    break;
                case "single":
                    shotball.push(new Shot());
                    break;
            }
            
            document.getElementById("ammoleft").innerHTML = ammunition;
            shotgunSound.play();

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
                        killSound.play();
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
            case 27:
                alertQuit();
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
    function setshots(){
        
        switch(roundType){
            case "normal":
                shotsColor = "#ffb200";
                shotsWidth = 1;
                shotsBlur = 0;
                break;
            case "marked":
                shotsColor = "#ff4300";
                shotsWidth = 1;
                shotsBlur = 2;
                break;
            case "fire":
                shotsColor = "#ff6a00";
                shotsWidth = 2;
                shotsBlur = 8;
                break;
            case "ap":
                shotsColor = "#ffe45e";
                shotsWidth = 2;
                shotsBlur = 0;
                break;
        }
        if(roundMode == "single"){
            shotsWidth += 2;
        }
    }
    function ntvision(){
        switch(ntvisionState){
            case false:
                //turn on
                shotsColor = "white";
                thvisionState = false;
                ntvisionState = true;
                nightvisionSound.play();
                resBackgroundTop = document.getElementById("resBackgroundTopnightvision");
                resBackgroundBottom = document.getElementById("resBackgroundBottomnightvision");
                myCanvas.style.filter = "brightness(70%) contrast(1.2) invert(0) grayscale(1) sepia(600%) hue-rotate(80deg) saturate(6)";
                document.getElementById("nightvision").style.display = "block";
                killtxtcolor = "white";
                break;
            case true:
                shotsColor = "yellow";
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
                shotsColor = "white";
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
                shotsColor = "yellow";
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
        reloadSingleSound.play();
        ammunition++;
        document.getElementById("ammoleft").innerHTML = ammunition;
        if(ammunition != magazine){
            setTimeout(reload,700);
        }
        if(ammunition == magazine){
            setTimeout(function(){
                storageSTMAGRELOADS++; localStorage.setItem("STMAGRELOADS",storageSTMAGRELOADS);
                reloadEndSound.play();
                document.getElementById("reloadbar").style.display = "none";
                isreloading = false;
            },700);
        }
    }
}
function inGameValuesRefresh(){
    //speed mofidier
    speedmodifier = defaultFPS/storageFPS;
    
    //audio
    document.getElementById("backgroundMusic").volume = (storageAGAMEMUSIC/100)*(storageAOVERALL/100);
    document.getElementById("menuMusic").volume = (storageAMENUMUSIC/100)*(storageAOVERALL/100);
    
    shotgunSound = new Audio("sounds/shotgun_sound.mp3");
    killSound = new Audio("sounds/kill_sound.mp3");
    nightvisionSound = new Audio("sounds/nightvision_sound.mp3");
    backgroundMusic = new Audio("sounds/background_music.mp3");
    reloadSingleSound = new Audio("sounds/reload_single1.mp3");
    reloadEndSound = new Audio("sounds/reload_end.mp3");
    buttonSound = new Audio("sounds/button_sound1.mp3");
    
    shotgunSound.volume = (storageASOUND/100)*(storageAOVERALL/100);
    killSound.volume = (storageASOUND/100)*(storageAOVERALL/100);
    nightvisionSound.volume = (storageASOUND/100)*(storageAOVERALL/100);
    reloadSingleSound.volume = (storageASOUND/100)*(storageAOVERALL/100);
    reloadEndSound.volume = (storageASOUND/100)*(storageAOVERALL/100);
    buttonSound.volume = (storageASOUND/100)*(storageAOVERALL/100);
    
    //rounds
    roundMode = storagePFROUNDTYPE;
    roundMode = roundMode.slice(0,roundMode.indexOf(" "));
    roundType = storagePFROUNDTYPE;
    roundType = roundType.slice(roundType.indexOf(" ")+1,roundType.length);
}
// ####################################################
// # MENU #############################################
// # default and storage values
    storageFPS = parseInt(localStorage.getItem("FPS"));
    storageAOVERALL = parseInt(localStorage.getItem("AOVERALL"));
    storageASOUND = parseInt(localStorage.getItem("ASOUND"));
    storageAGAMEMUSIC = parseInt(localStorage.getItem("AGAMEMUSIC"));
    storageAMENUMUSIC = parseInt(localStorage.getItem("AMENUMUSIC"));
    storageSTKILLED = parseInt(localStorage.getItem("STKILLED"));
    storageSTSHOTS = parseInt(localStorage.getItem("STSHOTS"));
    storageSTMAGRELOADS = parseInt(localStorage.getItem("STMAGRELOADS"));
    storageSTBULLETRELOADS = parseInt(localStorage.getItem("STBULLETRELOADS"));
    storagePFLASERCOLOR = localStorage.getItem("PFLASERCOLOR");
    storagePFROUNDTYPE = localStorage.getItem("PFROUNDTYPE");

    defaultFPS = 60;
    defaultAOVERALL = 50;
    defaultASOUND = 100;
    defaultAGAMEMUSIC = 60;
    defaultAMENUMUSIC = 30;
    defaultSTKILLED = 0;
    defaultSTSHOTS = 0;
    defaultSTMAGRELOADS = 0;
    defaultSTBULLETRELOADS = 0;
    defaultPFLASERCOLOR = "rgba(255, 0, 0, 0.7)";
    defaultPFROUNDTYPE = "std normal";
        //refresh
        function DS_VALUES(){
            storageFPS = parseInt(localStorage.getItem("FPS"));
            storageAOVERALL = parseInt(localStorage.getItem("AOVERALL"));
            storageASOUND = parseInt(localStorage.getItem("ASOUND"));
            storageAGAMEMUSIC = parseInt(localStorage.getItem("AGAMEMUSIC"));
            storageAMENUMUSIC = parseInt(localStorage.getItem("AMENUMUSIC"));
            storageSTKILLED = parseInt(localStorage.getItem("STKILLED"));
            storageSTSHOTS = parseInt(localStorage.getItem("STSHOTS"));
            storageSTMAGRELOADS = parseInt(localStorage.getItem("STMAGRELOADS"));
            storageSTBULLETRELOADS = parseInt(localStorage.getItem("STBULLETRELOADS"));
            storagePFLASERCOLOR = localStorage.getItem("PFLASERCOLOR");
            storagePFROUNDTYPE = localStorage.getItem("PFROUNDTYPE");
            
            inGameValuesRefresh();
        }
// # rest of functions
function initConf(){
    switch(localStorage.getItem("isset")){
        case null:
            localStorage.setItem("FPS",defaultFPS);
            localStorage.setItem("AOVERALL",defaultAOVERALL);
            localStorage.setItem("ASOUND",defaultASOUND);
            localStorage.setItem("AGAMEMUSIC",defaultAGAMEMUSIC);
            localStorage.setItem("AMENUMUSIC",defaultAMENUMUSIC);
            
            localStorage.setItem("STKILLED",defaultSTKILLED);
            localStorage.setItem("STSHOTS",defaultSTSHOTS);
            localStorage.setItem("STMAGRELOADS",defaultSTMAGRELOADS);
            localStorage.setItem("STBULLETRELOADS",defaultSTBULLETRELOADS);
            localStorage.setItem("PFLASERCOLOR",defaultPFLASERCOLOR);
            localStorage.setItem("PFROUNDTYPE", defaultPFROUNDTYPE);
            //confirmation
            localStorage.setItem("isset",1);
            
            DS_VALUES();
            break;
        case "1":
            break;
    }
}
document.addEventListener("DOMContentLoaded",function(){
    buttonSound = new Audio("sounds/button_sound1.mp3");
    buttonSound.volume = (storageASOUND/100)*(storageAOVERALL/100);
        
    document.getElementById("menuMusic").volume = (storageAMENUMUSIC/100)*(storageAOVERALL/100);
    document.getElementById("menuMusic").play();
    
    initConf();
    menuPlay();
    menuFooter();
    alertSounds();
    switchCard();
    settings();
    soldier();
    information();
});
//BLOCKS

function menuPlay(){
    document.getElementById("mainmenu").getElementsByTagName("li")[0].addEventListener("click",function(){
        document.getElementById("menuHolder").style.display = "none";
        document.getElementById("menuMusic").pause();
        gameblock();
    });
    
}
function menuFooter(){
    document.getElementById("mainmenu_mod").innerHTML = document.lastModified;
    
    var ourstr = document.getElementsByTagName("title")[0].innerHTML;
    
    ourstr = ourstr.slice(0,ourstr.indexOf(" -"));
    document.getElementById("mainmenu_ver").innerHTML = ourstr;
}
function alertSounds(){
    var alertwin = document.getElementById("alert");
    var alertbuttons = alertwin.getElementsByTagName("button");
    for(var i = 0;i<alertbuttons.length;i++){
        alertbuttons[i].addEventListener("mouseenter",function(){
            buttonSound.play();
        });
    }
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
        menuitems[i].addEventListener("mouseenter",function(){
            buttonSound.play();
        });
    }
}
function alertResetVideo(){
    var alerth = document.getElementById("alertholder");
    alerth.style.display = "block";
    
    document.getElementById("acontent").innerHTML = "Are you sure you want to restart video settings?";
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
    
    document.getElementById("acontent").innerHTML = "Are you sure you want to restart audio settings?";
    document.getElementById("aok").addEventListener("click",function(){
        alerth.style.display = "none";
        //code if OK
        localStorage.setItem("AOVERALL",defaultAOVERALL);
        localStorage.setItem("ASOUND",defaultASOUND);
        localStorage.setItem("AGAMEMUSIC",defaultAGAMEMUSIC);
        localStorage.setItem("AMENUMUSIC",defaultAMENUMUSIC);
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
    
    document.getElementById("acontent").innerHTML = "Are you sure you want to clear user progress?";
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
function alertQuit(){
    var alerth = document.getElementById("alertholder");
    alerth.style.display = "block";
    
    document.getElementById("acontent").innerHTML = "Do you want exit?";
    document.getElementById("aok").addEventListener("click",function(){
        alerth.style.display = "none";
        //code if OK
        location.reload();
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
    document.getElementById("audiogamemusic").value = storageAGAMEMUSIC;
     document.getElementById("audiomenumusic").value = storageAMENUMUSIC;
    document.getElementById("audiooverall").addEventListener("change",function(){
        localStorage.setItem("AOVERALL",this.value);
        DS_VALUES();
    });
    document.getElementById("audiosound").addEventListener("change",function(){
        localStorage.setItem("ASOUND",this.value);
        DS_VALUES();
    });
    document.getElementById("audiogamemusic").addEventListener("change",function(){
        localStorage.setItem("AGAMEMUSIC",this.value);
        DS_VALUES();
    });
    document.getElementById("audiomenumusic").addEventListener("change",function(){
        localStorage.setItem("AMENUMUSIC",this.value);
        DS_VALUES();
    });
    //statistics
    document.getElementById("statskilled").innerHTML = storageSTKILLED;
    document.getElementById("statsshots").innerHTML = storageSTSHOTS;
    document.getElementById("statsmagreloads").innerHTML = storageSTMAGRELOADS;
    document.getElementById("statsbulletreloads").innerHTML = storageSTBULLETRELOADS;
}
function soldier(){
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
            localStorage.setItem("PFLASERCOLOR",newprop);
            DS_VALUES();
        });
    }
    
    var actualRound = localStorage.getItem("PFROUNDTYPE");
    var roundTile = document.getElementsByClassName("round");
    var roundH = storagePFROUNDTYPE;
    
    for(var j = 0;j<roundTile.length;j++){
        var itemH = roundTile[j].getElementsByTagName("h3")[0].innerHTML;
        if(itemH == roundH){
            roundTile[j].classList.add("activeround");
        }
        
        roundTile[j].addEventListener("click",function(){
            for(var r = 0;r<roundTile.length;r++){
                roundTile[r].classList.remove("activeround");
            }
            this.classList.add("activeround");
            var newRT = this.getElementsByTagName("h3")[0].innerHTML;
            localStorage.setItem("PFROUNDTYPE",newRT);
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