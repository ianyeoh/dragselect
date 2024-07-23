import "./style.css";

let currentItem = 1;

function scroll(by: number) {
    const itemToScrollTo = document.querySelector(`#item-${currentItem + by}`);

    if (itemToScrollTo) {
        itemToScrollTo.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "start",
        });

        currentItem = currentItem + by;
    }
}

const carouselBackBtn = document.getElementById("carousel-back");
const carouselNextBtn = document.getElementById("carousel-next");

carouselBackBtn?.addEventListener("click", () => {
    scroll(-1);
});
carouselNextBtn?.addEventListener("click", () => {
    scroll(+1);
});

