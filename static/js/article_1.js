document.addEventListener('DOMContentLoaded', function() {
  fetch('/articles')
    .then(response => response.json())
    .then(data => {
      const articleList = document.getElementById('article-list');

      // Adding article titles to the list
      data.forEach(article => {
        const listItem = document.createElement('li');
        listItem.textContent = article.title;
        listItem.addEventListener('click', () => {
          displayArticle(article);
        });
        articleList.appendChild(listItem);
      });
    });
});

// Displaying the selected article
function displayArticle(article) {
  const articleTitle = document.getElementById('article-title');
  const articleContent = document.getElementById('article-content');

  // Setting the title and content of the article
  articleTitle.textContent = article.title;
  
  // Creating an image element for the article
  const articleImage = document.createElement('img');
  articleImage.src = article.image;
  articleImage.alt = article.title;
  
  // Creating a paragraph element for the article content
  const articleParagraph = document.createElement('p');
  articleParagraph.textContent = article.content;

  // Clearing the article content
  articleContent.innerHTML = '';

  // Appending the image and content to the article content
  articleContent.appendChild(articleImage);
  articleContent.appendChild(articleParagraph);

  // Show the article content block
  articleContent.style.display = 'block';
}