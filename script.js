/*
  Easy Bazar storefront
  Edit the PRODUCTS list below to add, remove, or change products.
  This is a static website: orders are sent to WhatsApp; there is no online payment/backend.
*/
const WHATSAPP_NUMBER = "8801516126330"; // Country code + number, digits only.

const PRODUCTS = [
  {id:1, name:"প্রিমিয়াম শপিং ব্যাগ", category:"দৈনন্দিন", price:120, emoji:"🛍️", tag:"জনপ্রিয়", description:"দৈনন্দিন কেনাকাটার জন্য ব্যবহার উপযোগী।"},
  {id:2, name:"স্টাইলিশ পানির বোতল", category:"লাইফস্টাইল", price:250, emoji:"🧴", tag:"নতুন", description:"বাইরে বা অফিসে সঙ্গে রাখুন।"},
  {id:3, name:"হোম স্টোরেজ বক্স", category:"ঘর ও রান্নাঘর", price:350, emoji:"📦", tag:"", description:"ছোটখাটো জিনিস গুছিয়ে রাখতে সহায়ক।"},
  {id:4, name:"ক্যাজুয়াল টি-শার্ট", category:"ফ্যাশন", price:450, emoji:"👕", tag:"জনপ্রিয়", description:"আরামদায়ক দৈনন্দিন পোশাক।"},
  {id:5, name:"কিচেন মগ সেট", category:"ঘর ও রান্নাঘর", price:320, emoji:"☕", tag:"", description:"চা-কফির সময়ের জন্য সুন্দর মগ।"},
  {id:6, name:"মিনি ডেস্ক ল্যাম্প", category:"ইলেকট্রনিক্স", price:590, emoji:"💡", tag:"নতুন", description:"পড়ার টেবিল বা কাজের জায়গার জন্য।"},
  {id:7, name:"ফ্যাশন ব্যাকপ্যাক", category:"ফ্যাশন", price:780, emoji:"🎒", tag:"", description:"প্রতিদিনের ব্যবহার ও ভ্রমণের জন্য।"},
  {id:8, name:"স্কিন কেয়ার পাউচ", category:"লাইফস্টাইল", price:190, emoji:"🧼", tag:"", description:"প্রয়োজনীয় ছোট জিনিস একসঙ্গে রাখুন।"}
];

const state = { category: "all", query: "", cart: {} };
const $ = (id) => document.getElementById(id);
const taka = (amount) => "৳" + Number(amount).toLocaleString("bn-BD");

function initCategories() {
  const categories = [...new Set(PRODUCTS.map(p => p.category))];
  $("categoryFilter").innerHTML = '<option value="all">সব ক্যাটাগরি</option>' +
    categories.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join("");
  $("categoryChips").innerHTML = ["all", ...categories].map(c =>
    `<button class="chip ${c === state.category ? "active" : ""}" data-category="${escapeHtml(c)}">${c === "all" ? "সব পণ্য" : escapeHtml(c)}</button>`
  ).join("");
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  }[char]));
}

function renderProducts() {
  const query = state.query.trim().toLocaleLowerCase();
  const products = PRODUCTS.filter(p =>
    (state.category === "all" || p.category === state.category) &&
    [p.name, p.category, p.description].some(v => v.toLocaleLowerCase().includes(query))
  );
  $("productGrid").innerHTML = products.map(p => `
    <article class="product-card">
      <div class="product-visual"><span class="product-emoji" aria-hidden="true">${p.emoji}</span>
        ${p.tag ? `<span class="product-tag">${escapeHtml(p.tag)}</span>` : ""}
      </div>
      <div class="product-info">
        <span class="product-category">${escapeHtml(p.category)}</span>
        <h3>${escapeHtml(p.name)}</h3><p>${escapeHtml(p.description)}</p>
        <div class="product-bottom"><strong class="price">${taka(p.price)}</strong>
          <button class="add-button" data-add="${p.id}" aria-label="${escapeHtml(p.name)} তালিকায় যোগ করুন">+</button>
        </div>
      </div>
    </article>`).join("");
  $("emptyState").hidden = products.length !== 0;
}

