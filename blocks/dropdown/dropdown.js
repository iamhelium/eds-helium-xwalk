/* eslint-disable linebreak-style */
export default async function decorate(block) {
  try {
    const response = await fetch('/graphql/execute.json/eds-helium-xwalk/Sample');
    const data = await response.json();

    const items = data?.data?.edsXwalkModelList?.items || [];

    block.replaceChildren();

    const dropdown = document.createElement('select');
    dropdown.classList.add('custom-dropdown');

    // Add placeholder option
    const placeholderOption = document.createElement('option');
    placeholderOption.textContent = 'Select a name';
    placeholderOption.value = '';
    placeholderOption.disabled = true;
    placeholderOption.hidden = true;
    placeholderOption.selected = true;
    dropdown.appendChild(placeholderOption);

    items.forEach((item) => {
      const option = document.createElement('option');
      option.textContent = item.name ?? '';
      option.value = item.title ?? '';
      dropdown.appendChild(option);
    });

    const titleHeading = document.createElement('h4');
    titleHeading.classList.add('title-heading');
    titleHeading.textContent = 'Select a name to see the title';

    dropdown.addEventListener('change', (event) => {
      titleHeading.textContent = event.target.value || 'No title available';
    });

    block.replaceChildren(dropdown);
    block.appendChild(titleHeading);
  } catch (error) {
    console.error('Error fetching data:', error);
  }

  const metaTag = document.querySelector('meta[name="cq-tags"]');
  const content = metaTag ? metaTag.getAttribute('content') : null;
  console.log('AEM TAG: ', content, block);
}
