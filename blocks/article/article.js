export default async function decorate(block) {
  const resourceElement = block.getAttribute("data-aue-resource");
  if (!resourceElement) return;

  const domain = window.location.origin;
  const jcrPath = resourceElement.replace("urn:aemconnection:", "");
  const jsonUrl = `${domain}${jcrPath}.json`;

  try {
    const response = await fetch(jsonUrl);
    if (!response.ok) throw new Error("Failed to fetch JCR data");

    const data = await response.json();
    const layoutType = data["layout-type"];
    let articleLinks = [];

    if (layoutType === "dynamic-article-link") {
      const dynamicLink = data["dynamic-article-link"];
      if (dynamicLink) {
        const articleJsonUrl = `${domain}${dynamicLink}.infinity.json`;
        const articleResponse = await fetch(articleJsonUrl);
        if (!articleResponse.ok)
          throw new Error("Failed to fetch dynamic articles");

        const articleData = await articleResponse.json();
        articleLinks = Object.keys(articleData)
          .filter((key) => key !== "jcr:content")
          .map((key) => `/${key}`);
      }
    } else {
      articleLinks = data[layoutType] || [];
    }

    if (!Array.isArray(articleLinks)) {
      console.error("Invalid article links format");
      return;
    }

    const cardContainer = document.createElement("div");
    cardContainer.classList.add("article-card-wrapper");

    if (layoutType === "dynamic-article-link") {
      const allTags = new Set();
      const articles = [];

      for (const link of articleLinks) {
        const articleJsonUrl = `${domain}${link}.infinity.json`;
        try {
          const articleResponse = await fetch(articleJsonUrl);
          if (!articleResponse.ok)
            throw new Error("Failed to fetch article data");

          const articleData = await articleResponse.json();
          const content = articleData["jcr:content"] || {};

          const title = content["jcr:title"] || "";
          const description = content["jcr:description"] || "";
          const tags = content["cq:tags"] || [];
          const imageSrc = content.image?.fileReference || "";

          tags.forEach((tag) => allTags.add(tag));

          const article = { title, description, tags, imageSrc, link };
          articles.push(article);
        } catch (error) {
          console.error("Error loading individual article:", error);
        }
      }

      // Create chip wrapper
      const chipWrapper = document.createElement("div");
      chipWrapper.classList.add("chip-wrapper");
      const chipList = document.createElement("div");
      chipList.classList.add("chip-list");

      // "All topics" chip
      const allChip = document.createElement("button");
      allChip.classList.add("chip", "selected");
      allChip.textContent = "All topics";
      allChip.dataset.value = "all";
      chipList.appendChild(allChip);

      allTags.forEach((tag) => {
        const chip = document.createElement("button");
        chip.classList.add("chip", "article-tag");
        chip.textContent = tag.split("/").pop();
        chip.dataset.value = tag;
        chipList.appendChild(chip);
      });

      chipWrapper.appendChild(chipList);
      block.appendChild(chipWrapper);

      // Function to filter articles
      function filterArticles(selectedTag) {
        cardContainer.innerHTML = "";
        articles.forEach((article) => {
          if (selectedTag === "all" || article.tags.includes(selectedTag)) {
            const cardItem = document.createElement("div");
            cardItem.classList.add("article-card-item");

            const anchor = document.createElement("a");
            anchor.classList.add("article-card");
            anchor.href = window.location.pathname.endsWith(".html")
              ? `${article.link}.html`
              : article.link;

            const imageWrapper = document.createElement("div");
            imageWrapper.classList.add("article-card__image");

            if (article.imageSrc) {
              const img = document.createElement("img");
              img.loading = "lazy";
              img.src = article.imageSrc;
              imageWrapper.appendChild(img);
            }

            const contentWrapper = document.createElement("div");
            contentWrapper.classList.add("article-card__content");

            const tagDiv = document.createElement("div");
            tagDiv.classList.add("tags");
            const tagP = document.createElement("p");
            tagP.classList.add("card-tag");
            tagP.textContent = article.tags
              .map((tag) => tag.split("/").pop())
              .join(", ");
            tagDiv.appendChild(tagP);

            const titleElement = document.createElement("h6");
            titleElement.classList.add("title");
            titleElement.textContent = article.title;

            const descriptionElement = document.createElement("p");
            descriptionElement.classList.add("description");
            descriptionElement.textContent = article.description;

            contentWrapper.append(tagDiv, titleElement, descriptionElement);
            anchor.append(imageWrapper, contentWrapper);
            cardItem.appendChild(anchor);
            cardContainer.appendChild(cardItem);
          }
        });
      }

      filterArticles("all");
      block.appendChild(cardContainer);

      // Event listener for chips
      chipList.addEventListener("click", (event) => {
        if (event.target.classList.contains("chip")) {
          document
            .querySelectorAll(".chip")
            .forEach((chip) => chip.classList.remove("selected"));
          event.target.classList.add("selected");
          filterArticles(event.target.dataset.value);
        }
      });
    } else {
      block.appendChild(cardContainer);
    }
  } catch (error) {
    console.error("Error loading article block:", error);
  }
}
