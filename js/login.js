const loginButton = document.getElementById("loginButton");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

loginButton.addEventListener("click", function () {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  let users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(user => user.email === username && user.password === password);

  if (user) {
    localStorage.setItem("loggedInUser", user.email);
    window.location.href = "index.html";  // Redirect to homepage or dashboard
  } else {
    alert("Invalid username or password.");
  }
});
