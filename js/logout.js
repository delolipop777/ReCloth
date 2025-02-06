const logoutButton = document.getElementById("logoutLink");

logoutButton.addEventListener("click", function () {
  localStorage.removeItem("loggedInUser");  // Remove user info from localStorage
  window.location.href = "index.html";      // Redirect to homepage or login page
});
