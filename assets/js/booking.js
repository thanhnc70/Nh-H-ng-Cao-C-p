/* ==========================
DOM
========================== */

const bookingList =
document.getElementById(
"booking-list"
);

const modal =
document.getElementById(
"booking-modal"
);

const toast =
document.getElementById(
"toast"
);

let selectedTable = "";


/* ==========================
INIT STORAGE
========================== */

if(!localStorage.getItem("bookings")){

localStorage.setItem(

"bookings",

JSON.stringify([])

);

}

let bookings = JSON.parse(

localStorage.getItem(

"bookings"

)

);


/* ==========================
TABLE SELECT
========================== */

function selectTable(type){

selectedTable = type;

document.getElementById(

"selected-table"

).innerHTML =

`Selected: <strong>${type}</strong>`;

document

.querySelectorAll(

".table-card"

)

.forEach(card=>{

card.classList.remove(

"active-table"

);

if(

card.innerText===type

){

card.classList.add(

"active-table"

);

}

});

}


/* ==========================
SAVE BOOKING
========================== */

function saveBooking(){

const name =
document.getElementById(
"customerName"
).value;

const phone =
document.getElementById(
"customerPhone"
).value;

const email =
document.getElementById(
"customerEmail"
).value;

const date =
document.getElementById(
"bookingDate"
).value;

const time =
document.getElementById(
"bookingTime"
).value;

const guest =
document.getElementById(
"guestCount"
).value;

const note =
document.getElementById(
"bookingNote"
).value;


/* VALIDATION */

if(

name==="" ||

phone==="" ||

email==="" ||

date==="" ||

time==="" ||

guest==="" ||

selectedTable===""

){

showToast(

"Complete all fields"

);

return;

}

/* DATA */

const booking={

id:Date.now(),

name,
phone,
email,
date,
time,
guest,
table:selectedTable,
note

};

bookings.push(

booking

);

localStorage.setItem(

"bookings",

JSON.stringify(

bookings

)

);

renderBookings();

clearForm();

modal.style.display="flex";

showToast(

"Reservation Saved"

);

}


/* ==========================
RENDER HISTORY
========================== */

function renderBookings(){

bookingList.innerHTML="";

if(bookings.length===0){

bookingList.innerHTML=`

<div class="empty-state">

<h3>

No Reservation

</h3>

</div>

`;

return;

}

bookings.forEach(item=>{

const card = `

<div class="booking-card">

<h3>

${item.name}

</h3>

<p>

📞 ${item.phone}

</p>

<p>

📧 ${item.email}

</p>

<p>

📅 ${item.date}

</p>

<p>

⏰ ${item.time}

</p>

<p>

👥 ${item.guest}

</p>

<p>

🍽 ${item.table}

</p>

<p>

📝 ${item.note}

</p>

<button

class="remove-btn"

onclick="deleteBooking(

${item.id}

)">

Delete

</button>

</div>

`;

bookingList.innerHTML += card;

});

}


/* ==========================
DELETE
========================== */

function deleteBooking(id){

bookings = bookings.filter(

item=>item.id!==id

);

localStorage.setItem(

"bookings",

JSON.stringify(

bookings

)

);

renderBookings();

showToast(

"Reservation Deleted"

);

}


/* ==========================
CLEAR FORM
========================== */

function clearForm(){

document.getElementById(

"customerName"

).value="";

document.getElementById(

"customerPhone"

).value="";

document.getElementById(

"customerEmail"

).value="";

document.getElementById(

"bookingDate"

).value="";

document.getElementById(

"bookingTime"

).value="";

document.getElementById(

"guestCount"

).value="";

document.getElementById(

"bookingNote"

).value="";

selectedTable="";

document.getElementById(

"selected-table"

).innerText=

"No Table Selected";

document

.querySelectorAll(

".table-card"

)

.forEach(card=>{

card.classList.remove(

"active-table"

);

});

}


/* ==========================
MODAL CLOSE
========================== */

function closeBookingModal(){

modal.style.display="none";

}


/* ==========================
TOAST
========================== */

function showToast(message){

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

renderBookings();