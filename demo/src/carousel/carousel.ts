import "./style.css";

const carousel = document.getElementById("carousel");
const carouselBackBtn = document.getElementById("carousel-back");
const carouselNextBtn = document.getElementById("carousel-next");

let currentItem = 1; // the currently focused carousel item (1-indexed)
/*
 * Scrolls the carousel to currentItem + by (the given offset).
 */
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

function disableButtons() {
    /* Disable the corresponding buttons if at first or last item */
    if (carouselBackBtn && carouselBackBtn instanceof HTMLButtonElement) {
        carouselBackBtn.disabled = currentItem === 1;
    }

    if (carouselNextBtn && carouselNextBtn instanceof HTMLButtonElement) {
        carouselNextBtn.disabled =
            document.querySelector(`#item-${currentItem + 1}`) === null;
    }
}

/*
 * Use the Interaction Observer API to find the currently focused carousel item.
 * When focused item changes, update our currentItem. This is important because
 * the user can scroll through the carousel items (instead of using the buttons)
 * which does not explicitly update our currentItem index (this can lead to button
 * desync).
 */
const observerOpts = {
    root: carousel,
    threshold: 0.5,
};
/* This callback is triggered when a carousel item crosses over the 50%
 * visibiliy threshold on the carousel viewport.
 */
const observer = new IntersectionObserver((entries, _observer) => {
    // Find the entry with the largest intersection ratio
    const activated = entries.reduce(function (max, entry) {
        return entry.intersectionRatio > max.intersectionRatio ? entry : max;
    });

    if (activated.intersectionRatio > 0) {
        // Safely parse out the index out of the element's id attribute (#item-${index})
        const focusedId = activated.target.getAttribute("id");

        if (!focusedId) return;

        const splits = focusedId.split("-");
        if (splits.length < 1) return;
        else {
            const focusedIndex = Number(splits[1]);
            if (Number.isNaN(focusedIndex)) return;
            currentItem = focusedIndex;

            disableButtons();
        }
    }
}, observerOpts);

/* Register each carousel item for the observers */
document.querySelectorAll("#carousel-deck > div")?.forEach((item) => {
    observer.observe(item);
});

carouselBackBtn?.addEventListener("click", () => {
    scroll(-1);
});
carouselNextBtn?.addEventListener("click", () => {
    scroll(+1);
});