function renderCart() {
  const ids = Object.keys(state.cart).filter(id => state.cart[id] > 0);
  const count = ids.reduce((sum, id) => sum + state.cart[id], 0);
  const total = ids.reduce((sum, id) => {
    const p = PRODUCTS.find(product => product.id === Number(id));
    return sum + (p ? p.price * state.cart[id] : 0);
  }, 0);
  $("cartCount").textContent = count.toLocaleString("bn-BD");
  $("cartTotal").textContent = taka(total);
  $("cartItems").innerHTML = ids.length ? ids.map(id => {
    const p = PRODUCTS.find(product => product.id === Number(id));
    if (!p) return "";
    return `<div class="cart-row">
      <div><span class="cart-product-name">${escapeHtml(p.name)}</span><small>${taka(p.price)} × ${state.cart[id].toLocaleString("bn-BD")}</small></div>
      <div class="quantity-control"><button data-change="${id}" data-delta="-1" aria-label="একটি কমান">−</button><b>${state.cart[id].toLocaleString("bn-BD")}</b><button data-change="${id}" data-delta="1" aria-label="একটি বাড়ান">+</button></div>
      <strong class="cart-line-total">${taka(p.price * state.cart[id])}</strong>
    </div>`;
  }).join("") : '<p class="cart-empty">এখনো কোনো পণ্য যোগ করা হয়নি। পণ্য থেকে + বাটনে চাপ দিন।</p>';
}

$("productGrid").addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (!button) return;
  const id = button.dataset.add;
  state.cart[id] = (state.cart[id] || 0) + 1;
  renderCart();
  $("cart").scrollIntoView({behavior:"smooth", block:"nearest"});
});
$("cartItems").addEventListener("click", event => {
  const button = event.target.closest("[data-change]");
  if (!button) return;
  const id = button.dataset.change;
  state.cart[id] = (state.cart[id] || 0) + Number(button.dataset.delta);
  if (state.cart[id] <= 0) delete state.cart[id];
  renderCart();
});
$("clearCart").addEventListener("click", () => { state.cart = {}; renderCart(); });
$("checkoutButton").addEventListener("click", () => {
  const ids = Object.keys(state.cart).filter(id => state.cart[id] > 0);
  if (!ids.length) { alert("অর্ডার করার আগে অন্তত একটি পণ্য যোগ করুন।"); return; }
  let total = 0;
  const lines = ids.map(id => {
    const p = PRODUCTS.find(product => product.id === Number(id));
    const subtotal = p.price * state.cart[id];
    total += subtotal;
    return `• ${p.name} — ${state.cart[id]} টি × ${taka(p.price)} = ${taka(subtotal)}`;
  });
  const message = `আসসালামু আলাইকুম, Easy Bazar থেকে অর্ডার করতে চাই।\n\n${lines.join("\n")}\n\nআনুমানিক পণ্যমূল্য: ${taka(total)}\n\nআমার নাম:\nডেলিভারি ঠিকানা:\nমোবাইল নম্বর:\n\nদয়া করে স্টক, ডেলিভারি চার্জ ও চূড়ান্ত মূল্য নিশ্চিত করবেন।`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
});
$("searchInput").addEventListener("input", event => { state.query = event.target.value; renderProducts(); });
$("categoryFilter").addEventListener("change", event => { state.category = event.target.value; initCategories(); renderProducts(); });
$("categoryChips").addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  state.category = button.dataset.category;
  $("categoryFilter").value = state.category;
  initCategories(); renderProducts();
});
$("menuToggle").addEventListener("click", () => {
  const nav = $("mainNav");
  const open = nav.classList.toggle("open");
  $("menuToggle").setAttribute("aria-expanded", String(open));
});
$("mainNav").addEventListener("click", event => {
  if (event.target.closest("a")) {
    $("mainNav").classList.remove("open");
    $("menuToggle").setAttribute("aria-expanded", "false");
  }
});
$("year").textContent = new Date().getFullYear();
initCategories();
renderProducts();
renderCart();
