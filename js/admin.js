// Function to display accounts
function displayAccounts() {
  // Get the users from localStorage
  const users = JSON.parse(localStorage.getItem('users')) || [];

  // Get table body to insert rows
  const tableBody = document.querySelector('#accountsTable tbody');

  // Clear previous table rows
  tableBody.innerHTML = '';

  // Loop through the users and create a row for each one
  users.forEach(user => {
    const row = document.createElement('tr');

    const passwordCell = document.createElement('td');
    passwordCell.textContent = user.password;

    const usernameCell = document.createElement('td');
    usernameCell.textContent = user.username;

    const emailCell = document.createElement('td');
    emailCell.textContent = user.email;

    const actionCell = document.createElement('td');
    actionCell.innerHTML = `<button onclick="deleteAccount('${user.username}')">Delete</button>`;

    row.appendChild(usernameCell);
    row.appendChild(emailCell);
    row.appendChild(passwordCell);
    row.appendChild(actionCell);

    tableBody.appendChild(row);
  });
}

// Function to handle account deletion
function deleteAccount(username) {
  // Confirm before deleting
  const confirmation = confirm(`Are you sure you want to delete ${username}'s account?`);

  if (confirmation) {
    // Get existing users from localStorage
    let users = JSON.parse(localStorage.getItem('users')) || [];

    // Filter out the user to be deleted
    users = users.filter(user => user.username !== username);

    // Save the updated users list back to localStorage
    localStorage.setItem('users', JSON.stringify(users));

    // Re-render the table with updated data
    displayAccounts();
}
}
// Call displayAccounts on page load to show users from localStorage
window.onload = displayAccounts;
