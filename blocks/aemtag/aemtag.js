export default function getTagTitle(block) {

  const tagElement = block.querySelector('[data-aue-prop="Tags"]');

  if (tagElement) {
    const tagTitle = tagElement.textContent.trim();
    console.log('Tag Title:', tagTitle);
    return tagTitle;
  } else {
    console.log('Tag element not found.');
    return null;
  }
}

const block = document.querySelector('.aem-tag-wrapper');
getTagTitle(block);
