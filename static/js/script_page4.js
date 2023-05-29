function submitForm() {
  const firstName = document.querySelector('input[name="name"]').value;
  const lastName = document.querySelector('input[name="surname"]').value;
  const email = document.querySelector('input[name="email"]').value;
  const password = document.querySelector('input[name="password"]').value;
  const confirmPassword = document.querySelector('input[name="confirm_password"]').value;

  const userData = {
    firstName: firstName,
    lastName: lastName,
    username: email,
    password: password,
    confirmPassword: confirmPassword
  };

  fetch('/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert(data.message);
        window.location.href = '/';
      } else {
        alert(data.message);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function handleFormSubmit(event) {
  event.preventDefault();
  submitForm();
}

const form = document.querySelector('form');
if (form) {
  form.addEventListener('submit', handleFormSubmit);
}