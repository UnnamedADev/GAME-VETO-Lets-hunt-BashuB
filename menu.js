document.addEventListener("DOMContentLoaded",function(){
    menuPlay();
    menuFooter();
    switchCard();
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