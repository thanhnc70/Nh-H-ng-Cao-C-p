/* ==========================
DOM
========================== */

const toast =
document.getElementById(
"toast"
);

const orderHistory =
document.getElementById(
"orderHistory"
);

const paymentModal =
document.getElementById(
"paymentModal"
);

let selectedGateway = "";

/* ==========================
INIT STORAGE
========================== */

if(!localStorage.getItem("orders")){

localStorage.setItem(

"orders",

JSON.stringify([])

);

}

let orders = JSON.parse(

localStorage.getItem(
"orders"
)

);


/* ==========================
SELECT GATEWAY
========================== */

function selectGateway(method){

selectedGateway = method;

document.getElementById(

"selectedGateway"

).innerHTML =

`Selected: <strong>${method}</strong>`;

document

.querySelectorAll(

".gateway-card"

)

.forEach(card=>{

card.classList.remove(

"active-gateway"

);

if(

card.innerText.includes(

method

)

){

card.classList.add(

"active-gateway"

);

}

});

}


/* ==========================
PROCESS PAYMENT
========================== */

function processPayment(){

if(selectedGateway===""){

showToast(

"Choose Payment Method"

);

return;

}

const user = getCurrentUser();

const invoiceId =

"INV-"+

Math.floor(

1000+Math.random()*9000

);

const amount =

Math.floor(

50+Math.random()*500

);

const order={

id:invoiceId,

customer:

user?.name ||

"Guest",

gateway:

selectedGateway,

amount,

status:"Paid",

date:new Date()

.toLocaleString()

};

orders.push(order);

localStorage.setItem(

"orders",

JSON.stringify(
orders
)

);

updateInvoice(order);

renderOrders();

paymentModal.style.display=

"flex";

showToast(

`${selectedGateway} Payment Success`

);

}


/* ==========================
INVOICE
========================== */

function updateInvoice(order){

document.getElementById(

"invoiceId"

).innerText=

order.id;

document.getElementById(

"invoiceCustomer"

).innerText=

order.customer;

document.getElementById(

"invoiceAmount"

).innerText=

`$${order.amount}`;

document.getElementById(

"invoiceStatus"

).innerText=

order.status;

}


/* ==========================
ORDER HISTORY
========================== */

function renderOrders(){

orderHistory.innerHTML="";

if(orders.length===0){

orderHistory.innerHTML=`

<div class="empty-state">

<h3>

No Orders Yet

</h3>

</div>

`;

return;

}

[...orders].reverse().forEach(

item=>{

orderHistory.innerHTML += `

<div class="booking-card">

<h3>

${item.id}

</h3>

<p>

👤 ${item.customer}

</p>

<p>

💳 ${item.gateway}

</p>

<p>

💰 $${item.amount}

</p>

<p>

📅 ${item.date}

</p>

<p>

Status:

<span class="status-badge">

${item.status}

</span>

</p>

<button

class="remove-btn"

onclick="deleteOrder(

'${item.id}'

)">

Delete

</button>

</div>

`;

}

);

}


/* ==========================
DELETE ORDER
========================== */

function deleteOrder(id){

orders = orders.filter(

o=>o.id!==id

);

localStorage.setItem(

"orders",

JSON.stringify(
orders
)

);

renderOrders();

showToast(

"Order Deleted"

);

}


/* ==========================
PDF EXPORT
========================== */

function downloadInvoice(){

window.print();

}


/* ==========================
MODAL CLOSE
========================== */

function closePaymentModal(){

paymentModal.style.display=

"none";

}


/* ==========================
TOAST
========================== */

function showToast(message){

if(!toast) return;

toast.innerText=message;

toast.classList.add(

"show"

);

setTimeout(()=>{

toast.classList.remove(

"show"

);

},2500);

}


/* ==========================
INIT
========================== */

renderOrders();