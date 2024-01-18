document.addEventListener('DOMContentLoaded',function(){ 
    
       })



function close_btn(){
    document.getElementById('myNav').style.height="0%";
    document.getElementById('content_set').style.display="none";
    document.getElementById('close_btn').style.display="none";
}

function open_btn(){
    document.getElementById('myNav').style.display="block";
    document.getElementById('myNav').style.height="50%";
    document.getElementById('content_set').style.display="flex";
    document.getElementById('close_btn').style.display="block";
    
}

function clearHeader(){
            document.getElementById('header_container').style.display="none";
    document.getElementById('mobile_search').style.display="flex";
    
}
function showHeader(){
    document.getElementById('header_container').style.display="grid";
document.getElementById('mobile_search').style.display="none";
document.getElementById('searchbar').value="";
}
function offPopup(){
    document.getElementById('popup').style.display="none";
}
function onPopup(){
    document.getElementById('popup').style.display="block";
}
