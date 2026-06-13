/* ==========================
DOM
========================== */

const cartContainer =
document.getElementById("cart-items");

const subtotalEl =
document.getElementById("subtotal");

const vatEl =
document.getElementById("vat");

const discountEl =
document.getElementById("discount");

const totalEl =
document.getElementById("total");

const cartCount =
document.getElementById("cart-count");

const emptyCart =
document.getElementById("empty-cart");

const toast =
document.getElementById("toast");


/* ==========================
LOAD STORAGE
========================== */

let cart =
JSON.parse(
localStorage.getItem("cart")
) || [];

let discount = 0;


/* ==========================
GROUP CART
========================== */

function groupCart(){

const grouped = {};

cart.forEach(item=>{

if(grouped[item.id]){

grouped[item.id].qty++;

}

else{

grouped[item.id] = {

...item,

qty:1

};

}

});

return Object.values(grouped);

}


/* ==========================
RENDER CART
========================== */

function renderCart(){

cartContainer.innerHTML="";

const groupedItems = groupCart();

if(groupedItems.length===0){

document.querySelector(

".cart-section"

).style.display="none";

emptyCart.style.display="block";

updateCounter();

return;

}

else{

document.querySelector(

".cart-section"

).style.display="block";

emptyCart.style.display="none";

}

groupedItems.forEach(item=>{

const card = `

<div class="cart-card">

<img src="${item.image}"

alt="${item.name}">

<div class="cart-info">

<h3>${item.name}</h3>

<p>

$${item.price}

</p>

<div class="qty-box">

<button

onclick="decreaseQty(${item.id})">

-

</button>

<span>

${item.qty}

</span>

<button

onclick="increaseQty(${item.id})">

+

</button>

</div>

</div>

<button

class="remove-btn"

onclick="removeItem(${item.id})">

<i class="fa-solid fa-trash">

</i>

</button>

</div>

`;

cartContainer.innerHTML += card;

});

calculateTotal();

updateCounter();

}


/* ==========================
INCREASE
========================== */

function increaseQty(id){

const product = cart.find(

item=>item.id===id

);

cart.push(product);

saveCart();

showToast(

"Quantity Updated"

);

}


/* ==========================
DECREASE
========================== */

function decreaseQty(id){

const index = cart.findIndex(

item=>item.id===id

);

if(index>-1){

cart.splice(index,1);

}

saveCart();

showToast(

"Quantity Updated"

);

}


/* ==========================
REMOVE
========================== */

function removeItem(id){

cart = cart.filter(

item=>item.id!==id

);

saveCart();

showToast(

"Item Removed"

);

}


/* ==========================
TOTAL
========================== */

function calculateTotal(){

let subtotal = 0;

cart.forEach(item=>{

subtotal += item.price;

});

let vat = subtotal * 0.10;

let total =

subtotal + vat - discount;

subtotalEl.innerText =

`$${subtotal.toFixed(2)}`;

vatEl.innerText =

`$${vat.toFixed(2)}`;

discountEl.innerText =

`$${discount.toFixed(2)}`;

totalEl.innerText =

`$${total.toFixed(2)}`;

}


/* ==========================
COUPON
========================== */

function applyCoupon(){

const coupon =
document.getElementById(

"coupon"

).value;

if(coupon==="WS50"){

discount = 10;

showToast(

"Coupon Applied!"

);

}

else{

discount = 0;

showToast(

"Invalid Coupon"

);

}

calculateTotal();

}


/* ==========================
CHECKOUT
========================== */

function checkout(){

if(cart.length===0){

showToast(
"Cart Empty"
);

return;

}

showToast(
"Checkout Success!"
);

localStorage.removeItem(
"cart"
);

cart=[];

renderCart();

}


/* ==========================
SAVE
========================== */

function saveCart(){

localStorage.setItem(

"cart",

JSON.stringify(cart)

);

renderCart();

}


/* ==========================
COUNTER
========================== */

function updateCounter(){

cartCount.innerText =

cart.length;

}


/* ==========================
TOAST
========================== */

function showToast(message){

toast.innerText=message;

toast.classList.add("show");

setTimeout(()=>{

toast.classList.remove(

"show"

);

},2500);

}


/* ==========================
INIT
========================== */

renderCart();

/* ==========================
CHECKOUT MODAL
========================== */

const modal =
document.getElementById(
"checkout-modal"
);

const paymentArea =
document.getElementById(
"payment-area"
);

const closeModal =
document.getElementById(
"closeModal"
);

let paymentMethod = "";


/* OPEN MODAL */

function openCheckout(){

if(cart.length===0){

showToast(
"Cart Empty"
);

return;

}

modal.style.display="flex";

}


/* CLOSE */

closeModal.addEventListener(

"click",

()=>{

modal.style.display="none";

}

);

window.addEventListener(

"click",

(e)=>{

if(e.target===modal){

modal.style.display="none";

}

}

);


/* SELECT PAYMENT */

function selectPayment(type){

paymentMethod=type;

if(type==="visa"){

paymentArea.innerHTML=`

<input
type="text"
id="cardName"
placeholder="Card Holder">

<input
type="text"
id="cardNumber"
placeholder="Card Number">

<input
type="text"
id="cardCVV"
placeholder="CVV">

`;

}

if(type==="qr"){

paymentArea.innerHTML=`

<div class="qr-box">

<img
src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=WSRestaurantPayment">

<p>

Scan QR to Pay

</p>

</div>

`;

}

if(type==="cash"){

paymentArea.innerHTML=`

<div class="cash-box">

<h3>

Cash Payment

</h3>

<p>

Thanh toán trực tiếp khi nhận món.

</p>

</div>

`;

}

}


/* CONFIRM */

function confirmPayment(){

if(paymentMethod===""){

showToast(

"Choose Payment Method"

);

return;

}

showToast(

"Payment Success!"

);

localStorage.removeItem(

"cart"

);

cart=[];

renderCart();

modal.style.display="none";

}