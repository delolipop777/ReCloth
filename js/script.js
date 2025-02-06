// Sidebar Toggle Functionality
const sidebar = document.getElementById("sidebar");
const hamburgerBtn = document.getElementById("menuToggle");
const mainContent = document.getElementById("mainContent");

hamburgerBtn.addEventListener("click", () => {
  if (sidebar.style.left === "0px") {
    sidebar.style.left = "-250px";
    mainContent.classList.remove("open-sidebar");
  } else {
    sidebar.style.left = "0px";
    mainContent.classList.add("open-sidebar");
  }
});

// Handle Login/Logout Logic
const loginSignupLink = document.getElementById("loginSignupLink");
const logoutLink = document.getElementById("logoutLink");
const welcomeMessage = document.getElementById("welcomeMessage");

window.onload = function () {
  const loggedInUser = localStorage.getItem("loggedInUser");

  if (loggedInUser) {
    loginSignupLink.style.display = "none";
    logoutLink.style.display = "inline";
    welcomeMessage.innerHTML = `<h1>Welcome, ${loggedInUser}!</h1><p>You're logged in. Use the menu to navigate through the app.</p>`;
  } else {
    loginSignupLink.style.display = "inline";
    logoutLink.style.display = "none";
    welcomeMessage.innerHTML = `<h1>Welcome to Clothing Resale!</h1><p>Sell your pre-loved clothes or find something new for your wardrobe.</p><p>Use the menu to navigate through the app!</p>`;
  }
};

logoutLink.addEventListener("click", function () {
  localStorage.removeItem("loggedInUser");
  loginSignupLink.style.display = "inline";
  logoutLink.style.display = "none";
  welcomeMessage.innerHTML = `<h1>Welcome to Clothing Resale!</h1><p>Sell your pre-loved clothes or find something new for your wardrobe.</p><p>Use the menu to navigate through the app!</p>`;
  window.location.href = "index.html";
});

// Populate Clothes from Local Storage
const clothesContainer = document.getElementById("clothesContainer");

window.addEventListener("DOMContentLoaded", function () {
  fetch('/clothes')
      .then(response => response.json())
      .then(clothesList => {
          const clothesContainer = document.getElementById("clothesContainer");

          if (clothesList.length === 0) {
              clothesContainer.innerHTML = `<p>No clothes available for sale. Click "Sell Your Clothes" to add some!</p>`;
              return;
          }

          clothesList.forEach((clothing, index) => {
              const clothingElement = document.createElement("div");
              clothingElement.classList.add("clothes-item");

              clothingElement.innerHTML = `
                  <img src="${clothing.image}" alt="${clothing.name}">
                  <h3>${clothing.name}</h3>
                  <p class="price">${clothing.price}</p>
                  <button class="buy-button" onclick="buyItem('${clothing._id}')">Buy</button>
              `;

              clothesContainer.appendChild(clothingElement);
          });
      })
      .catch(error => console.error('Error:', error));
});

function buyItem(id) {
  fetch(`/delete-clothing/${id}`, {
      method: 'DELETE'
  })
  .then(response => response.json())
  .then(data => {
      // Remove the item from the UI
      if (data.message === "Clothing deleted successfully!") {
          window.location.reload();
      }
  })
  .catch(error => console.error('Error:', error));
}

