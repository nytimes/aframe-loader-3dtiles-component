# aframe-loader-3dtiles-component

[![Version](http://img.shields.io/npm/v/aframe-loader-3dtiles-component.svg?style=flat-square)](https://npmjs.org/package/aframe-loader-3dtiles-component)
[![License](http://img.shields.io/npm/l/aframe-loader-3dtiles-component.svg?style=flat-square)](https://npmjs.org/package/aframe-loader-3dtiles-component)
[![Build Status](https://cloud.drone.io/api/badges/nytimes/aframe-loader-3dtiles-component/status.svg)](https://cloud.drone.io/nytimes/aframe-loader-3dtiles-component)

An [A-Frame](https://aframe.io) component for displaying _OGC 3D Tiles_ based on [nytimes/three-loader-3dtiles](https://github.com/nytimes/three-loader-3dtiles).

[Demos](#demos) &mdash;
[API](#api) &mdash;
[Installation](#installation) &mdash;
[Usage](#usage) &mdash;
[Contributing](#contributing) &mdash;
[Roadmap](#roadmap)


<img src="https://user-images.githubusercontent.com/39962/141192128-3449b84d-8575-4e86-aab3-f615d22a16b5.jpg" width="500px">

The loader uses the [loaders.gl library](https://github.com/visgl/loaders.gl), which is part of the [vis.gl platform](https://vis.gl/), openly governed by the [Urban Computing Foundation](https://uc.foundation/). Development of the loader started at The New York Times R&D as an effort deliver massive 3D and Geographical journalism to readers. This A-Frame components makes _3D Tiles_ more accessible to creators and brings immersitve journalism into mixed realities on the web.

## Demos
### Demos are available [here](https://nytimes.github.io/aframe-loader-3dtiles-component).


### Installation

#### Browser

The following example loads the library from CDN, as well as missing required components for handling [KTX2/basis_universal](https://github.com/BinomialLLC/basis_universal) glTFs.

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/1.2.0/aframe.min.js"></script>
  <script src='https://cdn.jsdelivr.net/npm/three@0.133.0/examples/js/utils/WorkerPool.js'></script>
  <script src='https://cdn.jsdelivr.net/npm/three@0.133.0/examples/js/loaders/KTX2Loader.js'></script>
  <script src="https://cdn.jsdelivr.net/npm/aframe-loader-3dtiles-component/dist/aframe-loader-3dtiles-component.min.js"></script>
</head>
```
### Usage

The following example sets up a basic scene with a RealityCapture photogrammetry model.

```html
<body>
    <a-scene environment="preset: default">
      <a-camera id="camera"></a-camera>
      <a-entity
        id="freeman-tiles"
        position="0 2.6 0"
        rotation="-90 180 0"
        scale="2 2 2"
        loader-3dtiles="
         url: https://int.nyt.com/data/3dscenes/ONA360/TILESET/0731_FREEMAN_ALLEY_10M_A_36x8K__10K-PN_50P_DB/tileset_tileset.json; 
         maximumSSE: 48;
         cameraEl: #camera;
        "
      >
      </a-entity>
    </a-scene>
</body>
```

#### npm

Install via npm:

```bash
npm install aframe-loader-3dtiles-component
```

Then require and use.

```js
require('aframe');
require('aframe-loader-3dtiles-component');
```

## API

| Property | Type | Description | Default Value |
|----------|------|-------------|---------------|
| url | string | The URL of the tileset. For example if using Cesium ION, it would have the form: https://assets.cesium.com/[ASSET_ID]/tileset.json. Can be updated at runtime.| '' |
| cameraEl | selector | A selector for the camera whose position is used to determine which tiles to display at which LOD. If a `cameraEl` value is not provided then component uses `document.querySelector('a-scene').camera` to find `a-camera` primitive or entity with `camera` component. For more info see [Camera Requirement note below](#camera-requirement). The component automatically switches the camera in response to the `camera-set-active` event. | '' |
| maximumSSE | int | maximumScreenSpaceError (Optional) determines the distance from tiles in which they are refined, depending on their geometrical size. Increase the value to load lower LOD tiles from the same view distance (increases performance). **Cannot be updated at runtime.** | 16 |
| maximumMem | int | maximumMemoryUsage (Optional) determines maximum GPU memory (MB) to use for displaying tiles. May go over the limit if tiles within the camera viewport exceed that amount. **Cannot be updated at runtime.** | 32 |
| distanceScale | number | (Optional) 0-1 scale for the LOD quality. A lower value loads tiles from lower LODs (increases performance). Can be updated at runtime.| 1.0 |
| pointcloudColoring | string | (Optional) When viewing point clouds, which datum determines the color of a point. Possible values: 'white', 'intensity', 'classification', 'elevation', 'rgb'.| 'white' |
| pointcloudElevationRange | array | (Optional) When viewing point clouds colored by their elevation, what are the minimum and maximum height values.| 0, 400 |
| wireframe | boolean | (Optional) When viewing b3dm (mesh) tiles, show meshes as wireframe. Can be updated at runtime. | false | 
| showStats | boolean | (Optional) Attaches a box with tilestats to the scene, useful for debugging. | false | 
| cesiumIONToken | string | (Optional) A Cesium ION access token when loading tilesets from Cesium ION. | '' |

### Camera Requirement
To use the `loader-3dtiles` component, your A-Frame scene must have a camera defined using [`<a-camera>`](https://aframe.io/docs/1.2.0/primitives/a-camera.html) or the [`camera` component](https://aframe.io/docs/1.2.0/components/camera.html) . The component will attempt to use one of these automatically, or you can specify your own selector with the `cameraEl` property.

The camera is used to provide dynamic levels of detail (LOD) for 3D tiles. If no suitable camera is found the tiles will not display and an error is shown on the console `3D Tiles: Please add an active camera or specify the target camera via the cameraEl property`.

### Compatability with THREE.Cache
Currently, `three-loader-3dtiles` does not support the use of [THREE.Cache](https://threejs.org/docs/#api/en/loaders/Cache) which is enabled by default in A-Frame. In its default setting, the cache does not recognize repeated loads of tiles, which causes the cache to overflow. Therefore, the `loader-3dtiles` component disables `THREE.Cache` if it is enabled and displays a warning: `3D Tiles loader cannot work with THREE.Cache, disabling`.

### Contributing

Refer to [CONTRIBUTING.MD](./CONTRIBUTING.md) for general contribution instructions.


## Roadmap
Suggestions for future work include:

- More elaborate test caess.
- Better integration with the inspector.
- Test AR scenarios.
- Test point cloud scnearios.
- Could `THREE.Cache` be used manually?
- Conversion to _Typescript_.


 ---

> This repository is maintained by the Research & Development team at The New York Times and is provided as-is for your own use. For more information about R&D at the Times visit [rd.nytimes.com](https://rd.nytimes.com)
