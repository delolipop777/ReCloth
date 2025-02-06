// load-navbar-sidebar.js
window.onload = function () {
    const placeholder = document.getElementById('navbar-sidebar-placeholder');
    fetch('navbar.html')
      .then(response => response.text())
      .then(data => {
        placeholder.innerHTML = data;
        updateNavbarSidebar();
      });
  };
  
  function updateNavbarSidebar() {
    const loggedInUser = localStorage.getItem("loggedInUser");
  
    const loginSignupLink = document.getElementById("loginSignupLink");
    const logoutLink = document.getElementById("logoutLink");
    const profileLink = document.getElementById("profileLink");
  
    if (loggedInUser) {
      // User is logged in
      loginSignupLink.style.display = "none";  // Hide Log In / Sign Up
      logoutLink.style.display = "block";      // Show Log Out
      profileLink.style.display = "block";     // Show Profile link
    } else {
      // User is not logged in
      loginSignupLink.style.display = "block"; // Show Log In / Sign Up
      logoutLink.style.display = "none";       // Hide Log Out
      profileLink.style.display = "none";      // Hide Profile link
    }
  }
  
  // JavaScript for Hamburger Menu Toggle
document.getElementById('menuToggle').addEventListener('click', function () {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    
    // Toggle the sidebar's open/close state
    sidebar.classList.toggle('open');
    
    // Toggle the main content's shifted state (if needed)
    mainContent.classList.toggle('shifted');
  });
  
  