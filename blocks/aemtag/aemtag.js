export default function decorate(block) {
  // Assuming that the tag picker elements are within the provided block
  const tagPickerWrapper = block.querySelector('.is-field.is-aem-tag');

  if (tagPickerWrapper) {
    // Find all selected tags inside the tag picker (assuming tags are inside elements with class '.HpsDkq_spectrum-Tag-content')
    const selectedTags = tagPickerWrapper.querySelectorAll('.HpsDkq_spectrum-Tag-content');

    // Create a container to hold the tags
    const tagListContainer = document.createElement('ul');
    tagListContainer.classList.add('tag-list');

    // Loop through each selected tag and create a list item for each
    selectedTags.forEach((tag) => {
      const tagName = tag.textContent.trim();
      const li = document.createElement('li');
      li.classList.add('tag-item');
      li.textContent = tagName;

      // Optionally, we can add a remove button if we want users to remove tags (if this is required)
      const removeButton = document.createElement('button');
      removeButton.classList.add('remove-tag');
      removeButton.innerHTML = '&times;';
      removeButton.addEventListener('click', () => {
        li.remove();  // Remove the tag when the button is clicked
      });

      li.appendChild(removeButton);
      tagListContainer.appendChild(li);
    });

    // Clear the existing content of the block and append the generated tags
    block.textContent = ''; // Remove existing content
    block.appendChild(tagListContainer);  // Add the generated tags list
  } else {
    console.log('Tag picker not found in the block.');
  }
}
