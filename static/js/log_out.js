function logout() {
    fetch('/log_out')
      .then(response => {
        if (response.ok) {
          console.log('Logout successful');
          window.location.href = '/';
        } else {
          console.error('Logout failed');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }