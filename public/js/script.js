

function close_btn(){
    document.getElementById('myNav').style.height="0%";
    document.getElementById('content_set').style.display="none";
    document.getElementById('close_btn').style.display="none";
}
function displayFileName(value,id){
 const name = value;
 const myId = id
 if(myId=='image'){
 document.getElementById('file_name').innerHTML= `&nbsp ${name}`
 }
 else if(myId=='addimage'){
    document.getElementById('file_name2').innerHTML= `&nbsp ${name}` 
 }
 else{
    document.getElementById('video-name').innerHTML= `&nbsp ${name}` 
 }
}

function open_btn(){
    document.getElementById('myNav').style.display="block";
    document.getElementById('myNav').style.height="240px";
    document.getElementById('content_set').style.display="flex";
    document.getElementById('close_btn').style.display="block";
    
}

function clearHeader(){
    document.getElementById('header_container').style.width="0";
    document.getElementById('mobile_search').style.width="100%";
}
function showHeader(){
    document.getElementById('header_container').style.width="100%";
document.getElementById('mobile_search').style.width="0";
document.getElementById('searchbar').value="";
}
function offPopup(){
    document.getElementById('popup').style.display="none";
}
function onPopup(){
    document.getElementById('popup').style.display="flex";
}
