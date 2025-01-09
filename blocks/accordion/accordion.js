export default function decorate(block) {
document.querySelectorAll('[data-aue-model="accordionitem"]').forEach((item) => {
    const label = item.querySelector('[data-aue-prop="accordionitemlabel"]');
    const body = item.querySelector('[data-aue-prop="accordionitembody"]');

    label.addEventListener('click', () => {
        document.querySelectorAll('[data-aue-model="accordionitem"].open').forEach((openItem) => {
        if (openItem !== item) {
            openItem.classList.remove('open');
        }
        });
        item.classList.toggle('open');
    });
});
}
