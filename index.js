import { Loader3DTiles, PointCloudColoring } from 'three-loader-3dtiles';
import { Vector3 } from 'three';
import './textarea';

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

/**
 * 3D Tiles component for A-Frame.
 */

AFRAME.registerComponent('loader-3dtiles', {
  schema: {
    url: { type: 'string' },
    cameraEl: { type: 'selector' },
    maximumSSE: { type: 'int', default: 16 },
    maximumMem: { type: 'int', default: 32 },
    distanceScale: { type: 'number', default: 1.0 },
    wireframe: { type: 'boolean', default: false },
    showStats: { type: 'boolean', default: false },
    cesiumIONToken: { type: 'string' }
  },
  init: async function () {
    this.camera = this.data.cameraEl?.object3D.children[0] ?? document.querySelector('a-scene').camera;
    if (!this.camera) {
      throw new Error('3D Tiles: Please add an active camera or specify the target camera via the cameraEl property');
    }
    const { model, runtime } = await this._initTileset();
    this.runtime = runtime;

    this.el.setObject3D('tileset', model);

    this.originalCamera = this.camera;
    this.el.sceneEl.addEventListener('camera-set-active', (e) => {
      // TODO: For some reason after closing the inspector this event is fired with an empty camera,
      // so revert to the original camera used.
      //
      // TODO: Does not provide the right Inspector perspective camera
      this.camera = e.detail.cameraEl.object3D.children[0] ?? this.originalCamera;
    });
    this.el.sceneEl.addEventListener('enter-vr', (e) => {
      this.originalCamera = this.camera;
      try {
        this.camera = this.el.sceneEl.renderer.xr.getCamera(this.camera);

        // FOV Code from https://github.com/mrdoob/three.js/issues/21869
        this.el.sceneEl.renderer.xr.getSession().requestAnimationFrame((time, frame) => {
          const ref = this.el.sceneEl.renderer.xr.getReferenceSpace();
          const pose = frame.getViewerPose(ref);
          if (pose) {
            const fovi = pose.views[0].projectionMatrix[5];
            this.camera.fov = Math.atan2(1, fovi) * 2 * 180 / Math.PI;
          }
        });
      }
      catch (e) {
        console.warn("Could not get VR camera");
      }
    });
    this.el.sceneEl.addEventListener('exit-vr', (e) => {
      this.camera = this.originalCamera;
    });

    if (this.data.showStats) {
      this.stats = this._initStats();
    }
    if (THREE.Cache.enabled) {
      console.warn('3D Tiles loader cannot work with THREE.Cache, disabling.');
      THREE.Cache.enabled = false;
    }
  },
  update: async function (oldData) {
    if (oldData.url !== this.data.url) {
      if (this.runtime) {
        this.runtime.dispose();
      }
      const { model, runtime } = await this._initTileset();
      this.el.setObject3D('tileset', model);
      this.runtime = runtime;
    } else if (this.runtime) {
      this.runtime.setWireframe(this.data.wireframe);
      this.runtime.setViewDistanceScale(this.data.distanceScale);
    }

    if (this.data.showStats && !this.stats) {
      this.stats = this._initStats();
    }
    if (!this.data.showStats && this.stats) {
      this.el.sceneEl.removeChild(this.stats);
      this.stats = null;
    }
  },
  tick: function (t, dt) {
    if (this.runtime) {
      this.runtime.update(dt, this.el.sceneEl.renderer, this.camera);
      if (this.stats) {
        const worldPos = new Vector3();
        this.camera.getWorldPosition(worldPos);
        const stats = this.runtime.getStats();
        this.stats.setAttribute(
          'textarea',
          'text',
          Object.values(stats.stats).map(s => `${s.name}: ${s.count}`).join('\n')
        );
        const newPos = new Vector3();
        newPos.copy(worldPos);
        newPos.z -= 2;
        this.stats.setAttribute('position', newPos);
      }
    }
  },
  remove: function () {
    if (this.runtime) {
      this.runtime.dispose();
    }
  },
  _initTileset: async function () {
    return Loader3DTiles.load({
      url: this.data.url,
      renderer: this.el.sceneEl.renderer,
      options: {
        dracoDecoderPath: 'https://unpkg.com/three@0.133.0/examples/js/libs/draco',
        basisTranscoderPath: 'https://unpkg.com/three@0.133.0/examples/js/libs/basis',
        cesiumIONToken: this.data.cesiumIONToken,
        maximumScreenSpaceError: this.data.maximumSSE,
        maximumMemoryUsage: this.data.maximumMem,
        viewDistanceScale: this.data.distanceScale,
        wireframe: this.data.wireframe,
        pointCloudColoring: PointCloudColoring.RGB,
        updateTransforms: true
      }
    });
  },
  _initStats: function () {
    const stats = document.createElement('a-entity');
    this.el.sceneEl.appendChild(stats);
    stats.setAttribute('position', '-0.5 0 -1');
    stats.setAttribute('textarea', {
      cols: 30,
      rows: 15,
      text: '',
      color: 'white',
      disabledBackgroundColor: '#0c1e2c',
      disabled: true
    });
    return stats;
  }
});
