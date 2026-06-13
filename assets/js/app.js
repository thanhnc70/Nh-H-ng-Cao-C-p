/* ==========================
LOADING SCREEN
========================== */

document.addEventListener("DOMContentLoaded",()=>{

const loader=document.getElementById("loader");

if(loader){

setTimeout(()=>{

loader.style.display="none";

},1200);

}

});


/* ==========================
MOBILE MENU
========================== */

const menuBtn = document.getElementById("menu-btn");

const navLinks = document.querySelector(".nav-links");

menuBtn.addEventListener("click",()=>{

navLinks.classList.toggle("active");

});


/* ==========================
AUTO CLOSE MENU MOBILE
========================== */

document.querySelectorAll(".nav-links a")

.forEach(link=>{

link.addEventListener("click",()=>{

navLinks.classList.remove("active");

});

});


/* ==========================
BACK TO TOP BUTTON
========================== */

const topBtn = document.getElementById("topBtn");

window.addEventListener("scroll",()=>{

if(window.scrollY > 300){

topBtn.style.display = "block";

}
else{

topBtn.style.display = "none";

}

});

topBtn.addEventListener("click",()=>{

window.scrollTo({

top:0,

behavior:"smooth"

});

});


/* ==========================
STICKY HEADER EFFECT
========================== */

const header = document.querySelector(".header");

window.addEventListener("scroll",()=>{

if(window.scrollY > 50){

header.style.background = "#0a0a0a";

header.style.boxShadow = "0 8px 25px rgba(0,0,0,.65)";

}
else{

header.style.background = "#111";

header.style.boxShadow = "0 0 20px rgba(0,0,0,.6)";

}

});


/* ==========================
SEARCH FOOD DEMO
========================== */

const searchInput = document.querySelector(".search-container input");

const foodCards = document.querySelectorAll(".food-card");

searchInput.addEventListener("keyup",()=>{

const keyword = searchInput.value.toLowerCase();

foodCards.forEach(card=>{

const title = card.querySelector("h3")

.innerText.toLowerCase();

if(title.includes(keyword)){

card.style.display="block";

}
else{

card.style.display="none";

}

});

});


/* ==========================
ADD CART DEMO
========================== */

const cartButtons = document.querySelectorAll(".price-row button");

cartButtons.forEach(btn=>{

btn.addEventListener("click",()=>{

showToast("Đã thêm món vào giỏ hàng!");

});

});


/* ==========================
TOAST NOTIFICATION
========================== */

function showToast(message){

const toast = document.createElement("div");

toast.className="toast";

toast.innerText=message;

document.body.appendChild(toast);

setTimeout(()=>{

toast.classList.add("show");

},100);

setTimeout(()=>{

toast.classList.remove("show");

setTimeout(()=>{

toast.remove();

},400);

},2500);

}


/* ==========================
SCROLL ANIMATION
========================== */

const observer = new IntersectionObserver((entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.classList.add("show");

}

});

});

const hiddenElements = document.querySelectorAll(

".food-card,.category-card,.review-card,.promo-box"

);

hiddenElements.forEach(el=>{

el.classList.add("hidden");

observer.observe(el);

});


/* ==========================
NEWSLETTER SUBSCRIBE
========================== */

const subscribeBtn = document.querySelector(

".newsletter-box button"

);

subscribeBtn.addEventListener("click",()=>{

const email = document.querySelector(

".newsletter-box input"

).value;

if(email===""){

showToast("Vui lòng nhập Email!");

return;

}

showToast("Đăng ký thành công!");

});


/* ==========================
DEMO WISHLIST ICON
========================== */

const heartIcon = document.querySelector(

".fa-heart"

);

heartIcon.addEventListener("click",()=>{

heartIcon.classList.toggle("active-heart");

showToast("Wishlist Updated");

});