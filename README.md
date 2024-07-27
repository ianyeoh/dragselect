# dragselect

A lightweight library that implements a simple click and drag-to-select interaction in the browser, reminiscent of a modern operating system desktop such as Windows/MacOS. The library is written as a TypeScript class consisting of ~300 lines of code, with no dependencies. See it in action [here.](https://ianyeoh.github.io/dragselect/)

![Alt Text](https://file+.vscode-resource.vscode-cdn.net/Users/ianyeoh/Desktop/code/dragselect/assets/dragselect.gif)

This is **not** a package hosted on the npm registry. The class file (dragselect.ts) is intended to be copy and pasted into your codebase, as this allows you to own the code and extend it to fit your exact needs, with no unused code. I wrote´this library as a starting point for writing custom drag-select based interactions as I often found it difficult to use out-of-the-box libraries for highly specific use-cases.

## Table of Contents

- [dragselect](#dragselect)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Features](#features)
  - [Usage](#usage)
    - [Options](#options)
    - [Event Callbacks](#event-callbacks)
    - [Adding and Removing Selectable Items](#adding-and-removing-selectable-items)
    - [Storing Data in a Selectable Element](#storing-data-in-a-selectable-element)
    - [Pausing Drag-selection](#pausing-drag-selection)

## Installation

From the root of the repository, copy over the contents of the dragselect.ts file into your code-base. That's it!

## Features

While the library is intended to be fully customisable and extensible, the base library supports:

-   Full control over areas where drag-select can be started
-   Dynamically adding selectable items
-   Full control over CSS styling
-   Creating multiple distinct drag-selectable areas
-   Disabling drag-select starting in specific areas
-   Toggling drag-select functionality programmatically

## Usage

The dragselect.ts file exports the DragSelect class. The simplest usage of this class:

```typescript
import { DragSelect } from "/path/to/file/dragselect";

const ds = new DragSelect({
    onEnd: (selectedItems: HTMLElement[]) => {
        // Logs out the list of selected
        // elements after a drag select ends
        console.log(selectedItems);
    },
});

// Register an element to be selectable
ds.addSelectableItem(document.getElementById("my-item-id"));

// Or register multiple at the same time
ds.addSelectableItem([
    /* Your items here */
]);
```

That's it! The DragSelect class automatically hooks onto the [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction) to handle the full drag-select interaction.

### Options

The constructor for the class takes an optional [options object](#options) for additional customisation.

```typescript
// All available options object with default values
const ds = new DragSelect({
    selectableArea: document.body,
    selectableElements: [],
    selectionBoxClass: "ds-selection-box",
    selectedClass: "ds-selected",
    noSelectClass: "ds-no-select",
    onStart: null,
    onDrag: null,
    onEnd: null,
});
```

```typescript
// TS option object types
type DS$Options = {
    selectableArea?: HTMLElement;
    selectableElements?: HTMLElement[];
    selectionBoxClass?: string;
    selectedClass?: string;
    noSelectClass?: string;
    onStart?: () => void;
    onDrag?: (selectedItems: HTMLElement[]) => void;
    onEnd?: (selectedItems: HTMLElement[]) => void;
};
```

You can also re-configure the options object at any time after creating the class, as many times as you want.

```typescript
const ds = new DragSelect();

ds.configure({
    /* Change any combination of options here */
});
```

### Event Callbacks

Hook into the drag-select lifecycle with the onStart, onDrag, and onEnd callback parameters in the options object. Currently only one callback can be registered for each event. Default behaviour overrides the previous callback when set.

See the full list of callbacks:

-   onStart
    -   Called when the drag-select is started (default on mouse/touch down).
-   onDrag
    -   Called when the drag-select is dragged (default on mouse/touch move while the mouse/touch is still held down)
    -   Passes an array of selected elements
-   onEnd
    -   Called when the drag-select ends (default on mouse/touch up)
    -   Passes the final array of selected elements

### Adding and Removing Selectable Items

To add or remove selectable items:

```typescript
const ds = new DragSelect();

// To add an element
ds.addSelectableItem(/* HTMLElement */);

// Or an array of elements
ds.addSelectableItem([
    /* HTMLElement(s) */
]);

// Remove an element (this also deselects the element(s))
ds.removeSelectableItem(/* HTMLElement */);

// Or an array of elements
ds.removeSelectableItem([
    /* HTMLElement(s) */
]);
```

### Storing Data in a Selectable Element

If you need to store data in the selectable element itself for access later, consider using [HTML data attributes](https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes):

```html
<!-- HTML -->
<div data-index="1">Item 1</div>
<div data-index="2">Item 2</div>
<div data-index="3">Item 3</div>
```

```typescript
// JS
const ds = new DragSelect({
    onEnd: (selectedItems) => {
        for (const item of selectedItems) {
            // access data-index with item.dataset.index
            console.log(`You selected item ${item.dataset.index}`);
        }
    },
});
```

### Pausing Drag-selection

If you need to pause drag selection functionality:

```typescript
const ds = new DragSelect();

// Stop drag-selecting, and resets drag-select state
ds.disable();

// Re-enable drag-selecting
ds.enable();
```
