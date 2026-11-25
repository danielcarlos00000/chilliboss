const products = [
 {id:"entrada-guacamole",name:"Guacamole com tortilhas",category:"Entradas",description:"Guacamole cremoso preparado com abacate, limão e temperos, acompanhado de tortilhas crocantes.",price:22.90,emoji:"🥑",tag:"Para compartilhar"},
 {id:"taco-carne",name:"Taco de Carne",category:"Tacos",description:"Carne bovina temperada, queijo, alface e pico de gallo.",price:19.90,emoji:"🌮",tag:"Favorito"},
 {id:"taco-frango",name:"Taco de Frango",category:"Tacos",description:"Frango desfiado temperado, queijo, alface e molho da casa.",price:18.90,emoji:"🌮",tag:"Clássico"},
 {id:"taco-vegetariano",name:"Taco Vegetariano",category:"Tacos",description:"Feijão, milho, queijo, alface e guacamole.",price:17.90,emoji:"🌮",tag:"Vegetariano"},
 {id:"burrito-carne",name:"Burrito de Carne",category:"Burritos",description:"Carne bovina, arroz, feijão, queijo e molho mexicano.",price:27.90,emoji:"🌯",tag:"Bem servido"},
 {id:"burrito-frango",name:"Burrito de Frango",category:"Burritos",description:"Frango temperado, arroz, feijão, queijo e pico de gallo.",price:25.90,emoji:"🌯",tag:"Queridinho"},
 {id:"burrito-vegetariano",name:"Burrito Vegetariano",category:"Burritos",description:"Feijão, arroz, milho, guacamole e vegetais.",price:24.90,emoji:"🌯",tag:"Vegetariano"},
 {id:"agua",name:"Água",category:"Bebidas",description:"Água mineral sem gás, bem gelada.",price:4.00,emoji:"💧",tag:"Geladinha"},
 {id:"refrigerante",name:"Refrigerante",category:"Bebidas",description:"Escolha entre Coca-Cola, Pepsi ou Sprite.",price:7.00,emoji:"🥤",tag:"Lata"},
 {id:"suco-natural",name:"Suco natural",category:"Bebidas",description:"Suco natural de manga ou laranja.",price:9.00,emoji:"🧃",tag:"Natural"},
 {id:"churros",name:"Churros",category:"Sobremesas",description:"Churros com recheio à sua escolha: doce de leite, Nutella ou Ninho.",price:15.90,emoji:"🥨",tag:"Docinho"},
 {id:"paleta-mexicana",name:"Paleta mexicana",category:"Sobremesas",description:"Sabores: morango com leite condensado, chocolate com chocolate, manga com leite condensado ou apimentado.",price:12.90,emoji:"🍦",tag:"Geladinha"}
];
const money = n => n.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
const get = key => JSON.parse(localStorage.getItem(key) || "null");
const set = (key,val) => localStorage.setItem(key,JSON.stringify(val));
let cart = get("chilliCart") || [];
let activeCategory = "Todos";
let selectedProduct = null;
let currentUser = get("chilliUser");
const grid = document.getElementById("productGrid");

