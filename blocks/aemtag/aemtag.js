export default function decorate(block) {
  const tagsElement = block.querySelector('[data-aue-prop="cq:tags"]');

  if (tagsElement) {
    const tagsText = tagsElement.textContent.trim();
    const tagsArray = tagsText.split(',').map(tag => tag.trim());
    const tagsContainer = document.createElement('div');
    tagsContainer.classList.add('tags-container');
    tagsArray.forEach(tag => {
      const tagElement = document.createElement('span');
      tagElement.classList.add('tag');
      tagElement.textContent = tag;
      tagElement.addEventListener('click', () => {
        console.log(`Tag clicked: ${tag}`);
      });
      tagsContainer.appendChild(tagElement);
    });
    tagsElement.replaceWith(tagsContainer);
  }
}
