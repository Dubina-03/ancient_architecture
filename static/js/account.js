// account.js
window.addEventListener('load', function() {
  showLikedContainers();
  showComments();
});

function showLikedContainers() {
  fetch('/like_excursion')
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        const container = document.getElementById('liked-container');
        const excursionList = document.createElement('div');
        excursionList.className = 'excursion-list';

        if (data.containers.length > 0) {
          excursionList.innerHTML = '<h3>Liked Excursions:</h3>';
          data.containers.forEach(excursion => {

            const excursionBlock = document.createElement('div');
            excursionBlock.className = 'flexbox-item';
            excursionBlock.dataset.id = excursion.id;

            const excursionImage = document.createElement('img');
            excursionImage.src = excursion.image[0];
            excursionImage.alt = excursion.title;

            const excursionContent = document.createElement('div');
            excursionContent.className = 'flexbox-item-content';

            const excursionTitle = document.createElement('h3');
            excursionTitle.textContent = excursion.title;
            excursionContent.appendChild(excursionTitle);

            const excursionOverview = document.createElement('p');
            excursionOverview.textContent = excursion.overview.substring(0, 150); // Display a portion of the overview text
            excursionContent.appendChild(excursionOverview);

            const readMoreLink = document.createElement('a');
            readMoreLink.href = '/' + excursion.id; // Replace '/excursions/' with the actual URL for the excursion page
            readMoreLink.textContent = 'Read More';
            excursionContent.appendChild(readMoreLink);

            excursionBlock.appendChild(excursionImage);
            excursionBlock.appendChild(excursionContent);
            excursionList.appendChild(excursionBlock);
          });
          container.appendChild(excursionList);
        } else {
          excursionList.innerHTML = '<h3>No liked excursions found.</h3>';
          container.appendChild(excursionList);
        }
      } else {
        console.error(data.message);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function showComments() {
  fetch('/comments')
    .then(response => response.json())
    .then(comments => {
      const commentsContainer = document.getElementById('comments-container');

      comments.forEach(commentGroup => {
        const excursionId = commentGroup.id;
        const excursionComments = commentGroup.comments;

        const commentElement = document.createElement('div');
        commentElement.className = 'comment';

        const commentLink = document.createElement('a');
        commentLink.textContent = "http://127.0.0.1:5000/" + excursionId;
        commentLink.href = "http://127.0.0.1:5000/" + excursionId;

        const commentList = document.createElement('ol'); // Changed to ordered list

        excursionComments.forEach((comment, index) => {
          const commentListItem = document.createElement('li');
          commentListItem.textContent = `${comment.comment}`; // Add list numeration

          commentList.appendChild(commentListItem);
        });

        commentElement.appendChild(commentLink);
        commentElement.appendChild(commentList);
        commentsContainer.appendChild(commentElement);
      });
    })
    .catch(error => {
      console.error('Error:', error);
    });
}




