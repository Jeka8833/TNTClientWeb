window.onload = function(){
  console.log("Hola!.This page is loaded!")
  const pl1 = document.getElementById("pl1");
  const pl2 = document.getElementById("pl2");
  const pl3 = document.getElementById("pl3");
  const pl4 = document.getElementById("pl4");
  const pl5 = document.getElementById("pl5");
  const pl6 = document.getElementById("pl6");
  const p1 = document.getElementById("p1");
  const p2 = document.getElementById("p2");
  const p3 = document.getElementById("p3");
  const p4 = document.getElementById("p4");
  const p5 = document.getElementById("p5");
  const p6 = document.getElementById("p6");
  const btn1 = document.getElementById("btn1");
  const btn2 = document.getElementById("btn2");
  const btn3 = document.getElementById("btn3");
  const btn4 = document.getElementById("btn4");
  const btn4_2 = document.getElementById("btn4_2");
  const btn4_3 = document.getElementById("btn4_3");
  const btn5 = document.getElementById("btn5");
  const dark = document.getElementById("dark");
  const lic = document.getElementById("lic");
  const lic_inner = document.getElementById("lic_inner");

  pl1.onclick = function(){
  p1.classList.toggle("del");
  pl1.classList.toggle("cross");
  }

  pl2.onclick = function(){
  p2.classList.toggle("del");
  pl2.classList.toggle("cross");
  }

  pl3.onclick = function(){
  p3.classList.toggle("del");
  pl3.classList.toggle("cross");
  }

  pl4.onclick = function(){
  p4.classList.toggle("del");
  pl4.classList.toggle("cross");
  }

  pl5.onclick = function(){
  p5.classList.toggle("del");
  pl5.classList.toggle("cross");
  }

  pl6.onclick = function(){
  p6.classList.toggle("del");
  pl6.classList.toggle("cross");
  }

  btn1.onclick = function(){
  dark.classList.add("dark2");
  lic.classList.add("lic2");
  lic_inner.classList.add("lic_inner2");
  btn4.classList.remove("del");
  btn4_2.classList.add("del");
  btn4_3.classList.add("del");
  }

  btn2.onclick = function(){
  dark.classList.add("dark2");
  lic.classList.add("lic2");
  lic_inner.classList.add("lic_inner2");
  btn4.classList.add("del");
  btn4_2.classList.remove("del");
  btn4_3.classList.add("del");
  }

  btn3.onclick = function(){
  dark.classList.add("dark2");
  lic.classList.add("lic2");
  lic_inner.classList.add("lic_inner2");
  btn4.classList.add("del");
  btn4_2.classList.add("del");
  btn4_3.classList.remove("del");
  }

  btn4.onclick = function(){
  dark.classList.remove("dark2");
  lic.classList.remove("lic2");
  lic_inner.classList.remove("lic_inner2");
  }

  btn4_2.onclick = function(){
  dark.classList.remove("dark2");
  lic.classList.remove("lic2");
  lic_inner.classList.remove("lic_inner2");
  }

  btn4_3.onclick = function(){
  dark.classList.remove("dark2");
  lic.classList.remove("lic2");
  lic_inner.classList.remove("lic_inner2");
  }

  btn5.onclick = function(){
  dark.classList.remove("dark2");
  lic.classList.remove("lic2");
  lic_inner.classList.remove("lic_inner2");
  }

};
