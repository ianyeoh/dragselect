import { DragSelect } from "../../../../dragselect";

const selectableArea = document.getElementById("disable-ds-selectable-area");
if (!selectableArea)
    throw new Error(
        "Selectable area element not found (must have id: disable-ds-selectable-area)"
    );

const ds = new DragSelect({
    selectableArea,
});

const numItems = 8;
for (let i = 0; i < numItems; i++) {
    /* Create and register the selectable item */
    const newSelectableItem = document.createElement("div");
    newSelectableItem.dataset.index = String(i);
    newSelectableItem.className = "item";
    selectableArea.appendChild(newSelectableItem);
    ds.addSelectableItem(newSelectableItem);

    /* Add a numbered tag to the item */
    const itemIndexText = document.createElement("p");
    itemIndexText.className = "item-tag";
    itemIndexText.innerText = String(i);
    newSelectableItem.appendChild(itemIndexText);
}

const toggleBtn = document.getElementById("toggle-ds-btn");
if (toggleBtn)
    toggleBtn.addEventListener("change", () => {
        if (toggleBtn instanceof HTMLInputElement) {
            if (toggleBtn.checked) ds.enable();
            else ds.disable();
        }
    });
