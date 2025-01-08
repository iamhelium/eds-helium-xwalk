export default function decorate(block) {
  [...block.children].forEach((row) => {
    const [label, body] = row.children;

    const summary = document.createElement("summary");
    summary.className = "accordion-item-label";
    summary.append(...label.childNodes);
    label.appendChild(summary);

    body.classList.add("accordion-item-body");

    const details = document.createElement("details");
    details.className = "accordion-item";
    row.parentElement.insertBefore(details, row);
    details.appendChild(row);
  });

  const accordionItems = block.querySelectorAll(".accordion-item");
  accordionItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (item.open) {
        accordionItems.forEach((otherItem) => {
          if (otherItem !== item) {
            otherItem.open = false;
          }
        });
      }
    });
  });
}
