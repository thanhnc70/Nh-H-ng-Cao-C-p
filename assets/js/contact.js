/* ==========================
DOM
========================== */

const historyBox =
document.getElementById(
"contact-history"
);

const toast =
document.getElementById(
"toast"
);

/* ==========================
INIT STORAGE
========================== */

if(!localStorage.getItem("contacts")){

localStorage.setItem(

"contacts",

JSON.stringify([])

);

}

let contacts = JSON.parse(

localStorage.getItem(
"contacts"
)

);


/* ==========================
SEND CONTACT
========================== */

function sendContact(){

const name =
document.getElementById(
"contactName"
).value.trim();

const email =
document.getElementById(
"contactEmail"
).value.trim();

const phone =
document.getElementById(
"contactPhone"
).value.trim();

const subject =
document.getElementById(
"contactSubject"
).value.trim();

const message =
document.getElementById(
"contactMessage"
).value.trim();


/* VALIDATION */

if(

name==="" ||

email==="" ||

phone==="" ||

subject==="" ||

message===""

){

showToast(

"Complete all fields"

);

return;

}

/* EMAIL CHECK */

const emailRegex =

/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if(!emailRegex.test(email)){

showToast(

"Invalid Email"

);

return;

}


/* DATA */

const contact={

id:Date.now(),

name,
email,
phone,
subject,
message

};

contacts.push(

contact

);

localStorage.setItem(

"contacts",

JSON.stringify(

contacts

)

);

renderContacts();

clearForm();

showToast(

"Message Sent!"

);

/* EMAILJS DEMO */

console.log(

"EmailJS Demo Send:",

contact

);

}


/* ==========================
RENDER HISTORY
========================== */

function renderContacts(){

historyBox.innerHTML="";

if(contacts.length===0){

historyBox.innerHTML=`

<div class="empty-state">

<h3>

No Contact History

</h3>

</div>

`;

return;

}

contacts.forEach(item=>{

const card = `

<div class="booking-card">

<h3>

${item.subject}

</h3>

<p>

👤 ${item.name}

</p>

<p>

📧 ${item.email}

</p>

<p>

📞 ${item.phone}

</p>

<p>

📝 ${item.message}

</p>

<button

class="remove-btn"

onclick="deleteContact(

${item.id}

)">

Delete

</button>

</div>

`;

historyBox.innerHTML += card;

});

}


/* ==========================
DELETE CONTACT
========================== */

function deleteContact(id){

contacts = contacts.filter(

item=>item.id!==id

);

localStorage.setItem(

"contacts",

JSON.stringify(

contacts

)

);

renderContacts();

showToast(

"Deleted"

);

}


/* ==========================
CLEAR FORM
========================== */

function clearForm(){

document.getElementById(
"contactName"
).value="";

document.getElementById(
"contactEmail"
).value="";

document.getElementById(
"contactPhone"
).value="";

document.getElementById(
"contactSubject"
).value="";

document.getElementById(
"contactMessage"
).value="";

}


/* ==========================
FAQ ACCORDION
========================== */

const faqItems =

document.querySelectorAll(
".faq-item"
);

faqItems.forEach(item=>{

const question = item.querySelector(

".faq-question"

);

question.addEventListener(

"click",

()=>{

item.classList.toggle(

"active-faq"

);

});

});


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

renderContacts();