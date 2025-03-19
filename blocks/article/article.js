/* eslint-disable linebreak-style */
export default async function decorate(block) {
  console.log('ARTICLE BLOCK', block);

  // const linkElement = block.querySelector('a.button');
  // if (!linkElement) return;
  
  // let articleUrl = linkElement.getAttribute('href');
  // if (!articleUrl) return;
  
  // // Remove .html if present
  // articleUrl = articleUrl.replace(/\.html$/, '');
  
  // const jsonUrl = `${articleUrl}/jcr:content.json`;
  
  // try {
  //   const response = await fetch(jsonUrl);
  //   if (!response.ok) throw new Error('Failed to fetch article data');
    
  //   const data = await response.json();
  //   const title = data["jcr:title"] || '';
  //   const description = data["jcr:description"] || '';
  //   const tags = (data["cq:tags"] || []).map(tag => tag.split('/').pop()).join(', ');
    
  //   // Creating the article card
  //   const card = document.createElement('div');
  //   card.classList.add('article-card-item');
    
  //   const anchor = document.createElement('a');
  //   anchor.classList.add('article-card');
  //   anchor.href = articleUrl;
    
  //   const imageWrapper = document.createElement('div');
  //   imageWrapper.classList.add('article-card__image');
    
  //   const img = document.createElement('img');
  //   img.loading = 'lazy';
  //   if (data.image) {
  //     img.src = data.image;
  //   }
  //   imageWrapper.appendChild(img);
    
  //   const contentWrapper = document.createElement('div');
  //   contentWrapper.classList.add('article-card__content');
    
  //   const tagDiv = document.createElement('div');
  //   tagDiv.classList.add('tags');
  //   const tagP = document.createElement('p');
  //   tagP.classList.add('semi-bold');
  //   tagP.textContent = tags;
  //   tagDiv.appendChild(tagP);
    
  //   const titleElement = document.createElement('h6');
  //   titleElement.classList.add('title');
  //   titleElement.textContent = title;
    
  //   const descriptionElement = document.createElement('p');
  //   descriptionElement.classList.add('description');
  //   descriptionElement.textContent = description;
    
  //   contentWrapper.append(tagDiv, titleElement, descriptionElement);
  //   anchor.append(imageWrapper, contentWrapper);
  //   card.appendChild(anchor);
    
  //   block.innerHTML = '';
  //   block.appendChild(card);
  // } catch (error) {
  //   console.error('Error loading article card:', error);
  // }
}