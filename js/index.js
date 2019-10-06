/**
  AFRAME.registerComponent(param1, param2)
  * Components have to be registered before use them anywhere in <a-scene>
  * Meaning from an HTML file, components should come in order before <a-scene>
  * Parameters:
  *   1. {string} name - Component name - represented as HTML attribute name
  *   2. {Object} definition - Component definition - contains schema and lifecycle handler methods.
  * --------------------------------------------------------------------------------------------------
  * *'schema' - is an object that defines and describes the property or properties of the component. 
  *   The schema’s keys are the names of the property, and the schema’s values define the types and 
  *   values of the property.
*/

// Register 'spot' component
AFRAME.registerComponent('spot', {
  schema: {
    linkTo: {type: 'string', default: ''},
    spotGroup: {type: 'string', default: ''}
  },
  init: function() {
    addSpot(this.el, this.data)
  }
});

// Register 'hotspots' component
AFRAME.registerComponent('hotspots', {
  init: async function() {
    const jsonURL = './json/map.json';
    const hotspotsEl = this.el;

    const map = await fetchMap(jsonURL);
    const reloadedHotspots = await addReloadSpotsEvent(hotspotsEl, map);
    const hotSpots = await addHotspots(map, reloadedHotspots);
  }
});


/**
 * @param {HTMLObject} spotAImage - <a-image spot ...>
 * @param {HTMLObject} navData - {linkto: "./img/p2.jpg", spotgroup: "group-scene2"}
 */
function addSpot(spotAImage, navData){
  // Add image source of hotspot icon
  spotAImage.setAttribute("src","#hotspot");
  // Make the icon look at the camera all the time
  spotAImage.setAttribute("look-at","#cam");
  
  spotAImage.addEventListener('click', function(){
    // Set the skybox source to the new image as per the spot
    const sky = document.getElementById("skybox");
    sky.setAttribute("src", navData.linkto);
    
    const spotcomp = document.getElementById("spots");
    const currspots = this.parentElement.getAttribute("id");

    // Create special event for 'spots' entity (element of DOM) for changinng the spots data
    spotcomp.emit('reloadspots', {newspots: navData.spotgroup, currspots: currspots});
  });
}


/**
 * Add event listener for 'reloadspots' event, load on scene change
 * @param {HRMLObject} hotspotsEl - <a-entity hotspots ...>
 * @param {object} map - dependency map between scenes, from external .json file
 */
function addReloadSpotsEvent(hotspotsEl, map) {

  hotspotsEl.addEventListener('reloadspots', function(evt){
    // Get the entire current spot group and scale it to 0
    const currspotgroup = document.getElementById(evt.detail.currspots);
    currspotgroup.setAttribute('scale', '0 0 0');
    
    // Get the entire new spot group and scale it to 1
    const newspotgroup = document.getElementById(evt.detail.newspots);
    newspotgroup.setAttribute('scale', '1 1 1');

    const currentSceneID = currspotgroup.getAttribute('id');
    const nextSceneID = newspotgroup.getAttribute('id');

    map.spots.forEach(spot => {
      if (spot.id === currentSceneID){
        spot.nav.forEach(nav => {
          // Get all character after 'p:' string -> name of a gruop, i.e 'group-scene3'
          const navLinkTo = nav.spotProp.substr(nav.spotProp.indexOf("p:") + 2);

          if (navLinkTo === nextSceneID){
            // Add camera 'rotation' depending on the direction of movement
            const cam = document.getElementById('cam');
            cam.setAttribute('rotation', nav.rotation);
          }
        })
      }
    })
  });

  return hotspotsEl;
}


/**
 * Load dependency map between scenes, from external .json file
 * @param {string} jsonURL - path to file: ./json/map.json
 */
function fetchMap(jsonURL) {
  return fetch(jsonURL).then(res => res.json());
}


/**
 * Add hotspots for all scenes
 * @param {object} map - dependency map between scenes, from external .json file
 * @param {HTMLObject} reloadedHotspots - HTML object which already has all rolad actions - <a-entity hotspots ...>
 */
function addHotspots(map, reloadedHotspots) {

  map.spots.forEach(spot => {
    // Create blank entity and set its attributes
    const newSpotEl = document.createElement('a-entity');
    newSpotEl.setAttribute('id', spot.id);
    newSpotEl.setAttribute('scale', spot.scale);

    spot.nav.forEach(nav => {
      // Regex for fetching name of the target point - #<pointX>;
      const regex = /\#(.*?)\;/gm;
      const spotScene = regex.exec(nav.spotProp)[1];

      // Get point from 'points' which include searched point
      const scene = map.scenes.filter(scene => (
        scene.id === spotScene
      ))[0];

      // Set new variable according to spot.spotProp value
      const newSpot = `linkto:${scene.src}; spotgroup:${scene.id}`;

      // Create an image on a flat plane and set its attributes
      const newImage = document.createElement('a-image');
      newImage.setAttribute('spot', newSpot);
      newImage.setAttribute('position', nav.position);

      // Attach image to hotspot element
      newSpotEl.appendChild(newImage);
    })

    // Attach a-entity to hotspots scene
    reloadedHotspots.appendChild(newSpotEl);
  });
}