/* eslint-disable linebreak-style */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */

function createArticleCard(article) {
  const articleCardItem = document.createElement('div');
  articleCardItem.className = 'article-card-item';

  const articleCard = document.createElement('a');
  articleCard.className = 'article-card';
  articleCard.href = article.link;

  const imageDiv = document.createElement('div');
  imageDiv.className = 'article-card__image';
  if (article.image.fileReference) {
    const img = document.createElement('img');
    img.loading = 'lazy';
    img.src = article.image.fileReference;
    img.alt = article.image.alt || '';
    imageDiv.appendChild(img);
  }

  const contentDiv = document.createElement('div');
  contentDiv.className = 'article-card__content';

  const tagsDiv = document.createElement('div');
  tagsDiv.className = 'tags';
  const tagsP = document.createElement('p');
  tagsP.className = 'card-tag';
  tagsP.textContent = article.tags.map(tag => tag.tag).join(', ');
  tagsDiv.appendChild(tagsP);

  const title = document.createElement('h6');
  title.className = 'title';
  title.textContent = article.title;

  const description = document.createElement('p');
  description.className = 'description';
  description.textContent = article.description;

  contentDiv.append(tagsDiv, title, description);
  articleCard.append(imageDiv, contentDiv);
  articleCardItem.appendChild(articleCard);

  return articleCardItem;
}

function filterArticles(block, finalJson, selectedTag) {
  const articleCardWrapper = document.createElement('div');
  articleCardWrapper.classList.add('article-card-wrapper');

  finalJson.pages
    .filter(article => selectedTag === 'all' || article.tags.some(tag => tag['tag-id'] === selectedTag))
    .forEach(article => articleCardWrapper.appendChild(createArticleCard(article)));

  const existingWrapper = block.querySelector('.article-card-wrapper');
  if (existingWrapper) {
    existingWrapper.replaceWith(articleCardWrapper);
  } else {
    block.appendChild(articleCardWrapper);
  }
}

function injectChips(block, finalJson) {
  if (!finalJson.tags.length) return; // Do not inject chips for manual articles
  
  const chipWrapper = document.createElement('div');
  chipWrapper.className = 'chip-wrapper';

  const chipList = document.createElement('div');
  chipList.className = 'chip-list';

  const allTopicsButton = document.createElement('button');
  allTopicsButton.className = 'chip selected';
  allTopicsButton.dataset.value = 'all';
  allTopicsButton.textContent = 'All topics';
  chipList.appendChild(allTopicsButton);

  finalJson.tags.forEach(tag => {
    const chipButton = document.createElement('button');
    chipButton.className = 'chip article-tag';
    chipButton.dataset.value = tag['tag-id'];
    chipButton.textContent = tag.tag;
    chipList.appendChild(chipButton);
  });

  chipWrapper.appendChild(chipList);
  block.appendChild(chipWrapper);

  chipList.addEventListener('click', event => {
    if (event.target.classList.contains('chip')) {
      document.querySelectorAll('.chip').forEach(chip => chip.classList.remove('selected'));
      event.target.classList.add('selected');
      filterArticles(block, finalJson, event.target.dataset.value);
    }
  });
}

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

    if (layoutType === 'manual-article-links') {
      const articleLinks = data[layoutType] || [];
      for (const link of articleLinks) {
        const articleJsonUrl = `${domain}${link}.infinity.json`;
        try {
          const articleResponse = await fetch(articleJsonUrl);
          if (!articleResponse.ok) throw new Error('Failed to fetch article data');

          const articleData = await articleResponse.json();
          const content = articleData['jcr:content'] || {};
          const tags = content['cq:tags'] || [];

          articlesJson.push({
            title: content['jcr:title'] || '',
            description: content['jcr:description'] || '',
            tags: tags.map(tag => ({ 'tag-id': tag, tag: tag.split('/').pop() })),
            image: {
              alt: content.image?.alt || '',
              fileReference: content.image?.fileReference || ''
            },
            link: `${domain}${link}.html`
          });
        } catch (error) {
          console.error('Error loading individual article:', error);
        }
      }
    } else if (layoutType === 'dynamic-article-link') {
      const dynamicLink = data[layoutType];
      if (dynamicLink) {
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
              description: `${content['jcr:description']?.substring(0, 100)}...`,
              tags: tags.map(tag => ({ 'tag-id': tag, tag: tag.split('/').pop() })),
              image: {
                alt: content.image?.alt || '',
                fileReference: content.image?.fileReference || ''
              },
              link: `${domain}${dynamicLink}/${key}.html`
            });
          }
        }
      }
    }

    const tagsArray = Array.from(tagsSet).map(tag => ({ 'tag-id': tag, tag: tag.split('/').pop() }));
    const finalJson = { tags: tagsArray, pages: articlesJson };

    block.innerHTML = '';
    if (layoutType === 'dynamic-article-link') {
      injectChips(block, finalJson);
    }
    filterArticles(block, finalJson, 'all');
  } catch (error) {
    console.error('Error fetching block data:', error);
  }
}
