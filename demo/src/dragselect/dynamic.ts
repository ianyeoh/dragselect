import { DragSelect } from "../../../dragselect";

let items: HTMLElement[] = [];
function createItem() {
    if (!selectableArea) return;

    /* Create and register the selectable item */
    const newSelectableItem = document.createElement("div");
    newSelectableItem.dataset.index = String(items.length);
    newSelectableItem.className = "item";
    selectableArea.appendChild(newSelectableItem);
    ds.addSelectableItem(newSelectableItem);

    /* Add a numbered tag to the item */
    const itemIndexText = document.createElement("p");
    itemIndexText.className = "item-tag";
    itemIndexText.innerText = String(items.length);
    newSelectableItem.appendChild(itemIndexText);

    items.push(newSelectableItem);
}

function removeItem() {
    const removedItem = items.pop();

    if (removedItem) {
        ds.removeSelectableItem(removedItem);
        removedItem.remove();
    }
}

const selectableArea = document.getElementById("dynamic-ds-selectable-area");
if (!selectableArea)
    throw new Error(
        "Selectable area element not found (must have id: dynamic-ds-selectable-area)"
    );

const ds = new DragSelect({
    selectableArea,
});

const addBtn = document.getElementById("dynamic-ds-add-btn");
const removeBtn = document.getElementById("dynamic-ds-remove-btn");

if (addBtn)
    addBtn.addEventListener("click", () => {
        createItem();
    });

if (removeBtn)
    removeBtn.addEventListener("click", () => {
        removeItem();
    });

createItem();
