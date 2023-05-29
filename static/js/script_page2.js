const articleTitles = document.querySelectorAll('.article-title');

articleTitles.forEach((title) => {
  title.addEventListener('click', () => {
    const articleContent = title.nextElementSibling;
    articleContent.classList.toggle('active');
  });
});