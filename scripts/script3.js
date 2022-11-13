window.onload = function(){

  let obj = [];
  let custom = document.getElementById("custom");
  /*EMAIL*/
  const EMAIL_REGEXP = /^\S+@\S+\.\S+$/;

  const email = document.getElementById("email");

  function onInput() {
    if (isEmailValid(email.value)) {
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
    if (isDiscordValid(discord.value)) {
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

  name.oninput = function(){
  var requestURL = "https://api.ashcon.app/mojang/v2/user/"+String(name.value);
  var request = new XMLHttpRequest();
  request.open('GET', requestURL);
  request.responseType = 'json';
  request.send();

  request.onload = function() {
  let str = JSON.parse(JSON.stringify(request.response));
  if(str["uuid"] != undefined){
  name.setAttribute("class","accept");
  obj[0] = str["uuid"];
} else{
  name.setAttribute("class","error");
}

}

  }

  /*NAME*/
  /*CUSTOM*/
let form = document.getElementsByTagName('form');

email.onchange = function(){
if(email.classList.contains("accept") == true && name.classList.contains("accept") && discord.classList.contains("accept")){
custom.value = String(obj);
form[0].removeAttribute('id');
custom.value = String(JSON.stringify(obj).slice(2, -2));
}
else{
form[0].setAttribute('id','disable');
}
}
name.onchange = function(){
if(email.classList.contains("accept") == true && name.classList.contains("accept") && discord.classList.contains("accept")){
custom.value = String(obj);
form[0].removeAttribute('id');
custom.value = String(JSON.stringify(obj).slice(2, -2));
}
else{
form[0].setAttribute('id','disable');
}
}
discord.onchange = function(){
if(email.classList.contains("accept") == true && name.classList.contains("accept") && discord.classList.contains("accept")){
custom.value = String(obj);
form[0].removeAttribute('id');
custom.value = String(JSON.stringify(obj).slice(2, -2));
}
else{
form[0].setAttribute('id','disable');
}
}

form[0].onclick = function(){
alert(custom.value);
}
/*CUSTOM*/

console.log(JSON.stringify([
    '6bd6e833a80a430e90294786368811f9',
    '"()<>[]:,;@\\\\"!##8833',
    '"()<>[]:,;@\\\\"!#$%&\'-/=?^_`{}| ~.a"@日本.com']).slice(2, -2));

}
