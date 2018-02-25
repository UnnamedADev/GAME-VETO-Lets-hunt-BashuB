// # INIT
document.addEventListener("DOMContentLoaded",function(){
        //resources
        resPointer = document.getElementById("resPointer");
    //init
    myCanvas = document.getElementById("gameCanvas");
    ctx = myCanvas.getContext("2d");
    document.addEventListener("keydown", keyPush);
    document.addEventListener("keyup", keyRelease);
    document.addEventListener("mousemove", mouseMove);
    document.addEventListener("mousedown", mousePush);
    gInterval = setInterval(game, 1000/30);
});
//coords
mx = my = undefined;
// # GAME
game = function(){
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,myCanvas.width,myCanvas.height);
    
    ctx.drawImage(resPointer,mx-25,my-25,50,50);
}
// # FUNCTIONS
keyPush = function(evt){
    switch(evt.keyCode){
        case 27:
            console.log("ESC pushed");
            break;
    }
}
keyRelease = function(evt){
    switch(evt.keyCode){
        case 27:
            console.log("ESC released");
            break;   
    }
}
mouseMove = function(evt){
    mx = evt.clientX;
    my = evt.clientY;
}
mouseDown = function(){
    
}