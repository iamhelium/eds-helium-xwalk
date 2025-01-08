export default function decorate(block) {
  const accordionItems = block.querySelectorAll(
    '[data-aue-model="accordionitem"]'
  );
  accordionItems.forEach((item) => {
    const labelWrapper = item.querySelector(
      '[data-aue-prop="accordionitemlabel"]'
    );
    const bodyWrapper = item.querySelector(
      '[data-aue-prop="accordionitembody"]'
    );

    if (labelWrapper && bodyWrapper) {
      const summary = document.createElement("summary");
      summary.className = "accordion-item-label";

      while (labelWrapper.firstChild) {
        summary.appendChild(labelWrapper.firstChild);
      }

      labelWrapper.parentElement.replaceWith(summary);

      const bodyDiv = document.createElement("div");
      bodyDiv.className = "accordion-item-body";

      while (bodyWrapper.firstChild) {
        bodyDiv.appendChild(bodyWrapper.firstChild);
      }

      bodyWrapper.parentElement.replaceWith(bodyDiv);

      const details = document.createElement("details");
      details.className = "accordion-item";

      details.appendChild(summary);
      details.appendChild(bodyDiv);

      item.replaceWith(details);
    }
  });
  //   [...block.children].forEach((row) => {
  //     const [label, body] = row.children;

  //     const summary = document.createElement("summary");
  //     summary.className = "accordion-item-label";
  //     summary.append(...label.childNodes);
  //     label.appendChild(summary);

  //     body.classList.add("accordion-item-body");

  //     const details = document.createElement("details");
  //     details.className = "accordion-item";
  //     row.parentElement.insertBefore(details, row);
  //     details.appendChild(row);
  //   });

  //   const accordionItems = block.querySelectorAll(".accordion-item");
  //   accordionItems.forEach((item) => {
  //     item.addEventListener("toggle", () => {
  //       if (item.open) {
  //         accordionItems.forEach((otherItem) => {
  //           if (otherItem !== item) {
  //             otherItem.open = false;
  //           }
  //         });
  //       }
  //     });
  //   });
}
