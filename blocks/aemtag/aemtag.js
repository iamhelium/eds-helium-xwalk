

export default function decorate(block) {
const tagsElement = block.querySelector('[data-aue-prop="cq:tags"]');
if (tagsElement) {
  const tags = tagsElement.textContent.trim();
  console.log(tags); // Output the tags
}

}