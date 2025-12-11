# Google Maps 3D API - Complete Reference Documentation

**Compiled from:** Official Google Maps JavaScript API 3D Documentation  
**Last Updated:** December 11, 2025  
**API Version:** beta

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Altitude Modes](#altitude-modes)
3. [Best Practices](#best-practices)
4. [Localization](#localization)
5. [Map Controls](#map-controls)
6. [Customization](#customization)
7. [Interaction & Camera Control](#interaction--camera-control)
8. [Events](#events)
9. [Markers](#markers)
10. [3D Models](#3d-models)

---

## Getting Started

### Basic Setup

**HTML Structure:**
```html
<!DOCTYPE html>
<html>
<head>
  <title>Hello 3D Maps</title>
  <style>
    html, body { height:100%; margin: 0; padding: 0; }
  </style>
</head>
<body>
  <gmp-map-3d 
    mode="hybrid" 
    center="37.841157, -122.551679" 
    range="2000" 
    tilt="75" 
    heading="330">
  </gmp-map-3d>
  
  <script async src="https://maps.googleapis.com/maps/api/js?key=YOUR_KEY&v=beta&libraries=maps3d"></script>
</body>
</html>
```

**Key Requirements:**
- Use `v=beta` in the API URL
- Include `libraries=maps3d`
- Use `<gmp-map-3d>` element (web component)

### JavaScript Initialization

**Method 1: HTML Web Component**
```html
<gmp-map-3d 
  mode="hybrid" 
  center="lat,lng" 
  range="1000" 
  tilt="60">
</gmp-map-3d>
```

**Method 2: Programmatic (Recommended)**
```javascript
async function init() {
  const { Map3DElement } = await google.maps.importLibrary("maps3d");
  
  const map = new Map3DElement({
    center: { lat: 37.7704, lng: -122.3985, altitude: 500 },
    tilt: 67.5,
    range: 1000,
    heading: 0,
    mode: 'HYBRID'
  });
  
  document.body.append(map);
}

init();
```

---

## Altitude Modes

### Digital Elevation Models

Two underlying models:
1. **DTM (Digital Terrain Model)** - "Ground": Bare-earth elevation without buildings/trees
2. **DSM (Digital Surface Model)** - "Mesh": Includes terrain + buildings + trees

### AltitudeMode Options

```javascript
// 1. ABSOLUTE - Relative to mean sea level (EGM96)
{
  position: { lat, lng, altitude: 100 },
  altitudeMode: 'ABSOLUTE'
}

// 2. CLAMP_TO_GROUND - Directly on DTM, ignores altitude
{
  position: { lat, lng },
  altitudeMode: 'CLAMP_TO_GROUND'
}

// 3. RELATIVE_TO_GROUND - Offset from DTM
{
  position: { lat, lng, altitude: 50 }, // 50m above ground
  altitudeMode: 'RELATIVE_TO_GROUND'
}

// 4. RELATIVE_TO_MESH - Offset from DSM (buildings/terrain)
{
  position: { lat, lng, altitude: 20 }, // 20m above mesh
  altitudeMode: 'RELATIVE_TO_MESH'
}
```

**Best Practice:** Use `RELATIVE_TO_GROUND` or `RELATIVE_TO_MESH` for markers that should follow terrain.

---

## Best Practices

### Performance Considerations

#### 1. Load the Map

**Use Dynamic Loading:**
```javascript
// Recommended
const { Map3DElement } = await google.maps.importLibrary("maps3d");
```

**Listen to Key Events:**
```javascript
map.addEventListener('gmp-steadystate', ({isSteady}) => {
  if (isSteady) {
    // Map is fully loaded and stable
    // Safe to add markers, animate camera, etc.
  }
});

map.addEventListener('gmp-error', (error) => {
  console.error('Map error:', error);
});
```

#### 2. Initial Scene Settings

- **Prefer less zoomed-in views** (higher altitude)
- **Use low or no tilt** for faster initial load
- **Add bounds** to restrict user focus area

```javascript
const map = new Map3DElement({
  center: { lat, lng, altitude: 2000 }, // Higher altitude = faster
  tilt: 0, // Start flat
  bounds: {
    south: 37,
    west: -123,
    north: 38,
    east: -121
  }
});
```

#### 3. Preloader Pattern

```javascript
async function initMap() {
  await google.maps.importLibrary("maps3d");
  
  const map = document.querySelector('gmp-map-3d');
  const preloader = document.querySelector('#preloader');
  
  map.addEventListener('gmp-steadystate', ({isSteady}) => {
    if (isSteady) {
      preloader.style.display = 'none';
    }
  });
}
```

#### 4. Marker Performance

**Optimal Customization:**
- **Use `PinElement`** for basic changes (color, scale, border, text) - MOST PERFORMANT
- **Use `HTMLImageElement` or `SVGElement` sparingly** - requires rasterization
- **Wrap custom elements in `<template>`** before assigning to marker

```javascript
// GOOD - PinElement
const pin = new PinElement({
  background: '#FF0000',
  glyphColor: 'white',
  scale: 1.5
});

// OK - Custom SVG (use sparingly)
const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
const template = document.createElement('template');
template.content.append(svg);
marker.append(template);
```

**Collision Behavior:**
```javascript
const marker = new Marker3DElement({
  position: {lat, lng},
  collisionBehavior: google.maps.CollisionBehavior.REQUIRED // Always visible
});
```

**Occlusion:**
```javascript
// Only for critical markers that MUST be seen through buildings
marker.drawsWhenOccluded = true;
```

#### 5. Avoid Updates During User Interaction

```javascript
// Listen to these events to pause updates
map.addEventListener('gmp-centerchange', () => {
  // User is panning - don't update markers
});

map.addEventListener('gmp-rangechange', () => {
  // User is zooming - don't update markers
});
```

#### 6. Use requestAnimationFrame

```javascript
function animate() {
  // Perform calculations here
  const newPosition = calculatePosition();
  
  // Update map in single call
  requestAnimationFrame(() => {
    marker.position = newPosition;
  });
}
```

---

## Localization

### Language

```javascript
const map = new Map3DElement({
  center: { lat: 37.7704, lng: -122.3985, altitude: 500 },
  language: "ZH", // Chinese
  region: "CN"    // China
});
```

**Precedence Order:**
1. Map3DElement definition
2. Maps JavaScript API loader
3. Browser setting and domain

---

## Map Controls

### Default Controls

- **Zoom control**: +/- buttons
- **Move control**: ←/→/↑/↓ buttons
- **Rotate controls**: Change heading
- **Tilt control**: Change camera tilt
- **Compass control**: Reset to north

### Disable All Controls

**HTML:**
```html
<gmp-map-3d default-ui-disabled></gmp-map-3d>
```

**JavaScript:**
```javascript
const map = new Map3DElement({
  defaultUIHidden: true
});
```

---

## Customization

### Cloud-Based Styling

1. Create a Map ID in Google Cloud Console
2. Link your style to the Map ID
3. Use the Map ID in your map

```javascript
const map = new Map3DElement({
  mapId: 'YOUR_MAP_ID'
});
```

**Limitations:**
- Dark mode not supported
- Data-driven styling not supported

---

## Interaction & Camera Control

### Restrict Map Bounds

```javascript
const map = new Map3DElement({
  bounds: {
    south: 37,
    west: -123,
    north: 38,
    east: -121
  }
});
```

### Restrict Camera

```javascript
const map = new Map3DElement({
  minAltitude: 1,
  maxAltitude: 1000,
  minTilt: 35,
  maxTilt: 55,
  minHeading: 0,
  maxHeading: 360
});
```

### Preset Camera Paths

#### Fly To
```javascript
map.flyCameraTo({
  endCamera: {
    center: { lat: 37.6191, lng: -122.3816 },
    tilt: 67.5,
    range: 1000
  },
  durationMillis: 5000
});
```

#### Fly Around
```javascript
map.flyCameraAround({
  camera: {
    center: { lat, lng },
    tilt: 60,
    range: 1000
  },
  durationMillis: 60000,
  repeatCount: 1
});
```

#### Combine Animations
```javascript
map.flyCameraTo({
  endCamera: flyToCamera,
  durationMillis: 5000,
});

map.addEventListener('gmp-animation-end', () => {
  map.flyCameraAround({
    camera: flyToCamera,
    durationMillis: 60000,
    repeatCount: 1
  });
}, {once: true});
```

### Gesture Handling

```javascript
const map = new Map3DElement({
  gestureHandling: 'COOPERATIVE' // Requires CMD/CTRL to zoom
  // or 'GREEDY' - reacts to all gestures
  // or 'AUTO' - depends on iframe context
});
```

---

## Events

### Event Types

1. **User Interaction Events** - Mouse clicks, keyboard
2. **State Change Notifications** - `gmp-propertychange` pattern

### Key Events

```javascript
// Map is fully loaded and stable
map.addEventListener('gmp-steadystate', ({isSteady}) => {
  if (isSteady) {
    // Safe to add content
  }
});

// Map error
map.addEventListener('gmp-error', (error) => {
  console.error(error);
});

// Camera changes
map.addEventListener('gmp-centerchange', (event) => {});
map.addEventListener('gmp-headingchange', (event) => {});
map.addEventListener('gmp-rangechange', (event) => {});
map.addEventListener('gmp-rollchange', (event) => {});
map.addEventListener('gmp-tiltchange', (event) => {});

// Animation
map.addEventListener('gmp-animation-end', () => {});
```

---

## Markers

### Add Marker (HTML)

```html
<gmp-map-3d>
  <gmp-marker-3d position="48.861000,2.335861"></gmp-marker-3d>
</gmp-map-3d>
```

### Add Marker (JavaScript)

```javascript
const marker = new Marker3DElement({
  position: {lat: 47.6093, lng: -122.3402},
  altitudeMode: "ABSOLUTE",
  extruded: true,
  label: "Basic Marker"
});

map.append(marker);
```

### Basic Customization

#### Scale
```javascript
const pin = new PinElement({
  scale: 1.5
});
const marker = new Marker3DElement({
  position: { lat, lng }
});
marker.appendChild(pin);
```

#### Colors
```javascript
const pin = new PinElement({
  background: '#FBBC04',      // Background color
  borderColor: '#137333',     // Border color
  glyphColor: 'white'         // Glyph color
});
```

#### Text Glyph
```javascript
const pin = new PinElement({
  glyphText: "T",
  glyphColor: "white"
});
```

#### Altitude
```javascript
const marker = new Marker3DElement({
  position: { lat, lng, altitude: 100 },
  altitudeMode: 'RELATIVE_TO_GROUND',
  extruded: true
});
```

### Graphics Customization

#### Image File
```javascript
const img = document.createElement('img');
img.src = 'path/to/image.png';

const template = document.createElement('template');
template.content.append(img);

marker.append(template);
```

#### Custom SVG
```javascript
const pin = new PinElement({
  background: 'white',
  glyphSrc: new URL('path/to/icon.svg', import.meta.url)
});
```

#### Inline SVG
```javascript
const svgString = '<svg>...</svg>';
const parser = new DOMParser();
const svg = parser.parseFromString(svgString, 'image/svg+xml').documentElement;

const template = document.createElement('template');
template.content.append(svg);

marker.append(template);
```

### Interactive Markers

```javascript
const interactiveMarker = new google.maps.marker.Marker3DInteractiveElement({
  position: {lat, lng}
});

interactiveMarker.addEventListener('gmp-click', (event) => {
  // Handle click
});
```

### Collision Behavior

```javascript
const marker = new Marker3DElement({
  position: {lat, lng},
  collisionBehavior: google.maps.CollisionBehavior.REQUIRED
  // or REQUIRED_AND_HIDES_OPTIONAL
  // or OPTIONAL_AND_HIDES_LOWER_PRIORITY
});
```

### Remove Markers

```javascript
const marker = document.querySelector('gmp-marker-3d');
marker.remove();
```

---

## 3D Models

### Add a Model

```javascript
const model = new Model3DElement({
  position: { lat, lng, altitude: 0 },
  src: 'path/to/model.gltf',
  altitudeMode: 'RELATIVE_TO_GROUND'
});

map.append(model);
```

### Interactive Model

```javascript
model.addEventListener('gmp-click', (event) => {
  // Handle click
});
```

---

## Common Patterns

### Pattern 1: Wait for Map to Load

```javascript
async function initMap() {
  const { Map3DElement } = await google.maps.importLibrary("maps3d");
  
  const map = new Map3DElement({
    center: { lat, lng, altitude: 500 },
    tilt: 67.5
  });
  
  document.body.append(map);
  
  // Wait for map to be ready
  await new Promise(resolve => {
    map.addEventListener('gmp-steadystate', ({isSteady}) => {
      if (isSteady) resolve();
    }, {once: true});
  });
  
  // Now safe to add markers
  addMarkers(map);
}
```

### Pattern 2: Add Multiple Markers

```javascript
async function addMarkers(map) {
  const { Marker3DElement } = await google.maps.importLibrary("maps3d");
  const { PinElement } = await google.maps.importLibrary("marker");
  
  const locations = [
    { lat: 37.4, lng: -122.1 },
    { lat: 37.5, lng: -122.2 }
  ];
  
  locations.forEach(location => {
    const pin = new PinElement({
      background: '#FF0000'
    });
    
    const marker = new Marker3DElement({
      position: location
    });
    
    marker.appendChild(pin);
    map.append(marker);
  });
}
```

### Pattern 3: Handle Errors

```javascript
async function initMap() {
  try {
    const { Map3DElement } = await google.maps.importLibrary("maps3d");
    
    const map = new Map3DElement({
      center: { lat, lng, altitude: 500 }
    });
    
    map.addEventListener('gmp-error', (error) => {
      console.error('Map error:', error);
      showErrorMessage();
    });
    
    document.body.append(map);
  } catch (error) {
    console.error('Failed to load maps3d library:', error);
  }
}
```

---

## Key Differences from 2D Maps

1. **Web Components** - Uses `<gmp-map-3d>` instead of `<div>`
2. **Import Library** - Must use `google.maps.importLibrary("maps3d")`
3. **Camera Model** - Uses `range`, `tilt`, `heading` instead of `zoom`
4. **Altitude** - All positions can have altitude values
5. **3D Markers** - Use `Marker3DElement` not `Marker`
6. **Events** - Different event names (`gmp-*` prefix)

---

## Troubleshooting

### Map Not Loading

1. Check API key has Maps JavaScript API enabled
2. Verify `v=beta` in script URL
3. Verify `libraries=maps3d` in script URL
4. Check browser console for errors

### Markers Not Showing

1. Wait for `gmp-steadystate` event before adding markers
2. Verify marker position is within map bounds
3. Check altitude mode and altitude values
4. Verify marker is appended to map: `map.append(marker)`

### Performance Issues

1. Reduce number of markers
2. Use `PinElement` instead of custom graphics
3. Start with higher altitude (less zoomed in)
4. Start with lower tilt (more flat)
5. Add bounds to restrict area

---

## Complete Example

```html
<!DOCTYPE html>
<html>
<head>
  <title>3D Map with Markers</title>
  <style>
    html, body { height: 100%; margin: 0; padding: 0; }
    #map { width: 100%; height: 100%; }
  </style>
</head>
<body>
  <div id="map"></div>
  
  <script>
    async function initMap() {
      // Load libraries
      const { Map3DElement, Marker3DElement } = await google.maps.importLibrary("maps3d");
      const { PinElement } = await google.maps.importLibrary("marker");
      
      // Create map
      const map = new Map3DElement({
        center: { lat: 37.7704, lng: -122.3985, altitude: 500 },
        tilt: 67.5,
        range: 1000,
        heading: 0,
        mode: 'HYBRID'
      });
      
      document.getElementById('map').append(map);
      
      // Wait for map to load
      map.addEventListener('gmp-steadystate', ({isSteady}) => {
        if (isSteady) {
          // Add marker
          const pin = new PinElement({
            background: '#FF0000',
            glyphColor: 'white',
            scale: 1.5
          });
          
          const marker = new Marker3DElement({
            position: { lat: 37.7704, lng: -122.3985, altitude: 100 },
            altitudeMode: 'RELATIVE_TO_GROUND',
            extruded: true
          });
          
          marker.appendChild(pin);
          map.append(marker);
        }
      }, {once: true});
      
      // Handle errors
      map.addEventListener('gmp-error', (error) => {
        console.error('Map error:', error);
      });
    }
    
    initMap();
  </script>
  
  <script async src="https://maps.googleapis.com/maps/api/js?key=YOUR_KEY&v=beta&libraries=maps3d,marker"></script>
</body>
</html>
```

---

## Resources

- [Official Documentation](https://developers.google.com/maps/documentation/javascript/3d/)
- [Code Samples](https://github.com/googlemaps-samples/js-api-samples)
- [Stack Overflow](http://stackoverflow.com/questions/tagged/google-maps)
- [Discord Community](https://discord.gg/f4hvx8Rp2q)
