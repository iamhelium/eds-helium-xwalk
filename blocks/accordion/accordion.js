export default function decorate(block) {
    const accordionItems = block.querySelectorAll('[data-aue-model="accordionitem"]');
    accordionItems.forEach((item) => {
        const label = item.querySelector('[data-aue-prop="accordionitemlabel"]');
        const body = item.querySelector('[data-aue-prop="accordionitembody"]');

        if (label && body) {
            const details = document.createElement('details');
            details.className = 'accordion-item';
            const summary = document.createElement('summary');
            summary.className = 'accordion-item-label';
            summary.innerHTML = label.innerHTML;
            const bodyWrapper = document.createElement('div');
            bodyWrapper.className = 'accordion-item-body';
            bodyWrapper.innerHTML = body.innerHTML;
            details.appendChild(summary);
            details.appendChild(bodyWrapper);
            item.appendChild(details);
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
