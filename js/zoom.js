// Enabling camera zoom functionality
window.addEventListener('wheel', event => {
    // Getting the mouse wheel change  and normalizing it 
    const rotation = Math.sign(event.wheelDelta);

    var vrCamera = document.getElementById('cam').getAttribute('camera');
    var finalZoom = document.getElementById('cam').getAttribute('camera').zoom + rotation * 0.07;

    // Limiting the zoom o 5
    if (finalZoom < 1) finalZoom = 1;
    if (finalZoom > 5) finalZoom = 5;

    vrCamera.zoom = finalZoom;

    // Setting the vrCamera property into HTML camera element
    document.getElementById('cam').setAttribute('camera', vrCamera);
});