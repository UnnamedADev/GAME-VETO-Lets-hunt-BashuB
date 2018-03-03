
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
    storagePFFLASHLIGHTCOLOR = localStorage.getItem("PFFLASHLIGHTCOLOR");
    storagePFMAP = parseInt(localStorage.getItem("PFMAP"));
    
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
    defaultPFFLASHLIGHTCOLOR = "rgba(255, 255, 255, 0.25)";
    defaultPFMAP = 0;
    defaultUSERNICKNAME = "nickname";
    defaultUSERDESCRIPTION = "player description";
    defaultUSERAV = "textures/avatar1.png";
    
    //map
        

    document.addEventListener("DOMContentLoaded",function(){
        pgmap = [
        {
            displayname: "Zavod 311",
            restop: document.getElementById("bckg1top"),
            resbottom: document.getElementById("bckg1bottom"),
            restopNT: document.getElementById("bckg1topnt"),
            resbottomNT: document.getElementById("bckg1bottomnt"),
            x: [647,961,1053,1205,1338,1750],
            y: [470,510,572,567,566,357],
            modifier: [1.4,1,1.2,1.8,1.6,3.5]
        },{
            displayname: "Hangar 21",
            restop: document.getElementById("bckg2top"),
            resbottom: document.getElementById("bckg2bottom"),
            restopNT: document.getElementById("bckg2topnt"),
            resbottomNT: document.getElementById("bckg2bottomnt"),
            x: [110,428,561,989,1223,1312,1408,1529,1702],
            y: [503,365,371,569,396,496,409,503,506],
            modifier: [2,1.4,1.4,3,1.2,1.1,1,1.5,1.8]
        }
        ];
        
        initConf();
    });


