/* eslint-disable linebreak-style */
export default async function decorate(block) {
  try {
    const response = await fetch('/graphql/execute.json/eds-helium-xwalk/Sample');
    const data = await response.json();

    const items = data?.data?.edsXwalkModelList?.items || [];

    const dropdown = document.createElement('select');
    dropdown.classList.add('custom-dropdown');

    items.forEach((item) => {
      const option = document.createElement('option');
      option.textContent = item.name ?? '';
      dropdown.appendChild(option);
    });

    block.appendChild(dropdown);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
