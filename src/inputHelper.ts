import { vec2 } from "gl-matrix";
import { MouseComponent } from "./TracePathSystem";

/** Helper class for handling mouse/touch events and bind it to the */
class MouseInput {
    constructor(public canvas: HTMLCanvasElement, public mouse: MouseComponent = new MouseComponent(1, true, vec2.fromValues(0.0, 0.0), false)) {
        this.bindEvent(this.canvas);
    }
    public bindEvent = (canvas) => {
        canvas.addEventListener("mousedown", this.mouseDown, false);
        canvas.addEventListener("mousemove", this.mouseMove, false);
        canvas.addEventListener("mouseup", this.mouseUp, false);
        canvas.addEventListener("touchstart", this.touchStart, false);
        canvas.addEventListener("touchend", this.touchEnd, false);
        canvas.addEventListener("touchmove", this.touchMove, false);

        // Prevent scrolling when touching the canvas
        document.body.addEventListener("touchstart", (evt) => {
            if (evt.target === canvas) {
                evt.preventDefault();
            }
        }, false);
        document.body.addEventListener("touchend", (evt) => {
            if (evt.target === canvas) {
                evt.preventDefault();
            }
        }, false);
        document.body.addEventListener("touchmove", (evt) => {
            if (evt.target === canvas) {
                evt.preventDefault();
            }
        }, false);
    }

    protected mouseDown = (evt) => {
        this.bindMouseCoordToComponent(this.canvas, evt, this.mouse);
        this.mouse.pressed = true;
    }

    protected mouseMove = (evt) => {
        this.bindMouseCoordToComponent(this.canvas, evt, this.mouse);
    }

    protected mouseUp = (evt) => {
        this.mouse.pressed = false;
    }

    protected touchStart = (evt) => {
        const touch = evt.touches[0];
        const mCoord = this.getMousePostion(this.canvas, touch);
        const mouseEvent = new MouseEvent("mousedown", {
            clientX: touch.clientX,
            clientY: touch.clientY,
        });
        this.canvas.dispatchEvent(mouseEvent);
        evt.preventDefault();
    }

    protected touchEnd = (evt) => {
        // const touch = e.touches[0];
        const mouseEvent = new MouseEvent("mouseup");
        this.canvas.dispatchEvent(mouseEvent);
        evt.preventDefault();
    }

    protected touchMove = (evt) => {
        const touch = evt.touches[0];
        const mouseEvent = new MouseEvent("mousemove", {
            clientX: touch.clientX,
            clientY: touch.clientY,
        });
        this.canvas.dispatchEvent(mouseEvent);
        evt.preventDefault();
    }

    protected bindMouseCoordToComponent = (canvas, evt, inputMouseComponent) => {
        const mCoord = this.getMousePostion(canvas, evt);
        inputMouseComponent.position[0] = mCoord.x;
        inputMouseComponent.position[1] = mCoord.y;
    }

    protected getMousePostion = (canvas, evt) => {
        // console.log(evt);
        const clRect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / clRect.width;
        const scaleY = canvas.height / clRect.height;
        return {
            x: (evt.clientX - clRect.left) * scaleX,
            y: (evt.clientY - clRect.top) * scaleY,
        };
    }
}
