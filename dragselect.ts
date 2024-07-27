type DS$Coordinate = {
    x: number;
    y: number;
};

export type DS$Options = {
    // --------------------------------------- DEFAULT VALUES
    selectableArea?: HTMLElement; // ---------    document.body
    selectableElements?: HTMLElement[]; // ---    []
    selectionBoxClass?: string; // -----------    "ds-selection-box"
    selectedClass?: string; // ---------------    "ds-selected"
    noSelectClass?: string; // ---------------    "ds-no-select"

    // Drag-select lifecycle callbacks
    onStart?: () => void;
    onDrag?: (selectedItems: HTMLElement[]) => void;
    onEnd?: (selectedItems: HTMLElement[]) => void;
};

export class DragSelect {
    disabled: boolean = false; // disables drag-select from starting if true

    selecting: boolean = false;
    selectableArea: HTMLElement = document.body;
    selectableItems: HTMLElement[] = [];

    /* The selection box is the rectangle that is drawn when selecting */
    selectionBox: HTMLDivElement;
    selectionBoxOrigin: DS$Coordinate | null = null;

    selectedClass: string = "ds-selected";
    noSelectClass: string = "ds-no-select";
    selectedItems: HTMLElement[] = [];

    /* This is an AbortController that is passed to all event handlers.
     * Use this.globalEventController.abort() to remove all event handlers.
     */
    globalEventController = new AbortController();

    onStart: (() => void) | null = null;
    onDrag: ((selectedItems: HTMLElement[]) => void) | null = null;
    onEnd: ((selectedItems: HTMLElement[]) => void) | null = null;

    /**
     * @param {DS$Options} options Drag-select options
     */
    constructor(options: DS$Options | null) {
        /* Create the selection box element and append it to the DOM */
        this.selectionBox = document.createElement("div");
        this.selectionBox.style.display = "none";
        this.selectionBox.className = "ds-selection-box";
        document.body.appendChild(this.selectionBox);

        if (options) this.configure(options);
    }

    /**
     * Configure the drag-select options. This can be set dynamically after
     * the drag-select instance is created.
     *
     * @param {DS$Options} options
     */
    configure({
        selectableArea,
        selectionBoxClass,
        selectableElements,
        selectedClass,
        noSelectClass,
        onStart,
        onDrag,
        onEnd,
    }: DS$Options) {
        if (selectableArea) {
            this.selectableArea = selectableArea;
        }
        if (selectableElements) this.selectableItems = selectableElements;
        if (selectedClass) this.selectedClass = selectedClass;
        if (noSelectClass) this.noSelectClass = noSelectClass;
        if (onStart) this.onStart = onStart;
        if (onDrag) this.onDrag = onDrag;
        if (onEnd) this.onEnd = onEnd;
        if (selectionBoxClass) this.selectionBox.className = selectionBoxClass;

        this.#cleanupEventListeners();
        this.#registerEventListeners();
    }

    /**
     * Register the event listeners that trigger each stage of the drag-select
     * interaction lifecycle. These can be configured to run on any browser
     * supported event, on any element on the page, depending on the intended
     * interaction.
     *
     * For example, drag selection can be bound to a keyboard key instead.
     */
    #registerEventListeners() {
        /* Mouse-based drag-select */
        this.selectableArea.addEventListener(
            "mousedown",
            (e) => {
                this.onDragStart(e);
            },
            { signal: this.globalEventController.signal }
        );
        document.addEventListener(
            "mousemove",
            (e) => {
                this.onDragUpdate(e);
            },
            { signal: this.globalEventController.signal }
        );
        document.addEventListener(
            "mouseup",
            (e) => {
                this.onDragEnd(e);
            },
            { signal: this.globalEventController.signal }
        );

