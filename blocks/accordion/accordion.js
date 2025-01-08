export default function decorate(block) {
        [...block.children].forEach((row) => {
        const label = row.children[0];
        const body = row.children[1];
    
        const summary = document.createElement('summary');
        summary.className = 'accordion-item-label';
        summary.append(...label.childNodes);
        label.appendChild(summary);
    
        body.classList.add('accordion-item-body');
    
        const details = document.createElement('details');
        details.className = 'accordion-item';
        details.append(label, body);
    
        row.replaceWith(details);
    });
  
    const accordionItems = block.querySelectorAll('.accordion-item');
    accordionItems.forEach((item) => {
        item.addEventListener('toggle', () => {
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
  