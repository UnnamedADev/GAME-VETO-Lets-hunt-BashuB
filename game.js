// # INIT
document.addEventListener("DOMContentLoaded",function(){
    myCanvas = document.getElementById("game");
    ctx = myCanvas.getContext("2d");
    document.addEventListener("keydown", keyPush);
    document.addEventListener("keyup", keyRelease);
    
    gInterval = setInterval(game, 1000/30);
});

// # GAME
game = function(){
    
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