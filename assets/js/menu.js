/* ==========================
DOM
========================== */

const productGrid = document.getElementById("product-grid");

const searchInput = document.getElementById("searchFood");

const filterButtons = document.querySelectorAll(".filter-btn");

const cartCount = document.getElementById("cart-count");

const floatingCount = document.getElementById("floating-count");

const toast = document.getElementById("toast");


/* ==========================
LOAD STORAGE
========================== */

let cart = JSON.parse(

localStorage.getItem("cart")

) || [];

let wishlist = JSON.parse(

localStorage.getItem("wishlist")

) || [];


/* ==========================
RENDER PRODUCTS
========================== */

function renderProducts(list){

productGrid.innerHTML="";

list.forEach(product=>{

const isWish = wishlist.includes(

product.id

);

const stars = "★".repeat(

product.rating

);

const card = `

<div class="food-card">

<img src="${product.image}"

alt="${product.name}">

<div class="food-content">

<h3>${product.name}</h3>

<p>

Category: ${product.category}

</p>

<p class="rating">

${stars}

</p>

<div class="price-row">

<span>

$${product.price}

</span>

<div class="action-btns">

<button

onclick="addToCart(${product.id})">

Add Cart

</button>

<i

class="fa-heart fa-${isWish ? 'solid':'regular'}"

onclick="toggleWishlist(${product.id})">

</i>

</div>

</div>

</div>

</div>

`;

productGrid.innerHTML += card;

});

}


/* ==========================
FILTER CATEGORY
========================== */

filterButtons.forEach(btn=>{

btn.addEventListener("click",()=>{

document

.querySelector(".filter-btn.active")

.classList.remove("active");

btn.classList.add("active");

const category =

btn.dataset.filter;

if(category==="all"){

renderProducts(products);

return;

}

const filtered = products.filter(

item=>item.category===category

);

renderProducts(filtered);

});

});


/* ==========================
SEARCH PRODUCT
========================== */

searchInput.addEventListener(

"keyup",

()=>{

const keyword =

searchInput.value.toLowerCase();

const result = products.filter(

item=>

item.name

.toLowerCase()

.includes(keyword)

);

renderProducts(result);

}

);


/* ==========================
ADD CART
========================== */

function addToCart(id){

const product = products.find(

item=>item.id===id

);

cart.push(product);

localStorage.setItem(

"cart",

JSON.stringify(cart)

);

updateCounter();

showToast(

`${product.name} added!`

);

}


/* ==========================
WISHLIST
========================== */

function toggleWishlist(id){

if(wishlist.includes(id)){

wishlist = wishlist.filter(

item=>item!==id

);

showToast(

"Removed Wishlist"

);

}

else{

wishlist.push(id);

showToast(

"Added Wishlist"

);

}

localStorage.setItem(

"wishlist",

JSON.stringify(wishlist)

);

renderProducts(products);

}


/* ==========================
COUNTER
========================== */

function updateCounter(){

cartCount.innerText = cart.length;

floatingCount.innerText = cart.length;

}


/* ==========================
TOAST
========================== */

function showToast(message){

toast.innerText = message;

toast.classList.add("show");

setTimeout(()=>{

toast.classList.remove("show");

},2500);

}


/* ==========================
INIT
========================== */

renderProducts(products);

updateCounter();