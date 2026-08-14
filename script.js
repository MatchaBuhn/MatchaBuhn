const products = [
  {id:1,name:"MatchaBuhn Bunny Hoodie",price:45.99,art:"🐰🍵",desc:"A cozy hoodie for your matcha era.",sizes:["S","M","L","XL"],new:true},
  {id:2,name:"Matcha Bunny Crewneck",price:39.99,art:"🐇💚",desc:"Soft, simple, and extra cute.",sizes:["S","M","L","XL"],new:true},
  {id:3,name:"Cozy Matcha Sweater",price:42.99,art:"🐰🌸",desc:"A pastel sweater made for cozy days.",sizes:["S","M","L","XL"],new:false},
  {id:4,name:"MatchaBuhn Zip Hoodie",price:48.99,art:"🍵🐰",desc:"A comfy zip-up with MatchaBuhn vibes.",sizes:["S","M","L","XL"],new:false}
];

let cart = JSON.parse(localStorage.getItem("matchabuhn-cart") || "[]");

const $ = id => document.getElementById(id);
const money = n => `$${n.toFixed(2)}`;

function saveCart(){ localStorage.setItem("matchabuhn-cart", JSON.stringify(cart)); renderCart(); }

function renderProducts(list=products){
  const grid = $("productGrid");
  if(!list.length){
    grid.innerHTML = '<div class="no-results"><div style="font-size:60px">🐰</div><h3>No cuties found!</h3><p>Try another search.</p></div>';
    return;
  }
  grid.innerHTML = list.map(p => `
    <article class="product-card">
      <button class="product-image" data-product="${p.id}" aria-label="View ${p.name}">
        <span class="art">${p.art}</span>${p.new?'<span class="new-badge">NEW</span>':''}
      </button>
      <div class="product-info">
        <h3>${p.name}</h3><span class="price">${money(p.price)}</span>
        <button class="quick" data-product="${p.id}" aria-label="Add ${p.name} to cart">♡</button>
      </div>
    </article>`).join("");

  grid.querySelectorAll("[data-product]").forEach(el => {
    el.addEventListener("click", e => {
      const id = Number(e.currentTarget.dataset.product);
      openProduct(id);
    });
  });
}

function openProduct(id){
  const p = products.find(x=>x.id===id);
  $("dialogContent").innerHTML = `
    <div class="dialog-inner">
      <div class="dialog-art">${p.art}</div>
      <div class="dialog-info">
        <h2>${p.name}</h2>
        <div class="dialog-price">${money(p.price)}</div>
        <p>${p.desc}</p>
        <label>Size</label>
        <select id="sizeSelect">${p.sizes.map(s=>`<option>${s}</option>`).join("")}</select>
        <button class="button pink" id="addDialog">ADD TO CART ♡</button>
      </div>
    </div>`;
  $("productDialog").showModal();
  $("addDialog").onclick = () => {
    addToCart(p.id, $("sizeSelect").value);
    $("productDialog").close();
    openCart();
  };
}

function addToCart(id,size="M"){
  const existing = cart.find(x=>x.id===id && x.size===size);
  if(existing) existing.qty++;
  else cart.push({id,size,qty:1});
  saveCart();
}

function changeQty(id,size,delta){
  const item=cart.find(x=>x.id===id&&x.size===size);
  if(!item)return;
  item.qty+=delta;
  if(item.qty<=0) cart=cart.filter(x=>!(x.id===id&&x.size===size));
  saveCart();
}

function renderCart(){
  $("cartCount").textContent=cart.reduce((sum,x)=>sum+x.qty,0);
  const box=$("cartItems");
  if(!cart.length){
    box.innerHTML='<div style="text-align:center;padding:70px 10px"><div style="font-size:70px">🐰</div><h3>Your cart is empty ♡</h3><p>Add something cute!</p></div>';
  }else{
    box.innerHTML=cart.map(item=>{
      const p=products.find(x=>x.id===item.id);
      return `<div class="cart-item">
        <div class="cart-art">${p.art}</div>
        <div><h4>${p.name}</h4><p>${money(p.price)}</p><div class="qty">
          <button data-action="minus" data-id="${p.id}" data-size="${item.size}">−</button><span>${item.qty}</span>
          <button data-action="plus" data-id="${p.id}" data-size="${item.size}">+</button><span>· ${item.size}</span>
        </div></div>
        <button class="remove" data-action="remove" data-id="${p.id}" data-size="${item.size}">Remove</button>
      </div>`;
    }).join("");
  }
  const total=cart.reduce((sum,item)=>{
    const p=products.find(x=>x.id===item.id); return sum+p.price*item.qty;
  },0);
  $("cartTotal").textContent=money(total);
  box.querySelectorAll("[data-action]").forEach(btn=>{
    btn.onclick=()=>{
      const id=Number(btn.dataset.id),size=btn.dataset.size,action=btn.dataset.action;
      if(action==="plus")changeQty(id,size,1);
      if(action==="minus")changeQty(id,size,-1);
      if(action==="remove")changeQty(id,size,-999);
    };
  });
}

function openCart(){ $("cartDrawer").classList.add("open"); $("overlay").classList.add("open"); document.body.classList.add("locked"); }
function closeCart(){ $("cartDrawer").classList.remove("open"); $("overlay").classList.remove("open"); document.body.classList.remove("locked"); }

$("cartButton").onclick=openCart;
$("closeCart").onclick=closeCart;
$("overlay").onclick=closeCart;
$("closeDialog").onclick=()=> $("productDialog").close();

$("searchButton").onclick=()=>{
  $("searchRow").classList.toggle("open");
  if($("searchRow").classList.contains("open")) $("searchInput").focus();
};
$("searchInput").addEventListener("input",e=>{
  const q=e.target.value.toLowerCase().trim();
  renderProducts(products.filter(p=>`${p.name} ${p.desc}`.toLowerCase().includes(q)));
});
$("viewAll").onclick=()=>{ $("searchInput").value=""; $("searchRow").classList.add("open"); renderProducts(products); $("shop").scrollIntoView({behavior:"smooth"}); };

$("menuButton").onclick=()=> $("nav").classList.toggle("open");
document.querySelectorAll(".nav a").forEach(a=>a.addEventListener("click",()=> $("nav").classList.remove("open")));

$("contactForm").addEventListener("submit",e=>{
  e.preventDefault();
  const data=new FormData(e.target);
  const subject=encodeURIComponent("MatchaBuhn website message");
  const body=encodeURIComponent(`Name: ${data.get("name")}\nEmail: ${data.get("email")}\n\n${data.get("message")}`);
  window.location.href=`mailto:YOUR-EMAIL@example.com?subject=${subject}&body=${body}`;
});

$("checkoutButton").onclick=()=>{
  if(!cart.length){alert("Your cart is empty ♡");return;}
  alert("Your cart is ready! To accept real payments, connect a payment provider before launch.");
};

$("year").textContent=new Date().getFullYear();
renderProducts();
renderCart();
