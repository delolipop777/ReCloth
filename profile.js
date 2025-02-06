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
function goBack() {
  window.location.href = "index.html"; // Redirect to index.html or any other page
}
document.addEventListener('DOMContentLoaded', function () {
  // Select elements
  const formContainer = document.querySelector('.form-container');
  const passwordChangeForm = document.querySelector('.password-change-form');
  const deleteAccountForm = document.querySelector('.delete-account-form');
  const goToDeleteAccountBtn = document.querySelector('.delete-account-btn');
  const backToPasswordBtn = document.querySelector('.password-change-btn');
  const changePasswordBtn = document.querySelector('.change-password-btn');
  const confirmDeleteBtn = document.querySelector('.account-delete-btn');
  passwordChangeForm.classList.add('active'); // Make password change form visible
  deleteAccountForm.classList.remove('active');
  // Debugging logs
  if (!formContainer) console.error('Form container not found');
  if (!passwordChangeForm) console.error('Password change form not found');
  if (!deleteAccountForm) console.error('Delete account form not found');

  // Redirect if user is not logged in
  const loggedInUser = localStorage.getItem('loggedInUser');
  if (!loggedInUser) {
    window.location.href = 'signup.html';
    return;
  }

  // Handle navigation
  if (goToDeleteAccountBtn) {
    goToDeleteAccountBtn.addEventListener('click', function () {
      formContainer.style.transform = 'translateX(-50%)';
      passwordChangeForm.classList.remove('active');
      deleteAccountForm.classList.add('active');
    });
  }

  if (backToPasswordBtn) {
    backToPasswordBtn.addEventListener('click', function () {
      formContainer.style.transform = 'translateX(0)';
      deleteAccountForm.classList.remove('active');
      passwordChangeForm.classList.add('active');
    });
  }

  // Handle password change
  changePasswordBtn.addEventListener('click', async function () {
    const oldPassword = document.getElementById('oldPassword').value.trim();
    const newPassword = document.getElementById('newPassword').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();

    if (newPassword !== confirmPassword) {
        showPopup('Passwords do not match');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/change-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: localStorage.getItem('loggedInUser'),
                oldPassword,
                newPassword,
            }),
        });

        const data = await response.json();
        if (response.ok) {
            showPopup(data.message);
        } else {
            showPopup(data.message);
        }
    } catch (error) {
        console.error(error);
        showPopup('An error occurred. Please try again later.');
    }
});


  // Handle account deletion
  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', async function () {
      const confirmation = document.getElementById('confirmation').value.trim();
  
      if (confirmation !== 'DELETE') {
          showPopup('Type DELETE to confirm account deletion');
          return;
      }
  
      try {
          const response = await fetch('http://localhost:5000/delete-account', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ username: localStorage.getItem('loggedInUser') }),
          });
  
          const data = await response.json();
          if (response.ok) {
              showPopup(data.message);
              localStorage.removeItem('loggedInUser');
              setTimeout(() => {
                  window.location.href = 'signup.html';
              }, 3000);
          } else {
              showPopup(data.message);
          }
      } catch (error) {
          console.error(error);
          showPopup('An error occurred. Please try again later.');
      }
  });
  
}
  
});