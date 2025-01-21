import { openModal } from '../custommodal/custommodal.js';

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
      if (linkHref) {
        await openModal(linkHref);
      } else {
        console.error('No link provided for modal content.');
      }
    });

    block.innerHTML = '';
    block.appendChild(button);
  }
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
  