export default function decorate(block) {
    document.querySelectorAll('[data-aue-model="accordionitem"]').forEach((item) => {
        const label = item.querySelector('[data-aue-prop="accordionitemlabel"]');
        const body = item.querySelector('[data-aue-prop="accordionitembody"]');
        label.addEventListener('click', () => {
            item.classList.toggle('open');
            const accordionWrapper = item.closest('.accordion-wrapper');
            const otherItems = accordionWrapper.querySelectorAll('[data-aue-model="accordionitem"].open');
            otherItems.forEach((openItem) => {
                if (openItem !== item) {
                    openItem.classList.remove('open');
                }
            });
        });
    });
}
