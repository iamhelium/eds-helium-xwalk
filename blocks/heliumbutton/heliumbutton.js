import { openModal } from '../modal/modal.js';
import { graphqlDemoGet } from '../../scripts/test-graphql-local.js';

export default function decorate(block) {
  const textElement = block.querySelector('[data-aue-prop="text"]');
  const linkElement = block.querySelector('a.button');

  if (textElement && linkElement) {
    const buttonText = textElement.textContent.trim();
    const linkHref = linkElement.getAttribute('href');

    const button = document.createElement('button');
    button.textContent = buttonText;
    button.className = '';

    button.addEventListener('click', async () => {
      console.log("call button", button.classList)
      if (button.classList.contains('tertiary')) {
        try {
          const data = await graphqlDemoGet();
          renderData(data);
        } catch (error) {
          console.error('Error fetching GraphQL data:', error);
        }
      } else if (button.classList.contains('btn-modal')) {
        await openModal(linkHref);
      } else if (linkHref) {
        window.location.href = linkHref;
      } else {
        console.error('No link provided for modal content.');
      }
    });

    block.innerHTML = '';
    block.appendChild(button);
  }
}

function renderData(data) {
  console.log("called", data)
  const dataContainer = document.createElement('div');
  dataContainer.className = 'graphql-data';

  if (data?.data?.edges) {
    data.data.edges.forEach((edge) => {
      const edgeElement = document.createElement('p');
      edgeElement.textContent = edge.node.authorFragment.firstName;
      dataContainer.appendChild(edgeElement);
    });
  } else {
    dataContainer.textContent = 'No data available.';
  }

  document.body.appendChild(dataContainer);
}


// export default function decorate(block) {
//     const textElement = block.querySelector('[data-aue-prop="text"]');
//     const linkElement = block.querySelector('a.button');
  
//     if (textElement && linkElement) {
//       const buttonText = textElement.textContent.trim();
//       const linkHref = linkElement.getAttribute('href');

//       const button = document.createElement('button');
//       button.textContent = buttonText;
//       button.className = '';
  
//       button.addEventListener('click', () => {
//         window.location.href = linkHref;
//       });
  
//       block.innerHTML = '';
//       block.appendChild(button);
//     }
//   }
  