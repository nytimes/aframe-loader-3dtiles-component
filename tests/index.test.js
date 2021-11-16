/* global assert, setup, suite, test */
import 'aframe';
import '../index.js';

const entityFactory = require('./helpers').entityFactory;

suite('3dtiles component', function () {
  let el;

  setup(function (done) {
    el = entityFactory();
    el.addEventListener('componentinitialized', function (evt) {
      if (evt.detail.name !== 'loader-3dtiles') { return; }
      done();
    });
    document.querySelector('a-scene').addEventListener('loaded', function () {
      el.setAttribute('loader-3dtiles', {
        url: 'https://int.nyt.com/data/3dscenes/ONA360/TILESET/0731_FREEMAN_ALLEY_10M_A_36x8K__10K-PN_50P_DB/tileset_tileset.json',
        cameraEl: '[camera]'
      });
    });
  });

  suite('model', function () {
    test('is loaded', function () {
      const tileset = document.querySelector('[loader-3dtiles]');
      tileset.addEventListener('object3dset', function (evt) {
        assert.equal(tileset.object3D.children.length, 1);
      });
    });
  });
});
