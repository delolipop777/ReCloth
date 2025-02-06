document.getElementById('sellForm').addEventListener('submit', function(event) {
  event.preventDefault();

  // Get the form data
  const clothingName = document.getElementById('clothingName').value;
  const clothingDescription = document.getElementById('clothingDescription').value;
  const clothingPrice = document.getElementById('clothingPrice').value;
  const clothingImage = document.getElementById('clothingImage').value;

  // Create the clothing object
  const newClothing = {
      name: clothingName,
      description: clothingDescription,
      price: clothingPrice,
      image: clothingImage
  };

  // Send data to the backend
  fetch('/add-clothing', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(newClothing)
  })
  .then(response => response.json())
  .then(data => {
      // Redirect to the main page after successful submission
      if (data.message === "Clothing added successfully!") {
          window.location.href = 'index.html';
      }
  })
  .catch(error => console.error('Error:', error));
});
