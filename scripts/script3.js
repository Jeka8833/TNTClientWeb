  window.onload = function(){

    let obj = [];
    let custom = document.getElementById("test");
    /*EMAIL*/
    const EMAIL_REGEXP = /^\S+@\S+\.\S+$/;

    const email = document.getElementById("email");

    function onInput() {
      if (isEmailValid(email.value) && email.value.length <= 174) {
        email.setAttribute("class","accept");
        obj[2] = email.value;
      } else {
        email.setAttribute("class","error");
      }
    }

    email.addEventListener('input', onInput);

    function isEmailValid(value) {
      return EMAIL_REGEXP.test(value);
    }
    /*EMAIL*/

    /*DISCORD*/
    const DISCORD_REGEXP = /^((.+?)#\d{4})/;

    const discord = document.getElementById("discord");

    discord.oninput = function() {
      if (isDiscordValid(discord.value) && discord.value.length <= 64) {
        discord.setAttribute("class","accept");
        obj[1] = discord.value;
      } else {
        discord.setAttribute("class","error");
      }
    }

    function isDiscordValid(value) {
      return DISCORD_REGEXP.test(value);
    }
    /*DISCORD*/
    /*NAME*/
    const name = document.getElementById("name");
   /*Не чекать каждый символ*/
    name.onmouseleave = function(){
    var requestURL = "https://api.ashcon.app/mojang/v2/user/"+String(name.value);
    var request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();

    request.onload = function() {
    let str = JSON.parse(JSON.stringify(request.response));
    if(str["uuid"] != undefined && name.value.length <= 16){
    name.setAttribute("class","accept");
    obj[0] = str["uuid"];
    let temp = "";
    for(let i = 0; i < obj[0].length; i++){
    if(obj[0][i] == "-"){}
    else{temp += obj[0][i];}
    }
    obj[0] = temp;
    temp = "";
  } else{
    name.setAttribute("class","error");
  }

  }

    }

    /*NAME*/
    /*CUSTOM*/
  let form = document.getElementsByTagName('form');
  if(email.value == "" && name.value == "" && discord.value == ""){
  form[0].removeAttribute('id');
  }


  email.onchange = function(){
  if(email.classList.contains("accept") == true && name.classList.contains("accept")  && String(JSON.stringify(obj).slice(2, -2)).length <= 254){
  document.getElementById("test").value = String(obj);
  form[0].removeAttribute('id');
  if(obj[1] == undefined || discord.value == ""){obj[1] = "";}
  custom.setAttribute("value",String(JSON.stringify(obj).slice(2, -2)));
  }
  else if(email.value.length == 0 && name.value.length == 0 && discord.value.length == 0){
  custom.setAttribute("value","");
  form[0].removeAttribute('id');
  }
  else{
  form[0].setAttribute('id','disable');
  }
  }
  name.onchange = function(){
  if(email.classList.contains("accept") == true && name.classList.contains("accept") && String(JSON.stringify(obj).slice(2, -2)).length <= 254){
  document.getElementById("test").value = String(obj);
  form[0].removeAttribute('id');
  if(obj[1] == undefined || discord.value == ""){obj[1] = "";}
  custom.setAttribute("value",String(JSON.stringify(obj).slice(2, -2)));
  }
  else if(email.value.length == 0 && name.value.length == 0 && discord.value.length == 0){
  custom.setAttribute("value","");
  form[0].removeAttribute('id');
  }
  else{
  form[0].setAttribute('id','disable');
  }
  }
  discord.onchange = function(){
  if(email.classList.contains("accept") == true && name.classList.contains("accept")  && String(JSON.stringify(obj).slice(2, -2)).length <= 254){
  document.getElementById("test").value = String(obj);
  form[0].removeAttribute('id');
  if(obj[1] == undefined || discord.value == ""){obj[1] = "";}
  custom.setAttribute("value",String(JSON.stringify(obj).slice(2, -2)));
  }
  else if(email.value.length == 0 && name.value.length == 0 && discord.value.length == 0){
  custom.setAttribute("value","");
  form[0].removeAttribute('id');
  }
  else{
  form[0].setAttribute('id','disable');
  }
  }


  /*CUSTOM*/


  }
