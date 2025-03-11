import { createOptimizedPicture } from '../../scripts/aem.js'; // Reusing this if needed for optimizing images
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // First, we assume that tags are available via a 'data-tags' attribute on the block element
  const tags = block.getAttribute('data-tags'); // Retrieve tags from the 'data-tags' attribute

  if (tags) {
    // Convert the comma-separated string of tags into an array
    const tagList = tags.split(',').map(tag => tag.trim());

    // Create a container for tags
    const tagContainer = document.createElement('ul');
    tagContainer.classList.add('tags-container');

    // Loop through each tag and create an <li> for each one
    tagList.forEach((tag) => {
      const li = document.createElement('li');
      li.classList.add('tag-item');
      li.textContent = tag;

      // Optional: Create a link to the tag (if you have URLs for each tag)
      // const tagLink = document.createElement('a');
      // tagLink.href = `/tags/${tag}`;
      // tagLink.textContent = tag;
      // li.appendChild(tagLink);

      tagContainer.appendChild(li);
    });

    // Now, let's add the tags container to the block element
    block.appendChild(tagContainer);
  } else {
    console.log('No tags found.');
  }
}
