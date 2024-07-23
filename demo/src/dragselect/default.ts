import { DragSelect } from "../../../dragselect";

function updateSelectedItemsText(selectedItems: HTMLElement[]) {
    const selectedItemsText = document.getElementById("default-selected-items");
    if (!selectedItemsText)
        throw new Error(
            "Selectable items text not found (must have id: default-selected-items)"
        );
    selectedItemsText.innerText = "You selected: []";

    selectedItemsText.innerText = `You selected: ${JSON.stringify(
        selectedItems.map((item) => Number(item.dataset.index))
    )}`;
}

const selectableArea = document.getElementById("default-ds-selectable-area");
if (!selectableArea)
    throw new Error(
        "Selectable area element not found (must have id: default-ds-selectable-area)"
    );

const ds = new DragSelect({
    selectableArea,
    onDrag(selectedItems) {
        updateSelectedItemsText(selectedItems);
    },
    onEnd: (selectedItems) => {
        updateSelectedItemsText(selectedItems);
    },
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

updateSelectedItemsText([]);
