export default function decorate(block) {
    // const accordionItems = block.querySelectorAll('.accordion-item');
    // accordionItems.forEach((item) => {
    //     const label = item.querySelector('[data-aue-prop="accordionitemlabel"]');
    //     const body = item.querySelector('[data-aue-prop="accordionitembody"]');

    //     if (label && body) {
    //         const summary = document.createElement('summary');
    //         summary.className = 'accordion-item-label';
    //         while (label.firstChild) {
    //             summary.appendChild(label.firstChild);
    //         }
    //         label.replaceWith(summary);
    //         const bodyWrapper = document.createElement('div');
    //         bodyWrapper.className = 'accordion-item-body';
    //         while (body.firstChild) {
    //             bodyWrapper.appendChild(body.firstChild);
    //         }
    //         body.replaceWith(bodyWrapper);
    //         item.appendChild(summary);
    //         item.appendChild(bodyWrapper);
    //     }
    // });
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
