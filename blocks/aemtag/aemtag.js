export default function decorate(block) {
  const [quoteWrapper] = block.children;

  // Create a blockquote element
  const blockquote = document.createElement('blockquote');
  blockquote.textContent = quoteWrapper.textContent.trim();

  // Replace quoteWrapper content with the blockquote
  quoteWrapper.replaceChildren(blockquote);

  // Assume that tags are stored in a 'data-tags' attribute on the block element
  const tags = block.getAttribute('data-tags');

  // If tags exist, process and log them
  if (tags) {
    const tagList = tags.split(',').map(tag => tag.trim()); // assuming tags are comma-separated
    console.log('Tags:', tagList);

    // You could do further processing with the tags here (e.g., display them in the UI, etc.)
    const tagsContainer = document.createElement('div');
    tagsContainer.classList.add('tags-container');
    tagList.forEach(tag => {
      const tagElement = document.createElement('span');
      tagElement.classList.add('tag');
      tagElement.textContent = tag;
      tagsContainer.appendChild(tagElement);
    });

    // Append tags to the blockquote or another part of the component
    blockquote.appendChild(tagsContainer);
  } else {
    console.log('No tags found.');
  }
}
