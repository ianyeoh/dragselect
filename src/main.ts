import { DragSelect } from "./dragselect";
import "./style.css";

const selectableArea = document.getElementById("ds-selectable-area");

if (!selectableArea)
    throw new Error(
        "Selectable area element not found (must have id: ds-selectable-area)"
    );

const ds = new DragSelect({
    selectableArea,
    onEnd: (selectedItems) => {
        console.log(selectedItems);
    },
});

for (let i = 0; i < 8; i++) {
    const newSelectableItem = document.createElement("div");
    newSelectableItem.className = "item";
    selectableArea.appendChild(newSelectableItem);

    if (i !== 0) ds.addSelectableItem(newSelectableItem);
}
