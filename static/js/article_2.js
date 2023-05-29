document.addEventListener('DOMContentLoaded', function() {
    fetch('/articles_page2')
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
  
    // Creating an image element and setting its attributes
    const image = document.createElement('img');
    image.src = article.image;
    image.alt = article.title;
    image.id = 'article-image';
  
    // Creating a paragraph element for the article content
    const contentParagraph = document.createElement('p');
    contentParagraph.textContent = article.content;
    contentParagraph.id = 'article-text';
  
    // Clearing the previous content
    articleContent.innerHTML = '';
  
    // Appending the image and content to the article content
    articleContent.appendChild(image);
    articleContent.appendChild(contentParagraph);
  
    // Displaying the article content block
    articleContent.style.display = 'block';
  }