// ####################################################
// # GAME #############################################
// ####################################################
function gameblock(){
    // # INIT
        
        //resources
            
            //audio
            backgroundMusic = document.getElementById("backgroundMusic");
            menuMusic = document.getElementById("menuMusic");
            shotgunSound = document.getElementById("shotgunSound");
            killSound = document.getElementById("killSound");
            nightvisionSound = document.getElementById("nightvisionSound");
            reloadSingleSound = document.getElementById("reloadSingleSound");
            reloadEndSound = document.getElementById("reloadEndSound");
            
            backgroundMusic.volume = (storageAGAMEMUSIC/100)*(storageAOVERALL/100);
            backgroundMusic.play();
            
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
    
    //bashub
    bashub = [];
    for(var i = 0; i<pgmap[storagePFMAP].x.length;i++){
        bashub.push({
            x: pgmap[storagePFMAP].x[i],
            y: pgmap[storagePFMAP].y[i],
            yv: 0,
            width: 30 * pgmap[storagePFMAP].modifier[i],
            height: 43 * pgmap[storagePFMAP].modifier[i],
            destination: pgmap[storagePFMAP].y[i] - 43 * pgmap[storagePFMAP].modifier[i],
            downborder: pgmap[storagePFMAP].y[i],
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
    function Shot(issingle){
        this.ax = 1300;
        this.ay = myCanvas.height;
        this.bx = 1300;
        this.by = myCanvas.height;
        
        switch(issingle){
            case true:
                this.dx = mx;
                this.dy = my;
                break;
            case undefined:
                this.dx = mx+Math.floor(Math.random()*50-25);
                this.dy = my+Math.floor(Math.random()*50-25);
                break;
        }
        
        
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
    flashlightState = false;
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
        
       //backgorund top
        if(ntvisionState == true || thvisionState == true){
            ctx.drawImage(pgmap[storagePFMAP].restopNT,0,0,myCanvas.width,myCanvas.height);
        }
        if(ntvisionState == false && thvisionState == false){
            ctx.drawImage(pgmap[storagePFMAP].restop,0,0,myCanvas.width,myCanvas.height);
        }

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
        //background bottom
        if(ntvisionState == true || thvisionState == true){
            ctx.drawImage(pgmap[storagePFMAP].resbottomNT,0,0,myCanvas.width,myCanvas.height);
        }
        if(ntvisionState == false && thvisionState == false){
            ctx.drawImage(pgmap[storagePFMAP].resbottom,0,0,myCanvas.width,myCanvas.height);
        }

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
            if(shotball[r].by-shotball[r].yv <= shotball[r].dy){
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
            if(shotball[r].ay-shotball[r].yv <= shotball[r].dy){
                shotball[r].ay = shotball[r].dy;
                shotball[r].ax = shotball[r].dx;
                
                for(var l = 0;l<bashub.length;l++){
                    if(shotball[r].dx <= bashub[l].x+bashub[l].width && shotball[r].dx >= bashub[l].x){
                        if(shotball[r].dy >= bashub[l].y && shotball[r].dy <= bashub[l].y+bashub[l].height && shotball[r].dy <= bashub[l].downborder){
                            if(bashub[l].hidden == false){
                                huntedBashubs++;
                               storageSTKILLED++; localStorage.setItem("STKILLED",storageSTKILLED);
                                document.getElementById("guiKilledBashub").innerHTML = huntedBashubs;
                                document.getElementById("guiKilledBashub").style.color = "#fccf53";
                                setTimeout(function(){
                                    document.getElementById("guiKilledBashub").style.color = "";
                                },300);
                                killSound.play();
                                bashub[l].hide(4);

                                showkill = true;
                                setTimeout(function(){
                                    showkill = false;
                                },300);
                            }
                        }
                    }
                }
                shotball.shift();
            }
        }
        ctx.shadowBlur = 0;
        
        if(flashlightState == true){
            ctx.beginPath();
            ctx.filter = "blur(50px)";
            if(ntvisionState == false && thvisionState == false){
                ctx.fillStyle = storagePFFLASHLIGHTCOLOR;
                ctx.strokeStyle = storagePFFLASHLIGHTCOLOR;
            }
            if(ntvisionState == true || thvisionState == true){
                ctx.fillStyle = "rgba(255,255,255,0.7)";
                ctx.strokeStyle = "rgba(255,255,255,0.7)";
            }
            ctx.arc(mx,my,150,0,2*Math.PI,false);
            ctx.fill();
            ctx.filter = "blur(10px)";
            ctx.stroke();
            ctx.closePath();
        }
        ctx.filter = "blur(0px)";
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
        document.addEventListener("mousedown", mousePush);
    });
}
    function mousePush(){
        if(shotgunSound.paused){
            if(ammunition == 0){
                //no ammo
                document.getElementById("reload").style.display = "block";
                return;
            }
            if(isreloading == true || !reloadEndSound.paused){
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
                    shotball.push(new Shot(true));
                    break;
            }
            
            document.getElementById("ammoleft").innerHTML = ammunition;
            shotgunSound.play();

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
            case 70:
                // "f"
                flashlight();
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
                document.removeEventListener("mousedown",mousePush);
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
    function flashlight(){
        switch(flashlightState){
            case false:
                //turn on
                flashlightState = true;
                break;
            case true:
                //trun off
                flashlightState = false;
                break;
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
                myCanvas.style.filter = "brightness(70%) contrast(1.2) invert(0) grayscale(1) sepia(600%) hue-rotate(80deg) saturate(6)";
                document.getElementById("nightvision").style.display = "block";
                killtxtcolor = "white";
                break;
            case true:
                shotsColor = "yellow";
                //turn off
                ntvisionState = false;
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
                myCanvas.style.filter = "brightness(130%) contrast(1.3) invert(0) grayscale(1) saturate(6)";
                document.getElementById("nightvision").style.display = "block";
                killtxtcolor = "white";
                break;
            case true:
                //turn off
                shotsColor = "yellow";
                thvisionState = false;
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
    
    
    backgroundMusic = document.getElementById("backgroundMusic");
    menuMusic = document.getElementById("menuMusic");
    shotgunSound = document.getElementById("shotgunSound");
    killSound = document.getElementById("killSound");
    nightvisionSound = document.getElementById("nightvisionSound");
    reloadSingleSound = document.getElementById("reloadSingleSound");
    reloadEndSound = document.getElementById("reloadEndSound");
    
    backgroundMusic.volume = (storageAGAMEMUSIC/100)*(storageAOVERALL/100);
    menuMusic.volume = (storageAMENUMUSIC/100)*(storageAOVERALL/100);
    
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
            storagePFMAP = parseInt(localStorage.getItem("PFMAP"));
            storagePFFLASHLIGHTCOLOR = localStorage.getItem("PFFLASHLIGHTCOLOR");
            
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
            localStorage.setItem("PFFLASHLIGHTCOLOR",defaultPFFLASHLIGHTCOLOR);
            localStorage.setItem("PFMAP",defaultPFMAP);
            localStorage.setItem("USERNICKNAME",defaultUSERNICKNAME);
            localStorage.setItem("USERDESCRIPTION",defaultUSERDESCRIPTION);
            localStorage.setItem("USERAV",defaultUSERAV);
            //confirmation
            localStorage.setItem("isset",1);
            
            DS_VALUES();
            break;
        case "1":
            break;
    }
}
document.addEventListener("DOMContentLoaded",function(){
    buttonSound = document.getElementById("buttonSound");
    buttonSound.volume = (storageASOUND/100)*(storageAOVERALL/100);
    
    menuMusic.volume = (storageAMENUMUSIC/100)*(storageAOVERALL/100);
    menuMusic.play();

    menuPlay();
    menuFooter();
    alertSounds();
    switchCard();
    settings();
    soldier();
    maps();
    profile();
    information();
});
//BLOCKS

function menuPlay(){
    document.getElementById("mainmenu").getElementsByTagName("li")[0].addEventListener("click",function(){
        document.getElementById("menuHolder").style.display = "none";
        menuMusic.pause();
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
        console.log(this.value);
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
    
    //flashlight
    var actualFls = localStorage.getItem("PFFLASHLIGHTCOLOR");
    var flsTile = document.getElementsByClassName("flashlight");
    
    for(var r = 0;r<flsTile.length;r++){
        
        var tile = flsTile[r].getElementsByClassName("flashcolor")[0];
        var tilecolor = window.getComputedStyle(tile,null).getPropertyValue("background-color");
        tilecolor = tilecolor.slice(0,tilecolor.indexOf("0.9"));
        tilecolor += "0.25)";
        if(tilecolor == storagePFFLASHLIGHTCOLOR){
            flsTile[r].classList.add("activeflashlight");
        }
        
        flsTile[r].addEventListener("click",function(){
            
            for(var p = 0;p<flsTile.length;p++){
            flsTile[p].classList.remove("activeflashlight");
                
            }
            this.classList.add("activeflashlight");
            var newobj = this.getElementsByClassName("flashcolor")[0];
            var newcolor = window.getComputedStyle(newobj,null).getPropertyValue("background-color");
            newcolor = newcolor.slice(0,newcolor.indexOf("0.9"));
            newcolor += "0.25)";
            localStorage.setItem("PFFLASHLIGHTCOLOR",newcolor);
            DS_VALUES();
        });
    }
    
}
function maps(){
    var actualMap = localStorage.getItem("PFMAP");
    var mapTile = document.getElementsByClassName("map");
    var mapH = pgmap[storagePFMAP].displayname;
    
    for(var r = 0;r<mapTile.length;r++){
        
        if(mapTile[r].getElementsByTagName("h3")[0].innerHTML == mapH){
            mapTile[r].classList.add("activemap");
        }
        
        mapTile[r].addEventListener("click",function(){
            for(var p =0;p<mapTile.length;p++){
                mapTile[p].classList.remove("activemap");
            }
            this.classList.add("activemap");
            var newtitle = this.getElementsByTagName("h3")[0].innerHTML;
            for(var k = 0;k<pgmap.length;k++){
                if(newtitle == pgmap[k].displayname){
                    localStorage.setItem("PFMAP",k);
                    DS_VALUES();
                }
            }
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
function profile(){
    refreshProfile();
    //img before
    document.getElementById("profav").addEventListener("mouseenter",function(){
        document.getElementById("imgbefore").style.display = "block";
    });
    document.getElementById("profav").addEventListener("mouseleave",function(){
        document.getElementById("imgbefore").style.display = "none";
    });
   
   //click events
   document.getElementById("profav").addEventListener("click",function(){
       document.getElementById("avholder").style.display = "block";
   }); document.getElementById("profnick").addEventListener("click",function(){
        document.getElementById("nickholder").style.display = "block";
    });
    document.getElementById("profdesc").addEventListener("click",function(){
        document.getElementById("descholder").style.display = "block";
    });
    
    //nickholder handle
   var nickholder = document.getElementById("nickholder");
    var nickinput = document.getElementById("nickinput");
    nickinput.addEventListener("change",function(){
        var val = this.value;
        if(val.length >= 4){
            document.getElementById("nickmorethan4").style.borderColor = "#1b9907";
        }
        if(val.length < 4){
            document.getElementById("nickmorethan4").style.borderColor = "#990606";
        }
        if(val.length <= 16){
            document.getElementById("nicklessthan16").style.borderColor = "#1b9907";
        }
        if(val.length > 16){
            document.getElementById("nicklessthan16").style.borderColor = "#990606";
        }
    });
    nickinput.addEventListener("input",function(){
        document.getElementById("nickused").innerHTML = this.value.length;
    });
    document.getElementById("nickok").addEventListener("click",function(){
        //okey
        var nickvalue = nickinput.value;
        if(nickvalue.length >= 4 && nickvalue.length <= 16){
            localStorage.setItem("USERNICKNAME",nickvalue);
            refreshProfile();
            nickholder.style.display = "none";
            nickinput.value = "";
        }
        
    });
    document.getElementById("nickcancel").addEventListener("click",function(){
        //cancel
        nickholder.style.display = "none";
        nickinput.value = "";
    });
    
    //descholder handle
    var descholder = document.getElementById("descholder");
    var descinput = document.getElementById("descinput");
    descinput.addEventListener("change",function(){
        var val = this.value;
        if(val.length <= 300){
            document.getElementById("desclessthan300").style.borderColor = "#1b9907";
        }
        if(val.length > 300){
            document.getElementById("desclessthan300").style.borderColor = "#990606";
        }
    });
    descinput.addEventListener("input",function(){
        document.getElementById("descused").innerHTML = this.value.length;
    });
    document.getElementById("descok").addEventListener("click",function(){
        //okey
        var descvalue = descinput.value;
        if(descvalue.length <= 300){
            localStorage.setItem("USERDESCRIPTION",descvalue);
            refreshProfile();
            descholder.style.display = "none";
            descinput.value = "";
        }
        
    });
    document.getElementById("desccancel").addEventListener("click",function(){
        //cancel
        descholder.style.display = "none";
        descinput.value = "";
    });
    //avholder handle
    var avholder = document.getElementById("avholder");
    var avinput = document.getElementById("avinput");
    
   avinput.addEventListener("change",function(){
       var val = this.value;
       if(val.indexOf("http://") != -1 || val.indexOf("https://") != -1){
           document.getElementById("avisvalid").style.borderColor = "#1b9907";
       }
       if(val.indexOf("http://") == -1 && val.indexOf("https://") == -1){
           document.getElementById("avisvalid").style.borderColor = "#990606";
       }
   });
   document.getElementById("avok").addEventListener("click",function(){
        //ok
       var val = avinput.value;
       if(val.indexOf("http://") != -1 || val.indexOf("https://") != -1){
           localStorage.setItem("USERAV",avinput.value);
            refreshProfile();
            avholder.style.display = "none";
            avinput.value = "";
       }
        
    });
    document.getElementById("avcancel").addEventListener("click",function(){
        //cancel
        avholder.style.display = "none";
    });
}
function refreshProfile(){
    document.getElementById("profnick").innerHTML = localStorage.getItem("USERNICKNAME");
    document.getElementById("profdesc").innerHTML = localStorage.getItem("USERDESCRIPTION");
    document.getElementById("profav").setAttribute("src",localStorage.getItem("USERAV"));
}