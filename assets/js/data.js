/* ==========================
PRODUCT DATABASE
========================== */

const products = [

{
id:1,
name:"Luxury Burger",
category:"burger",
price:12,
rating:5,
image:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd"
},

{
id:2,
name:"Cheese Burger",
category:"burger",
price:15,
rating:4,
image:"https://images.unsplash.com/photo-1550547660-d9450f859349"
},

{
id:3,
name:"Italian Pizza",
category:"pizza",
price:18,
rating:5,
image:"https://images.unsplash.com/photo-1513104890138-7c749659a591"
},

{
id:4,
name:"Seafood Pizza",
category:"pizza",
price:22,
rating:4,
image:"https://images.unsplash.com/photo-1594007654729-407eedc4be65"
},

{
id:5,
name:"Premium Steak",
category:"steak",
price:35,
rating:5,
image:"https://images.unsplash.com/photo-1558030006-450675393462"
},

{
id:6,
name:"BBQ Steak",
category:"steak",
price:40,
rating:5,
image:"https://images.unsplash.com/photo-1544025162-d76694265947"
},

{
id:7,
name:"Coffee Latte",
category:"drink",
price:8,
rating:4,
image:"https://images.unsplash.com/photo-1495474472287-4d71bcdd2085"
},

{
id:8,
name:"Luxury Cocktail",
category:"drink",
price:14,
rating:5,
image:"https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b"
},

{
id:9,
name:"Chocolate Dessert",
category:"dessert",
price:10,
rating:4,
image:"https://images.unsplash.com/photo-1563729784474-d77dbb933a9e"
},

{
id:10,
name:"Ice Cream Special",
category:"dessert",
price:9,
rating:5,
image:"https://images.unsplash.com/photo-1570197788417-0e82375c9371"
},

{
id:11,
name:"Chicken Burger",
category:"burger",
price:16,
rating:5,
image:"https://images.unsplash.com/photo-1525059696034-4967a8e1dca2"
},

{
id:12,
name:"Orange Juice",
category:"drink",
price:7,
rating:4,
image:"https://images.unsplash.com/photo-1621506289937-a8e4df240d0b"
}

];


/* ==========================
LOCAL STORAGE INIT
========================== */

if(!localStorage.getItem("cart")){

localStorage.setItem(

"cart",

JSON.stringify([])

);

}

if(!localStorage.getItem("wishlist")){

localStorage.setItem(

"wishlist",

JSON.stringify([])

);

}