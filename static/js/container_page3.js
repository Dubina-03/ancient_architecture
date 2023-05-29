fetch('/excursions')
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById('excursions-container');
    const excursionList = document.createElement('div');
    excursionList.className = 'excursion-list';

    data.forEach(excursion => {

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
      excursionOverview.textContent = excursion.overview.substring(0, 200); // Display a portion of the overview text
      excursionContent.appendChild(excursionOverview);

      const readMoreLink = document.createElement('a');
      readMoreLink.href = '/' + excursion.id; // Replace '/excursions/' with the actual URL for the excursion page
      readMoreLink.textContent = 'Read More';
      excursionContent.appendChild(readMoreLink);

      const likeButton = document.createElement('button');
      likeButton.className = 'like-button';
      likeButton.setAttribute('aria-label', 'like this post');
      likeButton.innerHTML = '<i class="fa fa-heart-o"></i><span>Like</span>';
      excursionContent.appendChild(likeButton);

      excursionBlock.appendChild(excursionImage);
      excursionBlock.appendChild(excursionContent);
      excursionList.appendChild(excursionBlock);
    });

    container.appendChild(excursionList);
  })
  .catch(error => {
    console.error('Error:', error);
  });

  document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('excursions-container');
    const form = document.querySelector('form');
  
    let excursionsData = []; // Store the original excursions data
  
    // Fetch the excursions data and populate the container
    fetch('/excursions')
      .then(response => response.json())
      .then(data => {
        excursionsData = data; // Store the original excursions data
        renderExcursions(data); // Render the excursions
      })
      .catch(error => {
        console.error('Error:', error);
      });
  
    form.addEventListener('submit', (event) => {
      event.preventDefault(); // Prevent form submission
  
      const searchInput = document.getElementById('search').value.toLowerCase();
      const filters = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(input => input.id);
      const selectedRadio = document.querySelector('input[type="radio"]:checked');
      const sortValue = selectedRadio ? selectedRadio.value : '';

      let filteredExcursions = excursionsData;
      // Filter the excursions based on selected filters
      if (filters.length > 0) {
        filteredExcursions = filteredExcursions.filter(excursion => {
          for (const filter of filters) {
            if (!excursion.included.includes(filter)) {
              return false;
            }
          }
          return true;
        });
      }
  
      // Search the excursions based on the search input
      if (searchInput !== '') {
        filteredExcursions = filteredExcursions.filter(excursion => excursion.title.toLowerCase().includes(searchInput));
      }
  
      // Sort the excursions based on the selected sorting option
      if (sortValue === '1') {
        filteredExcursions.sort((a, b) => new Date(a.date) - new Date(b.date));
      }
  
      renderExcursions(filteredExcursions); // Render the filtered and sorted excursions
    });
  
    function renderExcursions(data) {
      container.innerHTML = ''; // Clear the container
  
      data.forEach(excursion => {
        const excursionBlock = document.createElement('div');
        excursionBlock.className = 'flexbox-item';
        excursionBlock.dataset.id = excursion.id;
  
        const excursionImage = document.createElement('img');
        excursionImage.src = excursion.image[0];
        excursionImage.alt = excursion.title;
        excursionBlock.appendChild(excursionImage);
  
        const excursionContent = document.createElement('div');
        excursionContent.className = 'flexbox-item-content';
  
        const excursionTitle = document.createElement('h3');
        excursionTitle.textContent = excursion.title;
        excursionContent.appendChild(excursionTitle);
  
        const excursionOverview = document.createElement('p');
        excursionOverview.textContent = excursion.overview.substring(0, 200); // Display a portion of the overview text
        excursionContent.appendChild(excursionOverview);
  
        const readMoreLink = document.createElement('a');
        readMoreLink.href = '/' + excursion.id; // Replace '/excursions/' with the actual URL for the excursion page
        readMoreLink.textContent = 'Read More';
        excursionContent.appendChild(readMoreLink);
  
        const likeButton = document.createElement('button');
        likeButton.className = 'like-button';
        likeButton.setAttribute('aria-label', 'like this post');
        likeButton.innerHTML = '<i class="fa fa-heart-o"></i><span>Like</span>';
        excursionContent.appendChild(likeButton);
  
        excursionBlock.appendChild(excursionContent);
        container.appendChild(excursionBlock);
      });
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('excursions-container');
  
    container.addEventListener('click', (event) => {
      if (event.target && event.target.classList.contains('like-button')) {
        const excursionContainer = event.target.closest('.flexbox-item');
        const excursionId = excursionContainer.dataset.id;
        likeExcursion(excursionId);
      }
    });
  
    function likeExcursion(excursionId) {
      fetch('/like_excursion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ excursionId: excursionId })
      })
        .then(response => {
          return response.json()
        })
        .then(data => {
          if (data.success) {
            alert('Excursion liked!');
          } else {
            alert(data.message);
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  });