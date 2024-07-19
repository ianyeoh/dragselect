import { DragSelect } from "./dragselect";
import "./style.css";

const dsSelectableArea = document.getElementById("ds-selectable-area");

if (!dsSelectableArea)
    throw new Error(
        "Selectable area element not found (must have id: ds-selectable-area)"
    );

const ds = new DragSelect(dsSelectableArea);
