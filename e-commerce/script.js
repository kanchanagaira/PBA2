const products = [
    { id: 1, name: "Blue T-shirt", price: 499 },
    { id: 2, name: "Classic Jeans", price: 999 },
    { id: 3, name: "Sneakers", price: 1499 },
    { id: 4, name: "Jacket", price: 1299 }
  ];
  
  let currentUser = null;
  
  function showSection(section) {
    document.querySelectorAll('.container > div').forEach(div => div.classList.add('hidden'));
    if (section === 'home') renderProducts();
    if (section === 'wishlist') renderWishlist();
    if (section === 'orders') renderOrders();
    document.getElementById(section).classList.remove('hidden');
  }
  
  function register() {
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    if (!username || !password) return showMessage("Please fill all fields");
  
    if (localStorage.getItem(`user_${username}`)) {
      return showMessage("User already exists. Try logging in.");
    }
    const userData = { password, wishlist: [], orders: [] };
    localStorage.setItem(`user_${username}`, JSON.stringify(userData));
    showMessage("Registered! You can now log in.");
  }
  
  function login() {
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    const userData = localStorage.getItem(`user_${username}`);
    if (!userData) return showMessage("User not found.");
    
    const user = JSON.parse(userData);
    if (user.password !== password) return showMessage("Incorrect password.");
    
    currentUser = username;
    document.getElementById("auth").classList.add("hidden");
    showSection('home');
  }
  
  function logout() {
    currentUser = null;
    document.getElementById("auth").classList.remove("hidden");
    document.querySelectorAll('.container > div').forEach(div => div.classList.add('hidden'));
  }
  
  function showMessage(msg) {
    document.getElementById("authMessage").innerText = msg;
  }
  
  function getUserData() {
    return JSON.parse(localStorage.getItem(`user_${currentUser}`));
  }
  
  function saveUserData(data) {
    localStorage.setItem(`user_${currentUser}`, JSON.stringify(data));
  }
  
  function renderProducts() {
    const container = document.getElementById("productList");
    container.innerHTML = "";
    products.forEach(p => {
      const div = document.createElement("div");
      div.className = "product";
      div.innerHTML = `
        <div>
          <h3>${p.name}</h3>
          <p>Price: ₹${p.price}</p>
        </div>
        <div class="actions">
          <button onclick="addToWishlist(${p.id})">Add to Wishlist</button>
          <button onclick="buyNow(${p.id})">Buy Now</button>
        </div>
      `;
      container.appendChild(div);
    });
  }
  
  function addToWishlist(id) {
    const user = getUserData();
    if (!user.wishlist.includes(id)) {
      user.wishlist.push(id);
      saveUserData(user);
      alert("Added to wishlist!");
    } else {
      alert("Already in wishlist.");
    }
  }
  
  function renderWishlist() {
    const user = getUserData();
    const items = user.wishlist.map(id => products.find(p => p.id === id));
    const container = document.getElementById("wishlistItems");
    container.innerHTML = items.length ? "" : "<p>No items in wishlist.</p>";
    items.forEach(p => {
      const div = document.createElement("div");
      div.className = "product";
      div.innerHTML = `
        <div>
          <h3>${p.name}</h3>
          <p>Price: ₹${p.price}</p>
        </div>
        <div class="actions">
          <button onclick="buyNow(${p.id})">Buy Now</button>
        </div>
      `;
      container.appendChild(div);
    });
  }
  
  function buyNow(id) {
    const user = getUserData();
    user.orders.push({ id, date: new Date().toLocaleString() });
    saveUserData(user);
    alert("Purchased successfully!");
  }
  
  function renderOrders() {
    const user = getUserData();
    const container = document.getElementById("orderHistory");
    container.innerHTML = user.orders.length ? "" : "<p>No orders yet.</p>";
    user.orders.forEach(order => {
      const p = products.find(p => p.id === order.id);
      const div = document.createElement("div");
      div.className = "product";
      div.innerHTML = `
        <div>
          <h3>${p.name}</h3>
          <p>Price: ₹${p.price}</p>
          <p>Ordered on: ${order.date}</p>
        </div>
      `;
      container.appendChild(div);
    });
  }
  
  function searchProducts() {
    const query = document.getElementById('searchBar').value.toLowerCase();
    const productList = document.getElementById('productList');
    const products = productList.querySelectorAll('.product-item'); // Assuming products have a class "product-item"
  
    products.forEach(product => {
      const productName = product.textContent.toLowerCase();
      if (productName.includes(query)) {
        product.style.display = 'block';
      } else {
        product.style.display = 'none';
      }
    });
  }
  
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
