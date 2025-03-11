export default function decorate(block) {
  // Find the container where the tags are displayed (assuming the class name is 'HpsDkq_spectrum-Tags')
  const tagContainer = block.querySelector('.HpsDkq_spectrum-Tags');

  // If the tag container is found
  if (tagContainer) {
    // Get all the tags inside the container (assuming tags have the class 'HpsDkq_spectrum-Tag-content')
    const tags = tagContainer.querySelectorAll('.HpsDkq_spectrum-Tag-content');

    // Create a new container to display the selected tags
    const tagDisplayContainer = document.createElement('div');
    tagDisplayContainer.classList.add('tag-display-container');

    // If tags are selected, display them
    if (tags.length > 0) {
      tags.forEach(tag => {
        const tagElement = document.createElement('p');
        tagElement.textContent = tag.textContent.trim(); // Get the tag's name
        tagDisplayContainer.appendChild(tagElement); // Append the tag to the display container
      });
    } else {
      tagDisplayContainer.textContent = 'No tags selected.';
    }

    // Clear existing content in the block and append the tags display
    block.textContent = ''; // Clear the block content
    block.appendChild(tagDisplayContainer); // Append the tag display container
  } else {
    console.error('Tag container not found.');
  }
}