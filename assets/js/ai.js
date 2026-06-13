/* ==========================
DOM
========================== */

const toast =
document.getElementById(
"toast"
);

const chatBox =
document.getElementById(
"chatBox"
);

const smartResults =
document.getElementById(
"smartResults"
);

/* ==========================
AI MENU DATABASE
========================== */

const menuData=[

{
name:"Burger Deluxe",
category:"Burger",
taste:"Cheese",
price:15
},

{
name:"Spicy Pizza",
category:"Pizza",
taste:"Spicy",
price:20
},

{
name:"Healthy Steak",
category:"Steak",
taste:"Healthy",
price:35
},

{
name:"Sweet Milk Tea",
category:"Drink",
taste:"Sweet",
price:8
},

{
name:"Cheese Burger",
category:"Burger",
taste:"Cheese",
price:12
},

{
name:"Spicy Chicken",
category:"Burger",
taste:"Spicy",
price:18
}

];


/* ==========================
AI CHATBOT
========================== */

function sendAIMessage(){

const input =
document.getElementById(
"chatInput"
);

const message =
input.value.trim();

if(message==="") return;

chatBox.innerHTML += `

<div class="user-message">

${message}

</div>

`;

const reply = generateAIReply(

message.toLowerCase()

);

setTimeout(()=>{

chatBox.innerHTML += `

<div class="bot-message">

${reply}

</div>

`;

chatBox.scrollTop=

chatBox.scrollHeight;

},500);

input.value="";

}


/* ==========================
AI RULE ENGINE
========================== */

function generateAIReply(text){

if(text.includes("spicy")){

return

"🔥 Recommend: Spicy Pizza or Spicy Chicken.";

}

if(text.includes("drink")){

return

"🥤 Recommend: Sweet Milk Tea.";

}

if(text.includes("best")){

return

"⭐ Best Seller: Burger Deluxe.";

}

if(text.includes("healthy")){

return

"🥗 Healthy Choice: Healthy Steak.";

}

return

"🤖 Try Burger Deluxe, Pizza, Steak or Drink menu.";

}


/* ==========================
FOOD RECOMMENDATION AI
========================== */

function recommendFood(){

const category =
document.getElementById(
"foodCategory"
).value;

const taste =
document.getElementById(
"foodTaste"
).value;

const budget =
parseFloat(

document.getElementById(
"foodBudget"
).value

);

const result = menuData.filter(

item=>

(category==="" ||

item.category===category)

&&

(taste==="" ||

item.taste===taste)

&&

(

isNaN(budget)

||

item.price<=budget

)

);

const box =
document.getElementById(
"recommendResult"
);

if(result.length===0){

box.innerHTML=

"No matching food found.";

return;

}

box.innerHTML=

result.map(item=>`

<div class="booking-card">

<h3>

${item.name}

</h3>

<p>

${item.category}

</p>

<p>

${item.taste}

</p>

<p>

$${item.price}

</p>

</div>

`).join("");

}


/* ==========================
VOICE SEARCH
========================== */

function startVoiceSearch(){

const SpeechRecognition =

window.SpeechRecognition ||

window.webkitSpeechRecognition;

if(!SpeechRecognition){

showToast(

"Voice Search Unsupported"

);

return;

}

const recognition =

new SpeechRecognition();

recognition.lang="en-US";

recognition.start();

recognition.onresult=(event)=>{

const transcript =

event.results[0][0]

.transcript;

document.getElementById(

"voiceResult"

).value=

transcript;

showToast(

"Voice Captured"

);

};

}


/* ==========================
SMART SEARCH
========================== */

document.getElementById(

"smartSearch"

)

.addEventListener(

"keyup",

()=>{

const keyword =

document

.getElementById(

"smartSearch"

)

.value

.toLowerCase();

const result = menuData.filter(

item=>

item.name

.toLowerCase()

.includes(keyword)

||

item.category

.toLowerCase()

.includes(keyword)

);

renderSmartSearch(

result

);

}

);


function renderSmartSearch(data){

smartResults.innerHTML="";

if(data.length===0){

smartResults.innerHTML=

"<p>No Result Found</p>";

return;

}

data.forEach(item=>{

smartResults.innerHTML += `

<div class="booking-card">

<h3>

${item.name}

</h3>

<p>

${item.category}

</p>

<p>

${item.taste}

</p>

<p>

$${item.price}

</p>

</div>

`;

});

}


/* ==========================
ANALYTICS AI DEMO
========================== */

function analyticsAI(){

const top =

menuData[0].name;

document.getElementById(

"topProduct"

).innerText=

top;

document.getElementById(

"peakOrders"

).innerText=

"19:00 PM";

document.getElementById(

"aiInsight"

).innerText=

"AI: Users prefer cheese + spicy combos.";

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

renderSmartSearch(
menuData
);

analyticsAI();