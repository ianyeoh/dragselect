import { DragSelect } from "../../../../dragselect";

const selectableArea = document.getElementById("no-select-ds-selectable-area");
if (!selectableArea)
    throw new Error(
        "Selectable area element not found (must have id: no-select-ds-selectable-area)"
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
