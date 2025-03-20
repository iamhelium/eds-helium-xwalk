/* eslint-disable linebreak-style */
/* eslint-disable no-restricted-syntax */
export default async function decorate(block) {
  const resourceElement = block.getAttribute('data-aue-resource');
  if (!resourceElement) return;

  const domain = window.location.origin;
  const jcrPath = resourceElement.replace('urn:aemconnection:', '');
  const jsonUrl = `${domain}${jcrPath}.json`;

  try {
    const response = await fetch(jsonUrl);
    if (!response.ok) throw new Error('Failed to fetch JCR data');

    const data = await response.json();
    const layoutType = data['layout-type'];


    let articlesJson = [];
    let tagsSet = new Set();

    if (layoutType === 'dynamic-article-link') {
      const dynamicLink = data[layoutType] || [];

      if (!dynamicLink) return;

      const dynamicUrl = `${domain}${dynamicLink}.infinity.json`;
      const dynamicResponse = await fetch(dynamicUrl);
      const dynamicData = await dynamicResponse.json();

      for (const key in dynamicData) {
        if (dynamicData[key]['jcr:content']) {
          const content = dynamicData[key]['jcr:content'];
          const tags = content['cq:tags'] || [];
          tags.forEach(tag => tagsSet.add(tag));

          articlesJson.push({
            title: content['jcr:title'],
            description: content['jcr:description']?.substring(0, 100) + '...',
            tags: tags.map(tag => ({
              'tag-id': tag,
              tag: tag.split('/').pop()
            })),
            image: {
              alt: content.image?.alt || '',
              fileReference: content.image?.fileReference || ''
            },
            link: `${domain}${dynamicLink}/${key}.html`
          });
        }
      }
    }

    const tagsArray = Array.from(tagsSet).map(tag => ({
      'tag-id': tag,
      tag: tag.split('/').pop()
    }));

    const finalJson = {
      tags: tagsArray,
      pages: articlesJson
    };

    // injectChips(block, finalJson);
    filterArticles(block, finalJson, 'all');
  } catch (error) {
    console.error('Error fetching block data:', error);
  }
}

function injectChips(block, finalJson) {
  const chipWrapper = document.createElement('div');
  chipWrapper.className = 'chip-wrapper';

  const chipList = document.createElement('div');
  chipList.className = 'chip-list';

  const allTopicsButton = document.createElement('button');
  allTopicsButton.className = 'chip selected';
  allTopicsButton.dataset.value = 'all';
  allTopicsButton.textContent = 'All topics';
  chipList.appendChild(allTopicsButton);

  finalJson.tags.forEach((tag) => {
    const chipButton = document.createElement('button');
    chipButton.className = 'chip article-tag';
    chipButton.dataset.value = tag['tag-id'];
    chipButton.textContent = tag.tag;
    chipList.appendChild(chipButton);
  });

  chipWrapper.appendChild(chipList);

  const articleWrapper = block.querySelector('.article-wrapper');
  articleWrapper.insertBefore(chipWrapper, block.querySelector('.article-card-wrapper'));

  chipList.addEventListener('click', (event) => {
    if (event.target.classList.contains('chip')) {
      document.querySelectorAll('.chip').forEach((chip) => chip.classList.remove('selected'));
      event.target.classList.add('selected');
      filterArticles(block, finalJson, event.target.dataset.value);
    }
  });
}

function filterArticles(block, finalJson, selectedTag) {
  const articleCardWrapper = block.querySelector('.article-card-wrapper');
  articleCardWrapper.innerHTML = '';

  finalJson.pages
    .filter((article) => selectedTag === 'all' || article.tags.some(tag => tag['tag-id'] === selectedTag))
    .forEach((article) => {
      const articleCardItem = document.createElement('div');
      articleCardItem.className = 'article-card-item';

      const articleCard = document.createElement('a');
      articleCard.className = 'article-card';
      articleCard.href = article.link;

      const imageDiv = document.createElement('div');
      imageDiv.className = 'article-card__image';
      const img = document.createElement('img');
      img.loading = 'lazy';
      img.src = article.image.fileReference;
      img.alt = article.image.alt;
      imageDiv.appendChild(img);

      const contentDiv = document.createElement('div');
      contentDiv.className = 'article-card__content';

      const tagsDiv = document.createElement('div');
      tagsDiv.className = 'tags';
      const tagsP = document.createElement('p');
      tagsP.className = 'card-tag';
      tagsP.textContent = article.tags.map((tag) => tag.tag).join(', ');
      tagsDiv.appendChild(tagsP);

      const title = document.createElement('h6');
      title.className = 'title';
      title.textContent = article.title;

      const description = document.createElement('p');
      description.className = 'description';
      description.textContent = article.description;

      contentDiv.appendChild(tagsDiv);
      contentDiv.appendChild(title);
      contentDiv.appendChild(description);

      articleCard.appendChild(imageDiv);
      articleCard.appendChild(contentDiv);

      articleCardItem.appendChild(articleCard);
      articleCardWrapper.appendChild(articleCardItem);
    });
}
