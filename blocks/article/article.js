/* eslint-disable linebreak-style */
/* eslint-disable no-await-in-loop */
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
    const articleLinks = data[layoutType] || [];

    if (!Array.isArray(articleLinks)) {
      console.error('Invalid article links format');
      return;
    }

    const cardContainer = document.createElement('div');
    cardContainer.classList.add('article-card-wrapper');

    for (const link of articleLinks) {
      const articleJsonUrl = `${domain}${link}.infinity.json`;
      try {
        const articleResponse = await fetch(articleJsonUrl);
        if (!articleResponse.ok) throw new Error('Failed to fetch article data');

        const articleData = await articleResponse.json();
        const content = articleData['jcr:content'] || {};

        const title = content['jcr:title'] || '';
        const description = content['jcr:description'] || '';
        const tags = (content['cq:tags'] || [])
          .map((tag) => tag.split('/').pop())
          .join(', ');
        const imageSrc = content.image?.fileReference || '';

        const cardItem = document.createElement('div');
        cardItem.classList.add('article-card-item');

        const anchor = document.createElement('a');
        anchor.classList.add('article-card');
        anchor.href = window.location.pathname.endsWith('.html')
          ? `${link}.html`
          : link;

        const imageWrapper = document.createElement('div');
        imageWrapper.classList.add('article-card__image');

        if (imageSrc) {
          const img = document.createElement('img');
          img.loading = 'lazy';
          img.src = imageSrc;
          imageWrapper.appendChild(img);
        }

        const contentWrapper = document.createElement('div');
        contentWrapper.classList.add('article-card__content');

        const tagDiv = document.createElement('div');
        tagDiv.classList.add('tags');
        const tagP = document.createElement('p');
        tagP.classList.add('card-tag');
        tagP.textContent = tags;
        tagDiv.appendChild(tagP);

        const titleElement = document.createElement('h6');
        titleElement.classList.add('title');
        titleElement.textContent = title;

        const descriptionElement = document.createElement('p');
        descriptionElement.classList.add('description');
        descriptionElement.textContent = description;

        contentWrapper.append(tagDiv, titleElement, descriptionElement);
        anchor.append(imageWrapper, contentWrapper);
        cardItem.appendChild(anchor);
        cardContainer.appendChild(cardItem);
      } catch (error) {
        console.error('Error loading individual article:', error);
      }
    }

    block.innerHTML = '';
    block.appendChild(cardContainer);
  } catch (error) {
    console.error('Error loading article block:', error);
  }
}
