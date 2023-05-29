const commentForm = document.getElementById('comment-form');
commentForm.addEventListener('submit', event => {
  event.preventDefault();

  const commentInput = document.getElementById('comment');
  const comment = commentInput.value;

  // Clear form inputs
  commentInput.value = '';

  // Send comment to the server
  fetch(window.location.pathname + '/comment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ comment })
  })
    .then(response => response.json())
    .then(newComment => {
      const commentsContainer = document.getElementById('comments-container');

      const commentElement = document.createElement('div');
      commentElement.className = 'comment';
      commentElement.innerHTML = `<p>${newComment.comment}</p>`;
      commentsContainer.appendChild(commentElement);
    })
    .catch(error => {
      console.error('Error:', error);
    });
});