import * as BABYLON from '@babylonjs/core';
import * as GUI from '@babylonjs/gui';
import '@babylonjs/loaders';
import { SkyMaterial } from '@babylonjs/materials';

export default function createMyScenes(canvasElementId) {
    const canvas = document.getElementById(canvasElementId) as HTMLCanvasElement;
    const engine = new BABYLON.Engine(canvas, true);

    let currentScene;
    let scene1, scene2;
    let switchButton; // Declare switchButton locally
    let sphere, cube; // Declare sphere and cube

    scene1 = createScene(engine, canvas, "scene1");
    scene2 = createScene(engine, canvas, "scene2");
    scene1.GUI = scene2.GUI = null; // Initialize GUI property to null
    currentScene = scene1;

    createGUI(engine); // Pass the engine to createGUI
    doRender(engine);

    function createScene(engine, canvas, name) {
        const scene = new BABYLON.Scene(engine);
        setupCamera(scene, canvas);
        const light = setupLighting(scene);
    
        if (name === "scene1") {
            sphere = addSphere(scene, light);
            addSphereAnimation(sphere, scene); // Pass the scene as a parameter
            setupSphereControls();
        } else if (name === "scene2") {
            cube = addCube(scene, light);
            setupCubeRotation(cube, scene); // Pass the scene as a parameter
            setupCubeControls();
        }
        addSkybox(scene);
    
        return scene;
    }

    function setupCamera(scene, canvas) {
        const camera = new BABYLON.ArcRotateCamera("camera", 0, Math.PI / 2, 10, BABYLON.Vector3.Zero(), scene);
        camera.attachControl(canvas, true);
    }

    function setupLighting(scene) {
        const light = new BABYLON.DirectionalLight("dirLight", new BABYLON.Vector3(-1, -2, -1), scene);
        light.position = new BABYLON.Vector3(20, 40, 20);
        return light;
    }

    function addSphere(scene, light) {
        const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2 }, scene);
        const material = new BABYLON.StandardMaterial("sphereMaterial", scene);
        material.diffuseTexture = new BABYLON.Texture("textures/sphereTexture.jpg", scene);
        sphere.material = material;
        sphere.position.y = 1;

        const shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
        shadowGenerator.getShadowMap().renderList.push(sphere);

        return sphere;
    }

    function addSphereAnimation(sphere, scene) {
        const frameRate = 30;
        const ySlide = new BABYLON.Animation("ySlide", "position.y", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    
        const keyFrames = [];
        keyFrames.push({ frame: 0, value: 1 });
        keyFrames.push({ frame: frameRate, value: 3 });
        keyFrames.push({ frame: 2 * frameRate, value: 1 });
    
        ySlide.setKeys(keyFrames);
        sphere.animations.push(ySlide);
        scene.beginAnimation(sphere, 0, 2 * frameRate, true);
    }

    function setupSphereControls() { // Control logic for the objects
        window.addEventListener("keydown", (evt) => {
            switch(evt.key) {
                case "ArrowLeft": sphere.position.x -= 0.1; break;
                case "ArrowRight": sphere.position.x += 0.1; break;
                case "ArrowUp": sphere.position.z -= 0.1; break;
                case "ArrowDown": sphere.position.z += 0.1; break;
            }
        });
    }

    function addCube(scene, light) {
        const cube = BABYLON.MeshBuilder.CreateBox("cube", { size: 2 }, scene);
        const material = new BABYLON.StandardMaterial("cubeMaterial", scene);
        material.diffuseTexture = new BABYLON.Texture("textures/cubeTexture.jpg", scene);
        cube.material = material;
        cube.position.y = 1;

        const shadowGenerator = new BABYLON.ShadowGenerator(1024, light); // Shadows
        shadowGenerator.getShadowMap().renderList.push(cube);

        return cube;
    }

    function setupCubeRotation(cube, scene) {
        scene.onBeforeRenderObservable.add(() => {
            cube.rotation.x += 0.005;
            cube.rotation.y += 0.005;
        });
    }

    function setupCubeControls() {
        window.addEventListener("keydown", (evt) => {
            switch(evt.key) {
                case "ArrowLeft": cube.rotation.y -= 0.1; break;
                case "ArrowRight": cube.rotation.y += 0.1; break;
                case "ArrowUp": cube.rotation.x -= 0.1; break;
                case "ArrowDown": cube.rotation.x += 0.1; break;
            }
        });
    }

    function addSkybox(scene) {
        const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, scene);
        const skyMaterial = new SkyMaterial("skyMaterial", scene);
        skyMaterial.backFaceCulling = false;
        skybox.material = skyMaterial;
    }

    function createGUI(engine) {  // GUI for buttons and switching scenes
        if (currentScene.GUI) {
            currentScene.GUI.dispose();
        }

        const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, currentScene);
        currentScene.GUI = advancedTexture;

        switchButton = GUI.Button.CreateSimpleButton("switchButton", "Switch Scene");
        switchButton.width = "150px";
        switchButton.height = "40px";
        switchButton.color = "white";
        switchButton.background = "red";
        switchButton.onPointerUpObservable.add(() => {
            switchScene(engine);
        });
        advancedTexture.addControl(switchButton);
    }

    function switchScene(engine) {
        currentScene = currentScene === scene1 ? scene2 : scene1;
        engine.stopRenderLoop();

        if (currentScene.GUI) {
            currentScene.GUI.dispose();
        }
        
        createGUI(engine);

        setTimeout(() => {
            switchButton.isEnabled = true;
        }, 500);

        doRender(engine);
    }

    function doRender(engine) {
        engine.runRenderLoop(() => {
            currentScene.render();
        });

        window.addEventListener('resize', () => {
            engine.resize();
        });
    }
}

createMyScenes('renderCanvas');
