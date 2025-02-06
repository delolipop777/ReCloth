// Get elements
function showPopup(message, redirectUrl = null, delay = 3000) {
  const popup = document.getElementById('popup');
  const popupMessage = document.getElementById('popupMessage');

  // Set the custom message in the pop-up
  popupMessage.textContent = message;

  // Add the "show" class to make the pop-up visible and slide it up
  popup.classList.add('show');

  // Automatically close the pop-up after the delay
  setTimeout(() => {
    popup.classList.remove('show');

    // If a redirect URL is provided, redirect after the delay
    if (redirectUrl) {
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 300); // Give a little time for the popup to hide before redirecting
    }
  }, delay);
}


// Close the pop-up when the close button is clicked
document.getElementById('popupCloseBtn').addEventListener('click', function () {
  const popup = document.getElementById('popup');
  popup.classList.remove('show');
});

const formContainer = document.getElementById("formContainer");
const toSignup = document.getElementById("toSignup");
const toLogin = document.getElementById("toLogin");

// Get input elements for signup and login
const signupUsername = document.getElementById("signupUsername");
const signupEmail = document.getElementById("signupEmail");
const signupPassword = document.getElementById("signupPassword");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");

// Buttons
const signupBtn = document.getElementById("signupBtn");
const loginBtn = document.getElementById("loginBtn");

// Function to show the pop-up with a custom message

// Switch to signup form
toSignup.addEventListener("click", () => {
  formContainer.style.transform = "translateX(-50%)"; // Show Signup form
});

// Switch to login form
toLogin.addEventListener("click", () => {
  formContainer.style.transform = "translateX(0)"; // Show Login form
});

// Sign Up logic
signupBtn.addEventListener("click", async () => {
  const username = signupUsername.value.trim();
  const email = signupEmail.value.trim();
  const password = signupPassword.value.trim();

  // Simple validation
  if (!username || !email || !password) {
    showPopup("Please fill in all fields!");
    return;
  }
  if (!validateEmail(email)) {
    showPopup("Please enter a valid email address.");
    return;
  }

  // Check if the email already exists (You can handle this with your backend instead)
  try {
    const response = await fetch('/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      showPopup("Sign Up successful!", "index.html", 3000);
      // Optionally, log in the user after signup
      localStorage.setItem("loggedInUser", email); // Store logged-in user's email
      window.location.href = "index.html"; // Redirect to the home page
    } else {
      showPopup(data.message);
    }
  } catch (error) {
    showPopup("Server error. Please try again later.");
    console.error(error);
  }
});

// Log In logic
// Log In logic
loginBtn.addEventListener("click", async () => {
  const username = loginUsername.value.trim(); // Use the correct input ID for username
  const password = loginPassword.value.trim();

  // Simple validation
  if (!username || !password) {
    showPopup("Please fill in all fields!");
    return;
  }

  // Send login request to backend
  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }), // Use 'username' here
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("loggedInUser", username); // Store logged-in user's username
      showPopup("Log In successful!", "index.html", 3000); // Redirect to index.html
    } else {
      showPopup(data.message); // Show error message from backend
    }
  } catch (error) {
    showPopup("Server error. Please try again later.");
    console.error(error);
  }
});



// Function to validate email
function validateEmail(email) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}
