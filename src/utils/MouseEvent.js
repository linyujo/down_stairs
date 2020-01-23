function MouseEvent({
    canvas: canvas,
    handleMouseMove: handleMouseMove,
    handleMouseDown: handleMouseDown,
    handleMouseUp: handleMouseUp,
}) {
    if (handleMouseMove) {
        canvas.addEventListener("mousemove", handleMouseMove);
    }
    if (handleMouseDown) {
        canvas.addEventListener("mousedown", handleMouseDown);
    }
    if (handleMouseUp) {
        canvas.addEventListener("mouseup", handleMouseUp);
    }
}

export default MouseEvent;