function renderProducts(){
 const term=document.getElementById("productSearch").value.trim().toLocaleLowerCase("pt-BR");
 const filtered=products.filter(p=>(activeCategory==="Todos"||p.category===activeCategory)&&(`${p.name} ${p.description} ${p.category}`).toLocaleLowerCase("pt-BR").includes(term));
 grid.innerHTML=filtered.map(p=>`<article class="product-card"><div class="product-visual"><small>${p.tag}</small><span>${p.emoji}</span></div><div class="product-info"><h3>${p.name}</h3><p>${p.description}</p><div class="product-bottom"><strong class="price">${money(p.price)}</strong><button class="add-btn" data-add="${p.id}">+ Adicionar</button></div></div></article>`).join("");
 document.getElementById("emptyProducts").classList.toggle("hidden",filtered.length>0);
}
function showToast(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2300)}
function saveCart(){set("chilliCart",cart);renderCart();updateCount()}
function updateCount(){document.getElementById("cartCount").textContent=cart.reduce((s,i)=>s+i.quantity,0)}
function renderCart(){
 const container=document.getElementById("cartItems");
 if(!cart.length) container.innerHTML='<div class="empty-card">Sua sacola está esperando por você. 🌮</div>';
 else container.innerHTML=cart.map((item,index)=>`<article class="cart-item"><div class="cart-thumb">${item.emoji}</div><div><h3>${item.name}</h3><p>${money(item.unitPrice)} cada · ${money(item.unitPrice*item.quantity)}</p><details><summary>Ver JSON deste produto</summary><pre>${escapeHtml(JSON.stringify(item,null,2))}</pre></details></div><div class="cart-controls"><button data-minus="${index}" aria-label="Diminuir">−</button><strong>${item.quantity}</strong><button data-plus="${index}" aria-label="Aumentar">+</button><button class="remove-btn" data-remove="${index}" aria-label="Remover">×</button></div></article>`).join("");
 const subtotal=cart.reduce((s,i)=>s+i.unitPrice*i.quantity,0);
 document.getElementById("subtotal").textContent=money(subtotal);
 document.getElementById("total").textContent=money(subtotal+(cart.length?5:0));
 document.getElementById("cartJson").textContent=JSON.stringify(cart,null,2);
}
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function openCustom(id){
 selectedProduct=products.find(p=>p.id===id);if(!selectedProduct)return;
 document.getElementById("customTitle").textContent=selectedProduct.name;
 document.getElementById("customDescription").textContent=selectedProduct.description;
 document.getElementById("sauce").value="Suave";
 document.getElementById("protein").value="Original do produto";
 document.getElementById("notes").value="";
 document.getElementById("quantity").value=1;
 document.querySelectorAll('#customForm input[type="checkbox"]').forEach(c=>c.checked=false);
 document.getElementById("customModal").classList.remove("hidden");
}
function renderOrders(){
 const orders=get("chilliOrders")||[];
 document.getElementById("ordersList").innerHTML=orders.length?orders.map(o=>`<article class="order-card"><div><h3>Pedido #${o.id}</h3><p>${new Date(o.date).toLocaleString("pt-BR")} · ${o.items.length} item(ns) · ${money(o.total)}</p></div><span class="order-status">Recebido</span></article>`).join(""):'<div class="empty-card">Ainda não há pedidos por aqui. Que tal escolher seu primeiro taco? 🌮</div>';
}
function renderProfile(){
 const el=document.getElementById("profileCard");
 if(!currentUser){el.innerHTML='<div class="empty-card">Faça seu cadastro ou login para visualizar seus dados.</div>';return}
 el.innerHTML=`<div class="profile-data"><div><small>Nome</small><strong>${escapeHtml(currentUser.name)}</strong></div><div><small>E-mail</small><strong>${escapeHtml(currentUser.email)}</strong></div><div><small>CPF</small><strong>${escapeHtml(currentUser.cpf)}</strong></div><div><small>Telefone</small><strong>${escapeHtml(currentUser.phone)}</strong></div><div><small>CEP</small><strong>${escapeHtml(currentUser.cep)}</strong></div></div><button class="btn btn-outline btn-small" id="logoutBtn" style="margin-top:20px">Sair da conta</button>`;
}
function digits(v){return v.replace(/\D/g,"")}
function maskCpf(v){v=digits(v).slice(0,11);return v.replace(/(\d{3})(\d)/,"$1.$2").replace(/(\d{3})(\d)/,"$1.$2").replace(/(\d{3})(\d{1,2})$/,"$1-$2")}
function maskPhone(v){v=digits(v).slice(0,11);return v.replace(/^(\d{2})(\d)/,"($1) $2").replace(/(\d{5})(\d)/,"$1-$2")}
function maskCep(v){return digits(v).slice(0,8).replace(/(\d{5})(\d)/,"$1-$2")}