        /* Mobile-based (touchscreen) drag-select */
        this.selectableArea.addEventListener(
            "touchstart",
            (e) => {
                this.onDragStart(e);
            },
            { signal: this.globalEventController.signal }
        );
        document.addEventListener(
            "touchmove",
            (e) => {
                this.onDragUpdate(e);
            },
            { signal: this.globalEventController.signal }
        );
        document.addEventListener(
            "touchend",
            (e) => {
                this.onDragEnd(e);
            },
            { signal: this.globalEventController.signal }
        );
    }

    #cleanupEventListeners() {
        this.globalEventController.abort();
        // Can't be re-used
        this.globalEventController = new AbortController();
    }

    /**
     * Parses out a browser mouse or touch event into a coordinate
     * (x & y coordinates of the interaction).
     *
     * @param {MouseEvent | TouchEvent} e
     * @returns {DS$Coordinate}
     */
    #getInteractionCoordinates(e: MouseEvent | TouchEvent): DS$Coordinate {
        let x;
        let y;
        if (e instanceof TouchEvent) {
            // only care about the first touch
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
        } else {
            x = e.clientX;
            y = e.clientY;
        }

        return {
            x,
            y,
        };
    }

    /**
     * Start a drag-select. The function sets this.selecting to true,
     * and records the mouse location where the drag-select was started
     * to draw the selection box.
     *
     * Early return if disabled, or the mouse-down target contains the noSelect class.
     *
     * @param {MouseEvent | TouchEvent} e
     * @returns {void}
     */
    onDragStart(e: MouseEvent | TouchEvent): void {
        if (this.disabled) return;

        /* Prevent drag starting on an element that contains the noSelect class name */
        if (e.target && e.target instanceof Element) {
            if (e.target.classList.contains(this.noSelectClass)) return;
        }

        this.selecting = true;
        this.selectedItems = [];
        this.selectableItems.forEach((item) =>
            item.classList.remove(this.selectedClass)
        );

        this.selectionBoxOrigin = this.#getInteractionCoordinates(e);
        this.#drawSelectionBox(this.selectionBoxOrigin);

        if (this.onStart) this.onStart();

        return;
    }

    /**
     * Update the drag selection box when the mouse is moved. Early
     * return if not currently in a drag-select interaction.
     *
     * @param {MouseEvent | TouchEvent} e
     * @returns {void}
     */
    onDragUpdate(e: MouseEvent | TouchEvent): void {
        if (!this.selecting || !this.selectionBoxOrigin) return;

        const mouseDelta: DS$Coordinate = this.#getInteractionCoordinates(e);

        this.#drawSelectionBox(mouseDelta);
        this.selectedItems = this.#getOverlappingSelectables();

        if (this.onDrag) this.onDrag(this.selectedItems);

        return;
    }

    /**
     * Ends the drag-select interaction and resets the drag selection state.
     *
     * @param {MouseEvent | TouchEvent} _e
     * @returns {void}
     */
    onDragEnd(_e: MouseEvent | TouchEvent): void {
        if (!this.selecting) return;

        this.selecting = false;
        this.selectionBoxOrigin = null;
        this.selectionBox.style.display = "none";

        if (this.onEnd) this.onEnd(this.selectedItems);

        return;
    }

    /**
     * Draws the selection box on the screen by updating the style of this.selectionBox.
     * Coordinates of one of the corners of the box are set by the initial mouse cursor
     * position when the drag select was started (this.selectionBoxOrigin).
     * The opposing corner is set by the current mouse position (mouseDelta).
     *
     * @param {DS$Coordinate} mouseDelta The current mouse position.
     * @returns {void}
     */
    #drawSelectionBox(mouseDelta: DS$Coordinate): void {
        if (!this.selectionBoxOrigin) return;

        const box = {
            x: Math.min(this.selectionBoxOrigin.x, mouseDelta.x),
            y: Math.min(this.selectionBoxOrigin.y, mouseDelta.y),
            width: Math.abs(this.selectionBoxOrigin.x - mouseDelta.x),
            height: Math.abs(this.selectionBoxOrigin.y - mouseDelta.y),
        };

        this.selectionBox.style.position = "fixed";
        this.selectionBox.style.display = "block";
        this.selectionBox.style.left = `${box.x}px`;
        this.selectionBox.style.top = `${box.y}px`;
        this.selectionBox.style.width = `${box.width}px`;
        this.selectionBox.style.height = `${box.height}px`;
    }

    /**
     * Iterates through this.selectableElements and filters out
     * elements that overlap with the selection box using isOverlapping().
     *
     * Side-effect: adds this.selectedClass to the class list of each overlapping
     * element, and removes it if not overlapping.
     *
     * @returns {HTMLElement[]}
     */
    #getOverlappingSelectables(): HTMLElement[] {
        const overlapArray: HTMLElement[] = [];
        this.selectableItems.forEach((item) => {
            if (this.#isOverlapping(this.selectionBox, item)) {
                overlapArray.push(item);
                item.classList.add(this.selectedClass);
            } else {
                item.classList.remove(this.selectedClass);
            }
        });
        return overlapArray;
    }

    /**
     * Predicate that evaluates whether two elements overlap.
     *
     * @param {HTMLElement} a
     * @param {HTMLElement} b
     * @returns {boolean}
     */
    #isOverlapping(a: HTMLElement, b: HTMLElement): boolean {
        const rectA = a.getBoundingClientRect();
        const rectB = b.getBoundingClientRect();
        return !(
            rectA.right < rectB.left ||
            rectA.left > rectB.right ||
            rectA.bottom < rectB.top ||
            rectA.top > rectB.bottom
        );
    }

    /**
     * Enable drag-selection on a DOM element, or a list of elements.
     *
     * @param {HTMLElement[]} items
     */
    addSelectableItem(items: HTMLElement | HTMLElement[]): void {
        if (!Array.isArray(items)) this.selectableItems.push(items);
        else this.selectableItems.push(...items);
    }

    /**
     * Disable drag-selection on a DOM element, or a list of elements.
     *
     * @param {HTMLElement[]} items
     */
    removeSelectableItem(items: HTMLElement | HTMLElement[]): void {
        const itemsArray: HTMLElement[] = [];
        if (!Array.isArray(items)) itemsArray.push(items);
        else itemsArray.push(...items);

        itemsArray.forEach((item) => {
            /* Remove from selectable items array */
            const selectableItemsIndex = this.selectableItems.findIndex(
                (selectable) => item.isEqualNode(selectable)
            );

            if (selectableItemsIndex !== -1) {
                this.selectableItems.splice(selectableItemsIndex, 1);
            }

            /* Remove from selected items array, if present */
            const selectedItemsIndex = this.selectedItems.findIndex(
                (selectable) => {
                    item.isEqualNode(selectable);
                }
            );

            if (selectedItemsIndex !== -1) {
                this.selectableItems.splice(selectedItemsIndex, 1);
                item.classList.remove(this.selectedClass);
            }
        });
    }

    disable() {
        this.selectedItems.forEach((item) =>
            item.classList.remove(this.selectedClass)
        );
        this.selectedItems = [];
        this.disabled = true;
    }

    enable() {
        this.disabled = false;
    }
}
