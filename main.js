/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.ts":
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three/examples/jsm/controls/OrbitControls */ "./node_modules/three/examples/jsm/controls/OrbitControls.js");
/* harmony import */ var cannon_es__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! cannon-es */ "./node_modules/cannon-es/dist/cannon-es.js");



class ThreeJSContainer {
    scene;
    light;
    insideCarousel;
    outsideCarousel;
    world;
    umbrella;
    umbrellaPole;
    constructor() { }
    createRendererDOM = (width, height, cameraPos) => {
        const renderer = new three__WEBPACK_IMPORTED_MODULE_1__.WebGLRenderer();
        renderer.setSize(width, height);
        renderer.setClearColor(new three__WEBPACK_IMPORTED_MODULE_1__.Color(0x495ed));
        renderer.shadowMap.enabled = true;
        //カメラ位置
        const camera = new three__WEBPACK_IMPORTED_MODULE_1__.PerspectiveCamera(75, width / height, 0.3, 500);
        camera.position.copy(cameraPos);
        camera.position.set(0, 10, 30);
        camera.lookAt(new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(0, 0, 0));
        const orbitControls = new three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_0__.OrbitControls(camera, renderer.domElement);
        this.createScene();
        const render = (time) => {
            orbitControls.update();
            this.insideCarousel.rotation.y += 0.003; // 内側メリーゴーランドを回転させる
            this.outsideCarousel.rotation.y -= 0.004; // 外側メリーゴーランドを逆方向に回転させる
            renderer.render(this.scene, camera);
            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);
        renderer.domElement.style.cssFloat = "left";
        renderer.domElement.style.margin = "10px";
        return renderer.domElement;
    };
    createScene = () => {
        this.scene = new three__WEBPACK_IMPORTED_MODULE_1__.Scene();
        this.world = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.World({ gravity: new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(0, -9.82, 0) });
        this.world.defaultContactMaterial.friction = 0.3;
        this.world.defaultContactMaterial.restitution = 0.0;
        // 内側プラットフォーム
        const insidePlatformGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.CylinderGeometry(8, 8, 3, 32); //土台の円柱
        const insidePlatformMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshLambertMaterial({ color: 0xFFFFFF });
        const insidePlatform = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(insidePlatformGeometry, insidePlatformMaterial);
        insidePlatform.position.y = 0.5;
        insidePlatform.castShadow = true;
        insidePlatform.receiveShadow = true;
        this.insideCarousel = new three__WEBPACK_IMPORTED_MODULE_1__.Group();
        this.insideCarousel.add(insidePlatform);
        this.createPole(this.insideCarousel, 6.5, 15, -0.5, 8); // 内側
        this.scene.add(this.insideCarousel);
        // 外側プラットフォーム
        const outerPlatformGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.CylinderGeometry(11, 11, 1, 32);
        const outerPlatformMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshLambertMaterial({ color: 0xff3303 });
        const outerPlatform = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(outerPlatformGeometry, outerPlatformMaterial);
        outerPlatform.position.y = 0.25;
        outerPlatform.castShadow = true;
        outerPlatform.receiveShadow = true;
        this.outsideCarousel = new three__WEBPACK_IMPORTED_MODULE_1__.Group();
        this.outsideCarousel.add(outerPlatform);
        this.createPole(this.outsideCarousel, 10, 15, 0.75, 15);
        this.scene.add(this.outsideCarousel);
        this.createUmbrella();
        this.light = new three__WEBPACK_IMPORTED_MODULE_1__.DirectionalLight(0xffffff);
        const lvec = new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(1, 1, 1).clone().normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);
        const fancyMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshBasicMaterial({
            color: 0xffffff,
            vertexColors: true
        });
        // 地面
        const planeGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.PlaneGeometry(80, 80, 50, 50);
        // 色
        const colors = [];
        for (let i = 0; i < planeGeometry.attributes.position.count; i++) {
            colors.push(Math.random(), Math.random(), Math.random());
        }
        planeGeometry.setAttribute('color', new three__WEBPACK_IMPORTED_MODULE_1__.Float32BufferAttribute(colors, 3));
        // 地面のメッシュ
        const planeMesh = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(planeGeometry, fancyMaterial);
        planeMesh.material.side = three__WEBPACK_IMPORTED_MODULE_1__.DoubleSide;
        planeMesh.rotateX(-Math.PI / 2);
        this.scene.add(planeMesh);
        const planeShape = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Plane();
        const planeBody = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Body({ mass: 0 });
        planeBody.addShape(planeShape);
        planeBody.position.set(planeMesh.position.x, planeMesh.position.y, planeMesh.position.z);
        planeBody.quaternion.set(planeMesh.quaternion.x, planeMesh.quaternion.y, planeMesh.quaternion.z, planeMesh.quaternion.w);
        this.world.addBody(planeBody);
        let update = (time) => {
            requestAnimationFrame(update);
            this.world.fixedStep();
        };
        requestAnimationFrame(update);
    };
    createPole = (carousel, radius, leng, plat, numPoles) => {
        const poleGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.CylinderGeometry(0.05, 0.05, leng, 32);
        const poleMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshLambertMaterial();
        poleMaterial.color.setRGB(Math.random(), Math.random(), Math.random());
        //const numPoles = 8;
        for (let i = 0; i < numPoles; i++) {
            const angle = (i / numPoles) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            // ポール
            const pole = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(poleGeometry, poleMaterial);
            pole.position.set(x, 2.5, z);
            pole.castShadow = true;
            pole.receiveShadow = true;
            carousel.add(pole);
            //動きをつける
            const poleShape = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Cylinder(0.05, 0.05, length, 32);
            const poleBody = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Body({ mass: 0 }); // 静止するポール
            poleBody.addShape(poleShape);
            poleBody.position.set(x, length / 2, z);
            this.world.addBody(poleBody);
            this.createShape(pole, 0.5, plat, poleBody);
        }
    };
    createShape = (pole, heightOffset, plat, poleBody) => {
        const shapes = [
            { geometry: new three__WEBPACK_IMPORTED_MODULE_1__.BoxGeometry(2, 0.8, 1), material: new three__WEBPACK_IMPORTED_MODULE_1__.MeshLambertMaterial() },
            { geometry: new three__WEBPACK_IMPORTED_MODULE_1__.CylinderGeometry(0.7, 1, 0.5, 32), material: new three__WEBPACK_IMPORTED_MODULE_1__.MeshLambertMaterial() },
            { geometry: new three__WEBPACK_IMPORTED_MODULE_1__.TorusGeometry(0.5, 0.5, 32, 32), material: new three__WEBPACK_IMPORTED_MODULE_1__.MeshLambertMaterial() },
        ];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const geometry = shape.geometry;
        const material = shape.material;
        material.color.setRGB(Math.random(), Math.random(), Math.random());
        const mesh = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(geometry, material);
        mesh.position.set(0, heightOffset - plat, 0);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        const shapeGeometry = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Box(new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(1, 0.4, 0.5)); // 図形の物理的な形状を定義
        const shapeBody = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Body({ mass: 1 });
        shapeBody.addShape(shapeGeometry);
        shapeBody.position.set(0, heightOffset, 0); // ポール上に配置
        shapeBody.position.vadd(poleBody.position, shapeBody.position);
        this.world.addBody(shapeBody);
        pole.add(mesh);
    };
    //傘
    createUmbrella = () => {
        const umbrellaGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.ConeGeometry(13, 5, 32);
        const loader = new three__WEBPACK_IMPORTED_MODULE_1__.TextureLoader();
        const umbrellaTexture = loader.load('yuuenchiTexcha.png'); // 傘のテクスチャ画像のパス
        const umbrellaMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshLambertMaterial({ map: umbrellaTexture, side: three__WEBPACK_IMPORTED_MODULE_1__.DoubleSide });
        this.umbrella = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(umbrellaGeometry, umbrellaMaterial);
        this.umbrella.position.y = 12;
        const poleGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.CylinderGeometry(1.5, 1.5, 10, 32);
        const poleMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshLambertMaterial({ color: 0xaaaaaa }); // 支柱の色を設定
        this.umbrellaPole = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(poleGeometry, poleMaterial);
        this.umbrellaPole.position.set(0, 5, 0);
        this.scene.add(this.umbrella);
        this.scene.add(this.umbrellaPole);
    };
}
window.addEventListener("DOMContentLoaded", init);
function init() {
    let container = new ThreeJSContainer();
    let viewport = container.createRendererDOM(640, 480, new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(10, 10, 10));
    document.body.appendChild(viewport);
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkcgprendering"] = self["webpackChunkcgprendering"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_cannon-es_dist_cannon-es_js-node_modules_three_examples_jsm_controls_Orb-e58bd2"], () => (__webpack_require__("./src/app.ts")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUErQjtBQUMyQztBQUN0QztBQUVwQyxNQUFNLGdCQUFnQjtJQUNWLEtBQUssQ0FBYztJQUNuQixLQUFLLENBQWM7SUFDbkIsY0FBYyxDQUFjO0lBQzVCLGVBQWUsQ0FBYztJQUM3QixLQUFLLENBQWU7SUFDcEIsUUFBUSxDQUFhO0lBQ3JCLFlBQVksQ0FBYTtJQUVqQyxnQkFBZSxDQUFDO0lBRVQsaUJBQWlCLEdBQUcsQ0FBQyxLQUFhLEVBQUUsTUFBYyxFQUFFLFNBQXdCLEVBQUUsRUFBRTtRQUNuRixNQUFNLFFBQVEsR0FBRyxJQUFJLGdEQUFtQixFQUFFLENBQUM7UUFDM0MsUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDaEMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLHdDQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUNqRCxRQUFRLENBQUMsU0FBUyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFFbEMsT0FBTztRQUNQLE1BQU0sTUFBTSxHQUFHLElBQUksb0RBQXVCLENBQUMsRUFBRSxFQUFFLEtBQUssR0FBRyxNQUFNLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3pFLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDL0IsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLDBDQUFhLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTFDLE1BQU0sYUFBYSxHQUFHLElBQUksb0ZBQWEsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBRXJFLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUVuQixNQUFNLE1BQU0sR0FBeUIsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUMxQyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDdkIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLG1CQUFtQjtZQUM1RCxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsdUJBQXVCO1lBQ2pFLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztZQUNwQyxxQkFBcUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNsQyxDQUFDO1FBQ0QscUJBQXFCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFOUIsUUFBUSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQztRQUM1QyxRQUFRLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQzFDLE9BQU8sUUFBUSxDQUFDLFVBQVUsQ0FBQztJQUMvQixDQUFDO0lBRU8sV0FBVyxHQUFHLEdBQUcsRUFBRTtRQUN2QixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksd0NBQVcsRUFBRSxDQUFDO1FBQy9CLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSw0Q0FBWSxDQUFDLEVBQUUsT0FBTyxFQUFFLElBQUksMkNBQVcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3pFLElBQUksQ0FBQyxLQUFLLENBQUMsc0JBQXNCLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQztRQUNqRCxJQUFJLENBQUMsS0FBSyxDQUFDLHNCQUFzQixDQUFDLFdBQVcsR0FBRyxHQUFHLENBQUM7UUFFcEQsYUFBYTtRQUNiLE1BQU0sc0JBQXNCLEdBQUcsSUFBSSxtREFBc0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU87UUFDL0UsTUFBTSxzQkFBc0IsR0FBRyxJQUFJLHNEQUF5QixDQUFDLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDbEYsTUFBTSxjQUFjLEdBQUcsSUFBSSx1Q0FBVSxDQUFDLHNCQUFzQixFQUFFLHNCQUFzQixDQUFDLENBQUM7UUFDdEYsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBQ2hDLGNBQWMsQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1FBQ2pDLGNBQWMsQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO1FBRXBDLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSx3Q0FBVyxFQUFFLENBQUM7UUFDeEMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7UUFHeEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLEdBQUcsRUFBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLEVBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLO1FBQy9ELElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUd0QyxhQUFhO1FBQ2IsTUFBTSxxQkFBcUIsR0FBRyxJQUFJLG1EQUFzQixDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3hFLE1BQU0scUJBQXFCLEdBQUcsSUFBSSxzREFBeUIsQ0FBQyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQ2pGLE1BQU0sYUFBYSxHQUFHLElBQUksdUNBQVUsQ0FBQyxxQkFBcUIsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO1FBQ25GLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUNoQyxhQUFhLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztRQUNoQyxhQUFhLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztRQUVuQyxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksd0NBQVcsRUFBRSxDQUFDO1FBQ3pDLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBRXhDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRyxFQUFFLENBQUMsQ0FBQztRQUV6RCxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7UUFHcEMsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBT3ZCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxtREFBc0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNsRCxNQUFNLElBQUksR0FBRyxJQUFJLDBDQUFhLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsU0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNwRCxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoRCxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFHekIsTUFBTSxhQUFhLEdBQUcsSUFBSSxvREFBdUIsQ0FBQztZQUM5QyxLQUFLLEVBQUUsUUFBUTtZQUNmLFlBQVksRUFBRSxJQUFJO1NBQ3JCLENBQUMsQ0FBQztRQUVILEtBQUs7UUFDTCxNQUFNLGFBQWEsR0FBRyxJQUFJLGdEQUFtQixDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRTlELElBQUk7UUFDSixNQUFNLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFDbEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUM5RCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7U0FDNUQ7UUFDRCxhQUFhLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxJQUFJLHlEQUE0QixDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRWpGLFVBQVU7UUFDVixNQUFNLFNBQVMsR0FBRyxJQUFJLHVDQUFVLENBQUMsYUFBYSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQy9ELFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLDZDQUFnQixDQUFDO1FBQzNDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRTFCLE1BQU0sVUFBVSxHQUFHLElBQUksNENBQVksRUFBRSxDQUFDO1FBQ3RDLE1BQU0sU0FBUyxHQUFHLElBQUksMkNBQVcsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQy9DLFNBQVMsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDL0IsU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6RixTQUFTLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXpILElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRTlCLElBQUksTUFBTSxHQUF5QixDQUFDLElBQUksRUFBRSxFQUFFO1lBQ3hDLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzlCLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDM0IsQ0FBQztRQUNELHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFHTyxVQUFVLEdBQUcsQ0FBQyxRQUFxQixFQUFFLE1BQWMsRUFBSSxJQUFZLEVBQUcsSUFBVyxFQUFHLFFBQWUsRUFBRSxFQUFFO1FBQzNHLE1BQU0sWUFBWSxHQUFHLElBQUksbURBQXNCLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDdEUsTUFBTSxZQUFZLEdBQUcsSUFBSSxzREFBeUIsRUFBRSxDQUFDO1FBRXJELFlBQVksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFDdkUscUJBQXFCO1FBRXJCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDL0IsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDM0MsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxNQUFNLENBQUM7WUFDbkMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxNQUFNLENBQUM7WUFFbkMsTUFBTTtZQUNOLE1BQU0sSUFBSSxHQUFHLElBQUksdUNBQVUsQ0FBQyxZQUFZLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFDeEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUM3QixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztZQUN2QixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztZQUUxQixRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRW5CLFFBQVE7WUFDUixNQUFNLFNBQVMsR0FBRyxJQUFJLCtDQUFlLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDOUQsTUFBTSxRQUFRLEdBQUcsSUFBSSwyQ0FBVyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVO1lBQ3pELFFBQVEsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDN0IsUUFBUSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDeEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFN0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFHLElBQUksRUFBRyxRQUFRLENBQUMsQ0FBQztTQUdqRDtJQUNMLENBQUM7SUFFTyxXQUFXLEdBQUcsQ0FBQyxJQUFnQixFQUFFLFlBQW9CLEVBQUcsSUFBVyxFQUFHLFFBQXFCLEVBQUUsRUFBRTtRQUNuRyxNQUFNLE1BQU0sR0FBRztZQUNYLEVBQUUsUUFBUSxFQUFFLElBQUksOENBQWlCLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxzREFBeUIsRUFBRSxFQUFFO1lBQ3pGLEVBQUUsUUFBUSxFQUFFLElBQUksbURBQXNCLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksc0RBQXlCLEVBQUUsRUFBRTtZQUNwRyxFQUFFLFFBQVEsRUFBRSxJQUFJLGdEQUFtQixDQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsRUFBRSxFQUFDLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLHNEQUF5QixFQUFFLEVBQUU7U0FFbEcsQ0FBQztRQUVGLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNoRSxNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDO1FBQ2hDLE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUM7UUFHaEMsUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUduRSxNQUFNLElBQUksR0FBRyxJQUFJLHVDQUFVLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ2hELElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBQyxZQUFZLEdBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzFDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO1FBRTFCLE1BQU0sYUFBYSxHQUFHLElBQUksMENBQVUsQ0FBQyxJQUFJLDJDQUFXLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZTtRQUNuRixNQUFNLFNBQVMsR0FBRyxJQUFJLDJDQUFXLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMvQyxTQUFTLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ2xDLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVO1FBR3JELFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRS9ELElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRS9CLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbEIsQ0FBQztJQUVELEdBQUc7SUFDSyxjQUFjLEdBQUcsR0FBRyxFQUFFO1FBRTFCLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSwrQ0FBa0IsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzNELE1BQU0sTUFBTSxHQUFHLElBQUksZ0RBQW1CLEVBQUUsQ0FBQztRQUN6QyxNQUFNLGVBQWUsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxlQUFlO1FBRTFFLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxzREFBeUIsQ0FBQyxFQUFFLEdBQUcsRUFBRSxlQUFlLEVBQUUsSUFBSSxFQUFFLDZDQUFnQixFQUFDLENBQUMsQ0FBQztRQUN4RyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksdUNBQVUsQ0FBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBR25FLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7UUFFOUIsTUFBTSxZQUFZLEdBQUcsSUFBSSxtREFBc0IsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNsRSxNQUFNLFlBQVksR0FBRyxJQUFJLHNEQUF5QixDQUFDLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVO1FBQ25GLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSx1Q0FBVSxDQUFDLFlBQVksRUFBRSxZQUFZLENBQUMsQ0FBQztRQUMvRCxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUV4QyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDOUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ3RDLENBQUM7Q0FDSjtBQUdELE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUVsRCxTQUFTLElBQUk7SUFDVCxJQUFJLFNBQVMsR0FBRyxJQUFJLGdCQUFnQixFQUFFLENBQUM7SUFFdkMsSUFBSSxRQUFRLEdBQUcsU0FBUyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSwwQ0FBYSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNwRixRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUN4QyxDQUFDOzs7Ozs7O1VDdk9EO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7Ozs7V0N6QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSwrQkFBK0Isd0NBQXdDO1dBQ3ZFO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUJBQWlCLHFCQUFxQjtXQUN0QztXQUNBO1dBQ0Esa0JBQWtCLHFCQUFxQjtXQUN2QztXQUNBO1dBQ0EsS0FBSztXQUNMO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7Ozs7V0MzQkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1dDTkE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLE1BQU0scUJBQXFCO1dBQzNCO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBOzs7OztVRWhEQTtVQUNBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nLy4vc3JjL2FwcC50cyIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9jaHVuayBsb2FkZWQiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL2pzb25wIGNodW5rIGxvYWRpbmciLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgT3JiaXRDb250cm9scyB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vY29udHJvbHMvT3JiaXRDb250cm9sc1wiO1xuaW1wb3J0ICogYXMgQ0FOTk9OIGZyb20gJ2Nhbm5vbi1lcyc7XG5cbmNsYXNzIFRocmVlSlNDb250YWluZXIge1xuICAgIHByaXZhdGUgc2NlbmU6IFRIUkVFLlNjZW5lO1xuICAgIHByaXZhdGUgbGlnaHQ6IFRIUkVFLkxpZ2h0O1xuICAgIHByaXZhdGUgaW5zaWRlQ2Fyb3VzZWw6IFRIUkVFLkdyb3VwO1xuICAgIHByaXZhdGUgb3V0c2lkZUNhcm91c2VsOiBUSFJFRS5Hcm91cDtcbiAgICBwcml2YXRlIHdvcmxkOiBDQU5OT04uV29ybGQ7XG4gICAgcHJpdmF0ZSB1bWJyZWxsYTogVEhSRUUuTWVzaDtcbiAgICBwcml2YXRlIHVtYnJlbGxhUG9sZTogVEhSRUUuTWVzaDtcblxuICAgIGNvbnN0cnVjdG9yKCkge31cblxuICAgIHB1YmxpYyBjcmVhdGVSZW5kZXJlckRPTSA9ICh3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlciwgY2FtZXJhUG9zOiBUSFJFRS5WZWN0b3IzKSA9PiB7XG4gICAgICAgIGNvbnN0IHJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoKTtcbiAgICAgICAgcmVuZGVyZXIuc2V0U2l6ZSh3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgcmVuZGVyZXIuc2V0Q2xlYXJDb2xvcihuZXcgVEhSRUUuQ29sb3IoMHg0OTVlZCkpO1xuICAgICAgICByZW5kZXJlci5zaGFkb3dNYXAuZW5hYmxlZCA9IHRydWU7XG5cbiAgICAgICAgLy/jgqvjg6Hjg6nkvY3nva5cbiAgICAgICAgY29uc3QgY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKDc1LCB3aWR0aCAvIGhlaWdodCwgMC4zLCA1MDApO1xuICAgICAgICBjYW1lcmEucG9zaXRpb24uY29weShjYW1lcmFQb3MpO1xuICAgICAgICBjYW1lcmEucG9zaXRpb24uc2V0KDAsIDEwLCAzMCk7IFxuICAgICAgICBjYW1lcmEubG9va0F0KG5ldyBUSFJFRS5WZWN0b3IzKDAsIDAsIDApKTtcblxuICAgICAgICBjb25zdCBvcmJpdENvbnRyb2xzID0gbmV3IE9yYml0Q29udHJvbHMoY2FtZXJhLCByZW5kZXJlci5kb21FbGVtZW50KTtcblxuICAgICAgICB0aGlzLmNyZWF0ZVNjZW5lKCk7XG5cbiAgICAgICAgY29uc3QgcmVuZGVyOiBGcmFtZVJlcXVlc3RDYWxsYmFjayA9ICh0aW1lKSA9PiB7XG4gICAgICAgICAgICBvcmJpdENvbnRyb2xzLnVwZGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5pbnNpZGVDYXJvdXNlbC5yb3RhdGlvbi55ICs9IDAuMDAzOyAvLyDlhoXlgbTjg6Hjg6rjg7zjgrTjg7zjg6njg7Pjg4njgpLlm57ou6LjgZXjgZvjgotcbiAgICAgICAgICAgIHRoaXMub3V0c2lkZUNhcm91c2VsLnJvdGF0aW9uLnkgLT0gMC4wMDQ7IC8vIOWkluWBtOODoeODquODvOOCtOODvOODqeODs+ODieOCkumAhuaWueWQkeOBq+Wbnui7ouOBleOBm+OCi1xuICAgICAgICAgICAgcmVuZGVyZXIucmVuZGVyKHRoaXMuc2NlbmUsIGNhbWVyYSk7XG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVuZGVyKTtcbiAgICAgICAgfVxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVuZGVyKTtcblxuICAgICAgICByZW5kZXJlci5kb21FbGVtZW50LnN0eWxlLmNzc0Zsb2F0ID0gXCJsZWZ0XCI7XG4gICAgICAgIHJlbmRlcmVyLmRvbUVsZW1lbnQuc3R5bGUubWFyZ2luID0gXCIxMHB4XCI7XG4gICAgICAgIHJldHVybiByZW5kZXJlci5kb21FbGVtZW50O1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlU2NlbmUgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcbiAgICAgICAgdGhpcy53b3JsZCA9IG5ldyBDQU5OT04uV29ybGQoeyBncmF2aXR5OiBuZXcgQ0FOTk9OLlZlYzMoMCwgLTkuODIsIDApIH0pO1xuICAgICAgICB0aGlzLndvcmxkLmRlZmF1bHRDb250YWN0TWF0ZXJpYWwuZnJpY3Rpb24gPSAwLjM7XG4gICAgICAgIHRoaXMud29ybGQuZGVmYXVsdENvbnRhY3RNYXRlcmlhbC5yZXN0aXR1dGlvbiA9IDAuMDtcblxuICAgICAgICAvLyDlhoXlgbTjg5fjg6njg4Pjg4jjg5Xjgqnjg7zjg6BcbiAgICAgICAgY29uc3QgaW5zaWRlUGxhdGZvcm1HZW9tZXRyeSA9IG5ldyBUSFJFRS5DeWxpbmRlckdlb21ldHJ5KDgsIDgsIDMsIDMyKTsgLy/lnJ/lj7Djga7lhobmn7FcbiAgICAgICAgY29uc3QgaW5zaWRlUGxhdGZvcm1NYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoTGFtYmVydE1hdGVyaWFsKHsgY29sb3I6IDB4RkZGRkZGIH0pO1xuICAgICAgICBjb25zdCBpbnNpZGVQbGF0Zm9ybSA9IG5ldyBUSFJFRS5NZXNoKGluc2lkZVBsYXRmb3JtR2VvbWV0cnksIGluc2lkZVBsYXRmb3JtTWF0ZXJpYWwpO1xuICAgICAgICBpbnNpZGVQbGF0Zm9ybS5wb3NpdGlvbi55ID0gMC41O1xuICAgICAgICBpbnNpZGVQbGF0Zm9ybS5jYXN0U2hhZG93ID0gdHJ1ZTtcbiAgICAgICAgaW5zaWRlUGxhdGZvcm0ucmVjZWl2ZVNoYWRvdyA9IHRydWU7XG5cbiAgICAgICAgdGhpcy5pbnNpZGVDYXJvdXNlbCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xuICAgICAgICB0aGlzLmluc2lkZUNhcm91c2VsLmFkZChpbnNpZGVQbGF0Zm9ybSk7XG4gICAgICAgIFxuXG4gICAgICAgIHRoaXMuY3JlYXRlUG9sZSh0aGlzLmluc2lkZUNhcm91c2VsLCA2LjUgLCAxNSAsLTAuNSAsIDgpOyAvLyDlhoXlgbRcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQodGhpcy5pbnNpZGVDYXJvdXNlbCk7XG5cbiAgXG4gICAgICAvLyDlpJblgbTjg5fjg6njg4Pjg4jjg5Xjgqnjg7zjg6BcbiAgICAgIGNvbnN0IG91dGVyUGxhdGZvcm1HZW9tZXRyeSA9IG5ldyBUSFJFRS5DeWxpbmRlckdlb21ldHJ5KDExLCAxMSwgMSwgMzIpO1xuICAgICAgY29uc3Qgb3V0ZXJQbGF0Zm9ybU1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hMYW1iZXJ0TWF0ZXJpYWwoeyBjb2xvcjogMHhmZjMzMDMgfSk7XG4gICAgICBjb25zdCBvdXRlclBsYXRmb3JtID0gbmV3IFRIUkVFLk1lc2gob3V0ZXJQbGF0Zm9ybUdlb21ldHJ5LCBvdXRlclBsYXRmb3JtTWF0ZXJpYWwpO1xuICAgICAgb3V0ZXJQbGF0Zm9ybS5wb3NpdGlvbi55ID0gMC4yNTtcbiAgICAgIG91dGVyUGxhdGZvcm0uY2FzdFNoYWRvdyA9IHRydWU7XG4gICAgICBvdXRlclBsYXRmb3JtLnJlY2VpdmVTaGFkb3cgPSB0cnVlO1xuXG4gICAgICB0aGlzLm91dHNpZGVDYXJvdXNlbCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xuICAgICAgdGhpcy5vdXRzaWRlQ2Fyb3VzZWwuYWRkKG91dGVyUGxhdGZvcm0pO1xuXG4gICAgICB0aGlzLmNyZWF0ZVBvbGUodGhpcy5vdXRzaWRlQ2Fyb3VzZWwsIDEwICwxNSAsMC43NSAsIDE1KTsgXG5cbiAgICAgIHRoaXMuc2NlbmUuYWRkKHRoaXMub3V0c2lkZUNhcm91c2VsKTtcblxuICAgICAgIFxuICAgICAgIHRoaXMuY3JlYXRlVW1icmVsbGEoKTtcblxuICAgICAgXG5cbiAgICAgIFxuXG4gICAgICBcbiAgICAgIHRoaXMubGlnaHQgPSBuZXcgVEhSRUUuRGlyZWN0aW9uYWxMaWdodCgweGZmZmZmZik7XG4gICAgICBjb25zdCBsdmVjID0gbmV3IFRIUkVFLlZlY3RvcjMoMSwgMSwgMSkubm9ybWFsaXplKCk7XG4gICAgICB0aGlzLmxpZ2h0LnBvc2l0aW9uLnNldChsdmVjLngsIGx2ZWMueSwgbHZlYy56KTtcbiAgICAgIHRoaXMuc2NlbmUuYWRkKHRoaXMubGlnaHQpO1xuXG4gICAgICAgIFxuICAgICAgICBjb25zdCBmYW5jeU1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHtcbiAgICAgICAgICAgIGNvbG9yOiAweGZmZmZmZixcbiAgICAgICAgICAgIHZlcnRleENvbG9yczogdHJ1ZVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyDlnLDpnaJcbiAgICAgICAgY29uc3QgcGxhbmVHZW9tZXRyeSA9IG5ldyBUSFJFRS5QbGFuZUdlb21ldHJ5KDgwLCA4MCwgNTAsIDUwKTtcblxuICAgICAgICAvLyDoibJcbiAgICAgICAgY29uc3QgY29sb3JzID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGxhbmVHZW9tZXRyeS5hdHRyaWJ1dGVzLnBvc2l0aW9uLmNvdW50OyBpKyspIHtcbiAgICAgICAgICAgIGNvbG9ycy5wdXNoKE1hdGgucmFuZG9tKCksIE1hdGgucmFuZG9tKCksIE1hdGgucmFuZG9tKCkpO1xuICAgICAgICB9XG4gICAgICAgIHBsYW5lR2VvbWV0cnkuc2V0QXR0cmlidXRlKCdjb2xvcicsIG5ldyBUSFJFRS5GbG9hdDMyQnVmZmVyQXR0cmlidXRlKGNvbG9ycywgMykpO1xuXG4gICAgICAgIC8vIOWcsOmdouOBruODoeODg+OCt+ODpVxuICAgICAgICBjb25zdCBwbGFuZU1lc2ggPSBuZXcgVEhSRUUuTWVzaChwbGFuZUdlb21ldHJ5LCBmYW5jeU1hdGVyaWFsKTtcbiAgICAgICAgcGxhbmVNZXNoLm1hdGVyaWFsLnNpZGUgPSBUSFJFRS5Eb3VibGVTaWRlO1xuICAgICAgICBwbGFuZU1lc2gucm90YXRlWCgtTWF0aC5QSSAvIDIpO1xuICAgICAgICB0aGlzLnNjZW5lLmFkZChwbGFuZU1lc2gpO1xuXG4gICAgICAgIGNvbnN0IHBsYW5lU2hhcGUgPSBuZXcgQ0FOTk9OLlBsYW5lKCk7XG4gICAgICAgIGNvbnN0IHBsYW5lQm9keSA9IG5ldyBDQU5OT04uQm9keSh7IG1hc3M6IDAgfSk7XG4gICAgICAgIHBsYW5lQm9keS5hZGRTaGFwZShwbGFuZVNoYXBlKTtcbiAgICAgICAgcGxhbmVCb2R5LnBvc2l0aW9uLnNldChwbGFuZU1lc2gucG9zaXRpb24ueCwgcGxhbmVNZXNoLnBvc2l0aW9uLnksIHBsYW5lTWVzaC5wb3NpdGlvbi56KTtcbiAgICAgICAgcGxhbmVCb2R5LnF1YXRlcm5pb24uc2V0KHBsYW5lTWVzaC5xdWF0ZXJuaW9uLngsIHBsYW5lTWVzaC5xdWF0ZXJuaW9uLnksIHBsYW5lTWVzaC5xdWF0ZXJuaW9uLnosIHBsYW5lTWVzaC5xdWF0ZXJuaW9uLncpO1xuXG4gICAgICAgIHRoaXMud29ybGQuYWRkQm9keShwbGFuZUJvZHkpO1xuXG4gICAgICAgIGxldCB1cGRhdGU6IEZyYW1lUmVxdWVzdENhbGxiYWNrID0gKHRpbWUpID0+IHtcbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh1cGRhdGUpO1xuICAgICAgICAgICAgdGhpcy53b3JsZC5maXhlZFN0ZXAoKTtcbiAgICAgICAgfVxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodXBkYXRlKTtcbiAgICB9XG5cbiAgICBcbiAgICBwcml2YXRlIGNyZWF0ZVBvbGUgPSAoY2Fyb3VzZWw6IFRIUkVFLkdyb3VwLCByYWRpdXM6IG51bWJlciAgLCBsZW5nOiBudW1iZXIgLCBwbGF0Om51bWJlciAsIG51bVBvbGVzOm51bWJlcikgPT4ge1xuICAgICAgICBjb25zdCBwb2xlR2VvbWV0cnkgPSBuZXcgVEhSRUUuQ3lsaW5kZXJHZW9tZXRyeSgwLjA1LCAwLjA1LCBsZW5nLCAzMik7XG4gICAgICAgIGNvbnN0IHBvbGVNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoTGFtYmVydE1hdGVyaWFsKCk7XG4gICAgICAgIFxuICAgICAgICBwb2xlTWF0ZXJpYWwuY29sb3Iuc2V0UkdCKE1hdGgucmFuZG9tKCksIE1hdGgucmFuZG9tKCksIE1hdGgucmFuZG9tKCkpO1xuICAgICAgICAvL2NvbnN0IG51bVBvbGVzID0gODtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bVBvbGVzOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGFuZ2xlID0gKGkgLyBudW1Qb2xlcykgKiBNYXRoLlBJICogMjtcbiAgICAgICAgICAgIGNvbnN0IHggPSBNYXRoLmNvcyhhbmdsZSkgKiByYWRpdXM7XG4gICAgICAgICAgICBjb25zdCB6ID0gTWF0aC5zaW4oYW5nbGUpICogcmFkaXVzO1xuXG4gICAgICAgICAgICAvLyDjg53jg7zjg6tcbiAgICAgICAgICAgIGNvbnN0IHBvbGUgPSBuZXcgVEhSRUUuTWVzaChwb2xlR2VvbWV0cnksIHBvbGVNYXRlcmlhbCk7XG4gICAgICAgICAgICBwb2xlLnBvc2l0aW9uLnNldCh4LCAyLjUsIHopO1xuICAgICAgICAgICAgcG9sZS5jYXN0U2hhZG93ID0gdHJ1ZTtcbiAgICAgICAgICAgIHBvbGUucmVjZWl2ZVNoYWRvdyA9IHRydWU7XG5cbiAgICAgICAgICAgIGNhcm91c2VsLmFkZChwb2xlKTtcblxuICAgICAgICAgICAgLy/li5XjgY3jgpLjgaTjgZHjgotcbiAgICAgICAgICAgIGNvbnN0IHBvbGVTaGFwZSA9IG5ldyBDQU5OT04uQ3lsaW5kZXIoMC4wNSwgMC4wNSwgbGVuZ3RoLCAzMik7XG4gICAgICAgICAgICBjb25zdCBwb2xlQm9keSA9IG5ldyBDQU5OT04uQm9keSh7IG1hc3M6IDAgfSk7IC8vIOmdmeatouOBmeOCi+ODneODvOODq1xuICAgICAgICAgICAgcG9sZUJvZHkuYWRkU2hhcGUocG9sZVNoYXBlKTtcbiAgICAgICAgICAgIHBvbGVCb2R5LnBvc2l0aW9uLnNldCh4LCBsZW5ndGggLyAyLCB6KTtcbiAgICAgICAgICAgIHRoaXMud29ybGQuYWRkQm9keShwb2xlQm9keSk7XG5cbiAgICAgICAgICAgIHRoaXMuY3JlYXRlU2hhcGUocG9sZSwgMC41ICwgcGxhdCAsIHBvbGVCb2R5KTsgXG5cbiAgICAgICAgICAgXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZVNoYXBlID0gKHBvbGU6IFRIUkVFLk1lc2gsIGhlaWdodE9mZnNldDogbnVtYmVyICwgcGxhdDpudW1iZXIgLCBwb2xlQm9keTogQ0FOTk9OLkJvZHkpID0+IHtcbiAgICAgICAgY29uc3Qgc2hhcGVzID0gW1xuICAgICAgICAgICAgeyBnZW9tZXRyeTogbmV3IFRIUkVFLkJveEdlb21ldHJ5KDIsIDAuOCwgMSksIG1hdGVyaWFsOiBuZXcgVEhSRUUuTWVzaExhbWJlcnRNYXRlcmlhbCgpIH0sXG4gICAgICAgICAgICB7IGdlb21ldHJ5OiBuZXcgVEhSRUUuQ3lsaW5kZXJHZW9tZXRyeSgwLjcsIDEsIDAuNSwgMzIpLCBtYXRlcmlhbDogbmV3IFRIUkVFLk1lc2hMYW1iZXJ0TWF0ZXJpYWwoKSB9LFxuICAgICAgICAgICAgeyBnZW9tZXRyeTogbmV3IFRIUkVFLlRvcnVzR2VvbWV0cnkoMC41LDAuNSwzMiwzMiksIG1hdGVyaWFsOiBuZXcgVEhSRUUuTWVzaExhbWJlcnRNYXRlcmlhbCgpIH0sXG4gICAgICAgICAgIFxuICAgICAgICBdO1xuXG4gICAgICAgIGNvbnN0IHNoYXBlID0gc2hhcGVzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHNoYXBlcy5sZW5ndGgpXTtcbiAgICAgICAgY29uc3QgZ2VvbWV0cnkgPSBzaGFwZS5nZW9tZXRyeTtcbiAgICAgICAgY29uc3QgbWF0ZXJpYWwgPSBzaGFwZS5tYXRlcmlhbDtcblxuICAgICAgXG4gICAgICAgIG1hdGVyaWFsLmNvbG9yLnNldFJHQihNYXRoLnJhbmRvbSgpLCBNYXRoLnJhbmRvbSgpLCBNYXRoLnJhbmRvbSgpKTtcblxuICAgICAgIFxuICAgICAgICBjb25zdCBtZXNoID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKTtcbiAgICAgICAgbWVzaC5wb3NpdGlvbi5zZXQoMCxoZWlnaHRPZmZzZXQtcGxhdCwgMCk7XG4gICAgICAgIG1lc2guY2FzdFNoYWRvdyA9IHRydWU7XG4gICAgICAgIG1lc2gucmVjZWl2ZVNoYWRvdyA9IHRydWU7XG5cbiAgICAgICAgY29uc3Qgc2hhcGVHZW9tZXRyeSA9IG5ldyBDQU5OT04uQm94KG5ldyBDQU5OT04uVmVjMygxLCAwLjQsIDAuNSkpOyAvLyDlm7PlvaLjga7niannkIbnmoTjgarlvaLnirbjgpLlrprnvqlcbiAgICAgICAgY29uc3Qgc2hhcGVCb2R5ID0gbmV3IENBTk5PTi5Cb2R5KHsgbWFzczogMSB9KTtcbiAgICAgICAgc2hhcGVCb2R5LmFkZFNoYXBlKHNoYXBlR2VvbWV0cnkpO1xuICAgICAgICBzaGFwZUJvZHkucG9zaXRpb24uc2V0KDAsaGVpZ2h0T2Zmc2V0LCAwKTsgLy8g44Od44O844Or5LiK44Gr6YWN572uXG4gICAgXG4gICAgICAgIFxuICAgICAgICBzaGFwZUJvZHkucG9zaXRpb24udmFkZChwb2xlQm9keS5wb3NpdGlvbiwgc2hhcGVCb2R5LnBvc2l0aW9uKTtcbiAgICBcbiAgICAgICAgdGhpcy53b3JsZC5hZGRCb2R5KHNoYXBlQm9keSk7XG5cbiAgICAgICBwb2xlLmFkZChtZXNoKTtcbiAgICB9XG5cbiAgICAvL+WCmFxuICAgIHByaXZhdGUgY3JlYXRlVW1icmVsbGEgPSAoKSA9PiB7XG4gICAgICAgIFxuICAgICAgICBjb25zdCB1bWJyZWxsYUdlb21ldHJ5ID0gbmV3IFRIUkVFLkNvbmVHZW9tZXRyeSgxMywgNSwgMzIpO1xuICAgICAgICBjb25zdCBsb2FkZXIgPSBuZXcgVEhSRUUuVGV4dHVyZUxvYWRlcigpO1xuICAgICAgICBjb25zdCB1bWJyZWxsYVRleHR1cmUgPSBsb2FkZXIubG9hZCgneXV1ZW5jaGlUZXhjaGEucG5nJyk7IC8vIOWCmOOBruODhuOCr+OCueODgeODo+eUu+WDj+OBruODkeOCuVxuXG4gICAgICAgIGNvbnN0IHVtYnJlbGxhTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaExhbWJlcnRNYXRlcmlhbCh7IG1hcDogdW1icmVsbGFUZXh0dXJlICxzaWRlOiBUSFJFRS5Eb3VibGVTaWRlfSk7XG4gICAgICAgIHRoaXMudW1icmVsbGEgPSBuZXcgVEhSRUUuTWVzaCh1bWJyZWxsYUdlb21ldHJ5LCB1bWJyZWxsYU1hdGVyaWFsKTtcblxuXG4gICAgICAgIHRoaXMudW1icmVsbGEucG9zaXRpb24ueSA9IDEyOyBcblxuICAgICAgICBjb25zdCBwb2xlR2VvbWV0cnkgPSBuZXcgVEhSRUUuQ3lsaW5kZXJHZW9tZXRyeSgxLjUsIDEuNSwgMTAsIDMyKTtcbiAgICAgICAgY29uc3QgcG9sZU1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hMYW1iZXJ0TWF0ZXJpYWwoeyBjb2xvcjogMHhhYWFhYWEgfSk7IC8vIOaUr+afseOBruiJsuOCkuioreWumlxuICAgICAgICB0aGlzLnVtYnJlbGxhUG9sZSA9IG5ldyBUSFJFRS5NZXNoKHBvbGVHZW9tZXRyeSwgcG9sZU1hdGVyaWFsKTtcbiAgICAgICAgdGhpcy51bWJyZWxsYVBvbGUucG9zaXRpb24uc2V0KDAsIDUsIDApOyBcbiAgICAgICBcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQodGhpcy51bWJyZWxsYSk7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKHRoaXMudW1icmVsbGFQb2xlKTtcbiAgICB9XG59XG5cblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGluaXQpO1xuXG5mdW5jdGlvbiBpbml0KCkge1xuICAgIGxldCBjb250YWluZXIgPSBuZXcgVGhyZWVKU0NvbnRhaW5lcigpO1xuXG4gICAgbGV0IHZpZXdwb3J0ID0gY29udGFpbmVyLmNyZWF0ZVJlbmRlcmVyRE9NKDY0MCwgNDgwLCBuZXcgVEhSRUUuVmVjdG9yMygxMCwgMTAsIDEwKSk7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh2aWV3cG9ydCk7XG59XG5cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuIiwidmFyIGRlZmVycmVkID0gW107XG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8gPSAocmVzdWx0LCBjaHVua0lkcywgZm4sIHByaW9yaXR5KSA9PiB7XG5cdGlmKGNodW5rSWRzKSB7XG5cdFx0cHJpb3JpdHkgPSBwcmlvcml0eSB8fCAwO1xuXHRcdGZvcih2YXIgaSA9IGRlZmVycmVkLmxlbmd0aDsgaSA+IDAgJiYgZGVmZXJyZWRbaSAtIDFdWzJdID4gcHJpb3JpdHk7IGktLSkgZGVmZXJyZWRbaV0gPSBkZWZlcnJlZFtpIC0gMV07XG5cdFx0ZGVmZXJyZWRbaV0gPSBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV07XG5cdFx0cmV0dXJuO1xuXHR9XG5cdHZhciBub3RGdWxmaWxsZWQgPSBJbmZpbml0eTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZWZlcnJlZC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV0gPSBkZWZlcnJlZFtpXTtcblx0XHR2YXIgZnVsZmlsbGVkID0gdHJ1ZTtcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGNodW5rSWRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRpZiAoKHByaW9yaXR5ICYgMSA9PT0gMCB8fCBub3RGdWxmaWxsZWQgPj0gcHJpb3JpdHkpICYmIE9iamVjdC5rZXlzKF9fd2VicGFja19yZXF1aXJlX18uTykuZXZlcnkoKGtleSkgPT4gKF9fd2VicGFja19yZXF1aXJlX18uT1trZXldKGNodW5rSWRzW2pdKSkpKSB7XG5cdFx0XHRcdGNodW5rSWRzLnNwbGljZShqLS0sIDEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZnVsZmlsbGVkID0gZmFsc2U7XG5cdFx0XHRcdGlmKHByaW9yaXR5IDwgbm90RnVsZmlsbGVkKSBub3RGdWxmaWxsZWQgPSBwcmlvcml0eTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYoZnVsZmlsbGVkKSB7XG5cdFx0XHRkZWZlcnJlZC5zcGxpY2UoaS0tLCAxKVxuXHRcdFx0dmFyIHIgPSBmbigpO1xuXHRcdFx0aWYgKHIgIT09IHVuZGVmaW5lZCkgcmVzdWx0ID0gcjtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIG5vIGJhc2VVUklcblxuLy8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBhbmQgbG9hZGluZyBjaHVua3Ncbi8vIHVuZGVmaW5lZCA9IGNodW5rIG5vdCBsb2FkZWQsIG51bGwgPSBjaHVuayBwcmVsb2FkZWQvcHJlZmV0Y2hlZFxuLy8gW3Jlc29sdmUsIHJlamVjdCwgUHJvbWlzZV0gPSBjaHVuayBsb2FkaW5nLCAwID0gY2h1bmsgbG9hZGVkXG52YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuXHRcIm1haW5cIjogMFxufTtcblxuLy8gbm8gY2h1bmsgb24gZGVtYW5kIGxvYWRpbmdcblxuLy8gbm8gcHJlZmV0Y2hpbmdcblxuLy8gbm8gcHJlbG9hZGVkXG5cbi8vIG5vIEhNUlxuXG4vLyBubyBITVIgbWFuaWZlc3RcblxuX193ZWJwYWNrX3JlcXVpcmVfXy5PLmogPSAoY2h1bmtJZCkgPT4gKGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9PT0gMCk7XG5cbi8vIGluc3RhbGwgYSBKU09OUCBjYWxsYmFjayBmb3IgY2h1bmsgbG9hZGluZ1xudmFyIHdlYnBhY2tKc29ucENhbGxiYWNrID0gKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uLCBkYXRhKSA9PiB7XG5cdHZhciBbY2h1bmtJZHMsIG1vcmVNb2R1bGVzLCBydW50aW1lXSA9IGRhdGE7XG5cdC8vIGFkZCBcIm1vcmVNb2R1bGVzXCIgdG8gdGhlIG1vZHVsZXMgb2JqZWN0LFxuXHQvLyB0aGVuIGZsYWcgYWxsIFwiY2h1bmtJZHNcIiBhcyBsb2FkZWQgYW5kIGZpcmUgY2FsbGJhY2tcblx0dmFyIG1vZHVsZUlkLCBjaHVua0lkLCBpID0gMDtcblx0aWYoY2h1bmtJZHMuc29tZSgoaWQpID0+IChpbnN0YWxsZWRDaHVua3NbaWRdICE9PSAwKSkpIHtcblx0XHRmb3IobW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcblx0XHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XG5cdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18ubVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKHJ1bnRpbWUpIHZhciByZXN1bHQgPSBydW50aW1lKF9fd2VicGFja19yZXF1aXJlX18pO1xuXHR9XG5cdGlmKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKSBwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbihkYXRhKTtcblx0Zm9yKDtpIDwgY2h1bmtJZHMubGVuZ3RoOyBpKyspIHtcblx0XHRjaHVua0lkID0gY2h1bmtJZHNbaV07XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGluc3RhbGxlZENodW5rcywgY2h1bmtJZCkgJiYgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKSB7XG5cdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF1bMF0oKTtcblx0XHR9XG5cdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gMDtcblx0fVxuXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHJlc3VsdCk7XG59XG5cbnZhciBjaHVua0xvYWRpbmdHbG9iYWwgPSBzZWxmW1wid2VicGFja0NodW5rY2dwcmVuZGVyaW5nXCJdID0gc2VsZltcIndlYnBhY2tDaHVua2NncHJlbmRlcmluZ1wiXSB8fCBbXTtcbmNodW5rTG9hZGluZ0dsb2JhbC5mb3JFYWNoKHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgMCkpO1xuY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2ggPSB3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIGNodW5rTG9hZGluZ0dsb2JhbC5wdXNoLmJpbmQoY2h1bmtMb2FkaW5nR2xvYmFsKSk7IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBkZXBlbmRzIG9uIG90aGVyIGxvYWRlZCBjaHVua3MgYW5kIGV4ZWN1dGlvbiBuZWVkIHRvIGJlIGRlbGF5ZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHVuZGVmaW5lZCwgW1widmVuZG9ycy1ub2RlX21vZHVsZXNfY2Fubm9uLWVzX2Rpc3RfY2Fubm9uLWVzX2pzLW5vZGVfbW9kdWxlc190aHJlZV9leGFtcGxlc19qc21fY29udHJvbHNfT3JiLWU1OGJkMlwiXSwgKCkgPT4gKF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9hcHAudHNcIikpKVxuX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyhfX3dlYnBhY2tfZXhwb3J0c19fKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==