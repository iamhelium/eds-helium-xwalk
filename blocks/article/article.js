/* eslint-disable linebreak-style */
export default async function decorate(block) {
  console.log("ARTICLE BLOCK", block);

  const resourceElement = block.getAttribute("data-aue-resource");
  if (!resourceElement) return;

  // Construct the API URL
  const domain = window.location.origin;
  const jcrPath = resourceElement.replace("urn:aemconnection:", "");
  const jsonUrl = `${domain}${jcrPath}.json`;

  try {
    const response = await fetch(jsonUrl);
    if (!response.ok) throw new Error("Failed to fetch JCR data");

    const data = await response.json();
    const articleLinks = data["article-link"] || [];

    // Create the article card container
    const cardContainer = document.createElement("div");
    cardContainer.classList.add("article-card-wrapper");

    for (const link of articleLinks) {
      const articleJsonUrl = `${domain}${link}/jcr:content.json`;
      try {
        const articleResponse = await fetch(articleJsonUrl);
        if (!articleResponse.ok)
          throw new Error("Failed to fetch article data");

        const articleData = await articleResponse.json();
        const title = articleData["jcr:title"] || "";
        const description = articleData["jcr:description"] || "";
        const tags = (articleData["cq:tags"] || [])
          .map((tag) => tag.split("/").pop())
          .join(", ");

        // Creating the article card item
        const cardItem = document.createElement("div");
        cardItem.classList.add("article-card-item");

        const anchor = document.createElement("a");
        anchor.classList.add("article-card");
        anchor.href = link;

        const imageWrapper = document.createElement("div");
        imageWrapper.classList.add("article-card__image");

        const img = document.createElement("img");
        img.loading = "lazy";
        if (articleData.image) {
          img.src = articleData.image;
        }
        imageWrapper.appendChild(img);

        const contentWrapper = document.createElement("div");
        contentWrapper.classList.add("article-card__content");

        const tagDiv = document.createElement("div");
        tagDiv.classList.add("tags");
        const tagP = document.createElement("p");
        tagP.classList.add("card-tag");
        tagP.textContent = tags;
        tagDiv.appendChild(tagP);

        const titleElement = document.createElement("h6");
        titleElement.classList.add("title");
        titleElement.textContent = title;

        const descriptionElement = document.createElement("p");
        descriptionElement.classList.add("description");
        descriptionElement.textContent = description;

        contentWrapper.append(tagDiv, titleElement, descriptionElement);
        anchor.append(imageWrapper, contentWrapper);
        cardItem.appendChild(anchor);

        cardContainer.appendChild(cardItem);
      } catch (error) {
        console.error("Error loading individual article:", error);
      }
    }

    block.innerHTML = "";
    block.appendChild(cardContainer);
  } catch (error) {
    console.error("Error loading article block:", error);
  }
}
