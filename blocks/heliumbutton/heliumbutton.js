export default function decorate(block) {
  const buttonTextElement = block.querySelector('div > div > p');
  const linkElement = block.querySelector('.button-container a');

  if (buttonTextElement && linkElement) {
    const buttonText = buttonTextElement.textContent?.trim() || 'Click me';
    const buttonLink = linkElement.getAttribute('href') || '#';

    // Create new button structure
    const buttonContainer = document.createElement('p');
    buttonContainer.className = 'button-container';

    const buttonLinkElement = document.createElement('a');
    buttonLinkElement.href = buttonLink;
    buttonLinkElement.className = 'button';
    buttonLinkElement.textContent = buttonText;

    // Append link inside paragraph
    buttonContainer.appendChild(buttonLinkElement);

    // Clear block and append the new button structure
    block.innerHTML = '';
    block.appendChild(buttonContainer);
  }
}

// import { openModal } from '../modal/modal.js';
// import { graphqlDemoGet } from '../../scripts/test-graphql-local.js';

// export default function decorate(block) {
//   const textElement = block.querySelector('[data-aue-prop="text"]');
//   const linkElement = block.querySelector('a.button');

//   if (textElement && linkElement) {
//     const buttonText = textElement.textContent.trim();
//     const linkHref = linkElement.getAttribute('href');

//     const button = document.createElement('button');
//     button.textContent = buttonText;
//     button.className = '';

//     button.addEventListener('click', async () => {
//       if (block.classList.contains('btn-tertiary')) {
//         try {
//           const data = await graphqlDemoGet();
//           renderData(data, block);
//         } catch (error) {
//           console.error('Error fetching GraphQL data:', error);
//         }
//       } else if (linkHref && block.classList.contains('btn-modal')) {
//         await openModal(linkHref);
//       } else if (linkHref && block.classList.contains('btn-link')) {
//         window.location.href = linkHref;
//       }
//     });

//     block.innerHTML = '';
//     block.appendChild(button);
//   }
// }

// function renderData(data, targetElement) {
//   const dataContainer = document.createElement('div');
//   dataContainer.className = 'graphql-data';

//   if (data?.data?.articlePaginated?.edges) {
//     data.data.articlePaginated?.edges.forEach((edge) => {
//       const edgeElement = document.createElement('p');
// eslint-disable-next-line max-len
//       edgeElement.textContent = edge.node.authorFragment.firstName+ " " + edge.node.authorFragment.lastName;
//       dataContainer.appendChild(edgeElement);
//     });
//   } else {
//     dataContainer.textContent = 'No data available.';
//   }

//   targetElement.appendChild(dataContainer);
// }
