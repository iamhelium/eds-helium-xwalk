/* eslint-disable linebreak-style */
export default async function decorate(block) {
  const metaTag = document.querySelector('meta[name="cq-tags"]');
  const content = metaTag ? metaTag.getAttribute('content') : null;
  console.log('AEM TAG: ', content, block);
}
