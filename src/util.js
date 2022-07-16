// Blur focus from the element if event is a mouse event (e.g. to hide focus ring)
export function blurIfMouse(event) {
  if (event.nativeEvent.clientX !== 0 && event.nativeEvent.clientY !== 0) {
    event.target.blur();
  }
}