document.addEventListener("click",e=>{
 const add=e.target.closest("[data-add]");if(add)openCustom(add.dataset.add);
 const plus=e.target.closest("[data-plus]");if(plus){cart[+plus.dataset.plus].quantity=Math.min(20,cart[+plus.dataset.plus].quantity+1);saveCart()}
 const minus=e.target.closest("[data-minus]");if(minus){const i=+minus.dataset.minus;cart[i].quantity--;if(cart[i].quantity<1)cart.splice(i,1);saveCart()}
 const remove=e.target.closest("[data-remove]");if(remove){cart.splice(+remove.dataset.remove,1);saveCart()}
 if(e.target.dataset.close)document.getElementById("loginModal").classList.add("hidden");
 if(e.target.dataset.customClose)document.getElementById("customModal").classList.add("hidden");
});
grid.addEventListener("click",()=>{});
document.getElementById("productSearch").addEventListener("input",renderProducts);
document.getElementById("categoryFilters").addEventListener("click",e=>{const b=e.target.closest("[data-category]");if(!b)return;activeCategory=b.dataset.category;document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x===b));renderProducts()});
document.getElementById("customClose").onclick=()=>document.getElementById("customModal").classList.add("hidden");
document.getElementById("customForm").addEventListener("submit",e=>{
 e.preventDefault();if(!selectedProduct)return;
 const extras=[...document.querySelectorAll('#customForm input[type="checkbox"]:checked')].map(x=>x.value);
 const quantity=Math.max(1,Math.min(20,Number(document.getElementById("quantity").value)||1));
 const item={id:selectedProduct.id,name:selectedProduct.name,category:selectedProduct.category,emoji:selectedProduct.emoji,unitPrice:Number((selectedProduct.price+extras.length*3).toFixed(2)),quantity,customizations:{sauce:document.getElementById("sauce").value,protein:document.getElementById("protein").value,extras,notes:document.getElementById("notes").value.trim()},addedAt:new Date().toISOString()};
 const existing=cart.find(x=>x.id===item.id&&JSON.stringify(x.customizations)===JSON.stringify(item.customizations));
 if(existing)existing.quantity=Math.min(20,existing.quantity+quantity);else cart.push(item);
 saveCart();document.getElementById("customModal").classList.add("hidden");showToast("Produto adicionado à sua sacola!");
});
document.getElementById("exportJson").onclick=()=>{
 const blob=new Blob([JSON.stringify(cart,null,2)],{type:"application/json"});
 const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="chilli-boss-carrinho.json";a.click();URL.revokeObjectURL(url);
};
document.getElementById("checkoutBtn").onclick=()=>{
 if(!cart.length){showToast("Adicione pelo menos um produto primeiro.");return}
 const orders=get("chilliOrders")||[];const total=cart.reduce((s,i)=>s+i.unitPrice*i.quantity,0)+5;
 orders.unshift({id:Date.now().toString().slice(-7),date:new Date().toISOString(),items:cart,total});set("chilliOrders",orders);cart=[];saveCart();renderOrders();showToast("Pedido registrado! Obrigado, amigo.");
};
["regCpf","regPhone","regCep"].forEach(id=>document.getElementById(id).addEventListener("input",e=>{const f=id==="regCpf"?maskCpf:id==="regPhone"?maskPhone:maskCep;e.target.value=f(e.target.value)}));
document.getElementById("registerForm").addEventListener("submit",e=>{
 e.preventDefault();const user={name:document.getElementById("regName").value.trim(),email:document.getElementById("regEmail").value.trim().toLowerCase(),cpf:document.getElementById("regCpf").value,phone:document.getElementById("regPhone").value,cep:document.getElementById("regCep").value,password:document.getElementById("regPassword").value};
 if(digits(user.cpf).length!==11||digits(user.phone).length<10||digits(user.cep).length!==8){document.getElementById("registerFeedback").textContent="Confira CPF, telefone e CEP.";return}
 if(get("chilliUser")&&get("chilliUser").email!==user.email){document.getElementById("registerFeedback").textContent="Este navegador já possui uma conta cadastrada. Faça login.";return}
 set("chilliUser",user);currentUser=user;renderProfile();document.getElementById("registerFeedback").textContent="Cadastro realizado com sucesso!";showToast("Bem-vindo à Chilli Boss!");
});
document.getElementById("loginOpen").onclick=document.getElementById("loginOpen2").onclick=()=>document.getElementById("loginModal").classList.remove("hidden");
document.getElementById("loginClose").onclick=()=>document.getElementById("loginModal").classList.add("hidden");
document.getElementById("goRegister").onclick=()=>document.getElementById("loginModal").classList.add("hidden");
document.getElementById("loginForm").addEventListener("submit",e=>{
 e.preventDefault();const user=get("chilliUser");const email=document.getElementById("loginEmail").value.trim().toLowerCase();const pass=document.getElementById("loginPassword").value;
 if(user&&user.email===email&&user.password===pass){currentUser=user;renderProfile();document.getElementById("loginModal").classList.add("hidden");showToast("Login realizado!");}
 else document.getElementById("loginFeedback").textContent="E-mail ou senha incorretos. Cadastre-se primeiro se ainda não tiver conta.";
});
document.getElementById("profileCard").addEventListener("click",e=>{if(e.target.id==="logoutBtn"){currentUser=null;renderProfile();showToast("Você saiu da sua conta.")}});
document.getElementById("themeToggle").onclick=()=>{
 const dark=document.documentElement.dataset.theme!=="dark";document.documentElement.dataset.theme=dark?"dark":"light";localStorage.setItem("chilliTheme",dark?"dark":"light");document.getElementById("themeToggle").textContent=dark?"☀":"☾";
};
const savedTheme=localStorage.getItem("chilliTheme")||"light";document.documentElement.dataset.theme=savedTheme;document.getElementById("themeToggle").textContent=savedTheme==="dark"?"☀":"☾";
document.getElementById("menuToggle").onclick=()=>document.getElementById("mainNav").classList.toggle("open");
document.querySelectorAll("#mainNav a").forEach(a=>a.addEventListener("click",()=>document.getElementById("mainNav").classList.remove("open")));
document.querySelectorAll(".nav-link").forEach(a=>a.addEventListener("click",()=>{document.querySelectorAll(".nav-link").forEach(x=>x.classList.remove("active"));a.classList.add("active")}));
renderProducts();renderCart();renderOrders();renderProfile();updateCount();
