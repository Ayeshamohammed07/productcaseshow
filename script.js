let cart = JSON.parse(localStorage.getItem("cart")) || [];
 let total = JSON.parse(localStorage.getItem("total")) || 0; 
 let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
// Initialize UI
updateCart();
updateWishlistCount();

function showToast(message) {
    let toast = document.getElementById("toast");
    toast.innerText = message;
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}

function showDetails(name, desc, price, img) {
    const popup = document.getElementById("popup");
    popup.style.display = "flex";

    document.getElementById("popup-title").innerText = name;
    document.getElementById("popup-desc").innerText = desc;
    document.getElementById("popup-price").innerText = price;
    document.getElementById("popup-img").src = "assets/"+img;

    // Reset buttons to remove old event listeners
    const addBtn = document.getElementById("add-cart-btn");
    const buyBtn = document.getElementById("buy-now-btn");
    const newAddBtn = addBtn.cloneNode(true);
    const newBuyBtn = buyBtn.cloneNode(true);

    addBtn.parentNode.replaceChild(newAddBtn, addBtn);
    buyBtn.parentNode.replaceChild(newBuyBtn, buyBtn);

    newAddBtn.onclick = () => addToCart(name, price);
    newBuyBtn.onclick = () => buyNow(name, price);
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
}

// --- BUY NOW & CHECKOUT LOGIC ---
let currentBuyProduct = "";
let currentBuyPrice = "";

function buyNow(name, price) {
    currentBuyProduct = name;
    currentBuyPrice = price;
    document.getElementById("checkout-product").innerText = name;
    document.getElementById("checkout-price").innerText = price;
    document.getElementById("checkout-popup").style.display = "flex";
}

function checkout() {
    if (cart.length === 0) {
        showToast("🛒 Your cart is empty!");
        return;
    }
    currentBuyProduct = "Cart Items (" + cart.length + ")";
    currentBuyPrice = "₹" + total;
    document.getElementById("checkout-product").innerText = currentBuyProduct;
    document.getElementById("checkout-price").innerText = currentBuyPrice;
    document.getElementById("checkout-popup").style.display = "flex";
}

function closeCheckout() {
    document.getElementById("checkout-popup").style.display = "none";
}

function placeOrder() {
    let name = document.getElementById("customer-name").value;
    let phone = document.getElementById("customer-phone").value;
    let address = document.getElementById("customer-address").value;

    if (!name || !phone || !address) {
        showToast("⚠️ Please fill all details");
        return;
    }

    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    let newOrder = {
        product: currentBuyProduct,
        total: parseInt(currentBuyPrice.replace(/[^\d]/g, "")),
        name: name,
        phone: phone,
        address: address,
        time: new Date().toLocaleString()
    };

    orders.push(newOrder);
    localStorage.setItem("orders", JSON.stringify(orders));

    // Clear cart if they bought from cart
    if (currentBuyProduct.includes("Cart Items")) {
        cart = [];
        total = 0;
        saveCart();
        updateCart();
    }

    closeCheckout();
    document.getElementById("order-success").style.display = "flex";
}

function closeOrderSuccess() {
    document.getElementById("order-success").style.display = "none";
}

// --- CART LOGIC ---
function addToCart(name, price) {
    let numericPrice = parseInt(price.replace(/[^\d]/g, ""));
    cart.push({ product: name, price: numericPrice });
    total += numericPrice;
    saveCart();
    updateCart();
    showToast("✅ " + name + " added to cart!");
    closePopup();
}

function removeItem(index) {
    total -= cart[index].price;
    cart.splice(index, 1);
    saveCart();
    updateCart();
    openCart(); // Refresh view
}

function updateCart() {
    document.getElementById("cart-count").innerText = cart.length;
    document.getElementById("cart-total").innerText = "₹" + total;
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("total", JSON.stringify(total));
}

function openCart() {
    let cartItems = document.getElementById("cart-items");
    cartItems.innerHTML = "";
    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Your cart is empty</p>";
    } else {
        cart.forEach((item, index) => {
            cartItems.innerHTML += `
                <div class="cart-row">
                    <span>${item.product}</span>
                    <span>₹${item.price}</span>
                    <button onclick="removeItem(${index})">❌</button>
                </div>`;
        });
    }
    document.getElementById("cart-box").style.display = "block";
}

function closeCartBox() {
    document.getElementById("cart-box").style.display = "none";
}

// --- WISHLIST LOGIC ---
function addToWishlist(event, name) {
    event.stopPropagation(); // Prevents opening product details
    if (!wishlist.includes(name)) {
        wishlist.push(name);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        updateWishlistCount();
        showToast("❤️ Added to Wishlist!");
    } else {
        showToast("Already in Wishlist!");
    }
}

function updateWishlistCount() {
    document.getElementById("wishlist-count").innerText = wishlist.length;
}

function openWishlist() {
    let box = document.getElementById("wishlist-items");
    box.innerHTML = wishlist.length === 0 ? "<p>Wishlist is empty</p>" : "";
    wishlist.forEach((item, i) => {
        box.innerHTML += `<div class="cart-row"><span>${item}</span><button onclick="removeWish(${i})">❌</button></div>`;
    });
    document.getElementById("wishlist-box").style.display = "block";
}

function removeWish(i) {
    wishlist.splice(i, 1);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    updateWishlistCount();
    openWishlist();
}

function closeWishlistBox() {
    document.getElementById("wishlist-box").style.display = "none";
}

// --- SEARCH & FILTER ---
function searchProducts() {
    let input = document.getElementById("searchInput").value.toLowerCase();
    let cards = document.getElementsByClassName("card");
    for (let card of cards) {
        let title = card.getElementsByTagName("h3")[0].innerText.toLowerCase();
        card.style.display = title.includes(input) ? "block" : "none";
    }
}

function filterProducts(category) {
    let cards = document.getElementsByClassName("card");
    let buttons = document.querySelectorAll(".category-buttons button");

    // remove active class from all buttons
    buttons.forEach(btn => btn.classList.remove("active"));

    // add active to clicked button
    event.target.classList.add("active");

    for (let card of cards) {
        if (category === 'all' || card.classList.contains(category)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    }
}
function subscribeNewsletter() {
    let email = document.getElementById("newsletter-email").value;
    if (email.includes("@")) {
        showToast("📧 Subscribed! Check your email for 10% OFF.");
        document.getElementById("newsletter-email").value = "";
    } else {
        showToast("⚠️ Enter a valid email.");
    }
}