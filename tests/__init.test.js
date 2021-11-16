/* global sinon, setup, teardown */

/**
 * __init.test.js is run before every test case.
 */
window.debug = true;
const AScene = require('aframe').AScene;

navigator.getVRDisplays = function () {
  const resolvePromise = Promise.resolve();
  const mockVRDisplay = {
    cancelAnimationFrame: function (h) { return window.cancelAnimationFrame(1); },
    capabilities: {},
    exitPresent: resolvePromise,
    getPose: function () { return { orientation: null, position: null }; },
    requestAnimationFrame: function () { return 1; },
    requestPresent: resolvePromise,
    submitFrame: function () { }
  };
  return Promise.resolve([mockVRDisplay]);
};

setup(function () {
  this.sinon = sinon.sandbox.create();
  // Stubs to not create a WebGL context since Travis CI runs headless.
  this.sinon.stub(AScene.prototype, 'render');
  this.sinon.stub(AScene.prototype, 'resize');
  this.sinon.stub(AScene.prototype, 'setupRenderer');
  // Mock renderer.
  AScene.prototype.renderer = {
    xr: {
      getDevice: function () { return { requestPresent: function () {} }; },
      setDevice: function () {},
      setPoseTarget: function () {},
      dispose: function () {},
      enabled: false
    },
    getContext: function () { return undefined; },
    setAnimationLoop: function () {},
    setSize: function () {},
    shadowMap: {},
    extensions: { has: () => true }
  };
});

teardown(function (done) {
  // Clean up any attached elements.
  const attachedEls = ['canvas', 'a-assets', 'a-scene'];
  const els = document.querySelectorAll(attachedEls.join(','));
  for (let i = 0; i < els.length; i++) {
    els[i].parentNode.removeChild(els[i]);
  }
  this.sinon.restore();
  delete AFRAME.components.test;
  delete AFRAME.systems.test;

  // Allow detachedCallbacks to clean themselves up.
  setTimeout(function () {
    done();
  });
});
