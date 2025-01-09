export default function decorate(block) {
    document.querySelectorAll('.accordion-wrapper').forEach((accordionWrapper) => {
        accordionWrapper.querySelectorAll('[data-aue-model="accordionitem"]').forEach((item) => {
            const label = item.querySelector('[data-aue-prop="accordionitemlabel"]');
            label.addEventListener('click', () => {
                accordionWrapper.querySelectorAll('[data-aue-model="accordionitem"].open').forEach((openItem) => {
                    if (openItem !== item) {
                        openItem.classList.remove('open');
                    }
                });
                if (item.classList.contains('open')) {
                    item.classList.remove('open');
                } else {
                    item.classList.add('open');
                }
            });
        });
    });
}
