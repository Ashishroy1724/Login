// checkAuth.js

// Fetch the user authentication status
fetch("/checkAuth")
  .then(response => response.json())
  .then(data => {
    // Check if the user is authenticated
    if (data.isAuthenticated) {
      // If authenticated, update the login button link to signup_successful.html
      document.getElementById("loginButton").innerHTML = '<a href="signup_successful.html">Signup Successful</a>';
    }
  })
  .catch(error => console.error('Error:', error));
