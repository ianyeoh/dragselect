type DS$Coordinate = {
    x: number;
    y: number;
};

export class DragSelect {
    selecting: boolean = false;
    selectableArea: HTMLElement;

    /* The selection box is the rectangle that is drawn when selecting */
    selectionBox: HTMLDivElement;
    selectionBoxOrigin: DS$Coordinate | null = null;

    /**
     * Creates a new DragSelect object.
     * @param {HTMLElement} selectableArea The HTMLElement where the user can begin a drag-select
     */
    constructor(selectableArea: HTMLElement) {
        this.selectableArea = selectableArea;

        /* Create the selection box element and append it to the DOM */
        this.selectionBox = document.createElement("div");
        this.selectionBox.style.display = "none";
        this.selectionBox.className = "ds-selection-box";
        document.body.appendChild(this.selectionBox);

        /* Register the event listeners that trigger each drag event
         * These can be configured to run on any browser supported event, on
         * any element on the page, depending on the intended interaction.
         *
         * For example, drag selection can be bound to a keyboard key instead,
         * or when the mouse enters an element.
         */
        this.selectableArea.addEventListener("mousedown", (e) => {
            this.onDragStart(e);
        });
        document.addEventListener("mousemove", (e) => {
            this.onDragUpdate(e);
        });
        document.addEventListener("mouseup", (e) => {
            this.onDragEnd(e);
        });
    }

    /**
     * Start a drag-select. The function sets this.selecting to true,
     * and records the mouse location where the drag-select was started
     * to draw the selection box.
     *
     * @param {MouseEvent} e
     * @returns {void}
     */
    onDragStart(e: MouseEvent): void {
        this.selecting = true;

        this.selectionBoxOrigin = {
            x: e.clientX,
            y: e.clientY,
        };

        this.drawSelectionBox(this.selectionBoxOrigin);
        return;
    }

    /**
     * Update the drag selection box when the mouse is moved. Early
     * return if not currently in a drag-select interaction.
     *
     * @param {MouseEvent} e
     * @returns {void}
     */
    onDragUpdate(e: MouseEvent): void {
        if (!this.selecting || !this.selectionBoxOrigin) return;

        const mouseDelta: DS$Coordinate = {
            x: e.clientX,
            y: e.clientY,
        };

        this.drawSelectionBox(mouseDelta);
        return;
    }

    /**
     * Ends the drag-select interaction and resets the drag selection state.
     *
     * @param {MouseEvent} _e
     * @returns {void}
     */
    onDragEnd(_e: MouseEvent): void {
        if (!this.selecting) return;

        this.reset();
        return;
    }

    /**
     * Draws the selection box on the screen by updating the element style.
     * One of the corners of the box are set by the initial mouse cursor
     * position when the drag select was started, while the other corner
     * is set by the current mouse position (mouseDelta).
     *
     * @param {DS$Coordinate} mouseDelta The new mouse position.
     * @returns {void}
     */
    drawSelectionBox(mouseDelta: DS$Coordinate): void {
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
     * Predicate that returns whether the two drawn elements are overlapping.
     *
     * @param {HTMLElement} a
     * @param {HTMLElement} b
     * @returns {boolean}
     */
    isOverlapping(a: HTMLElement, b: HTMLElement): boolean {
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
     * Resets internal dragselect fields back to a default state.
     */
    reset(): void {
        this.selecting = false;
        this.selectionBoxOrigin = null;
        this.selectionBox.style.display = "none";
    }
}
