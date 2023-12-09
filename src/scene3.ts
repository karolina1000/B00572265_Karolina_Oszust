import * as BABYLON from '@babylonjs/core';
import * as GUI from '@babylonjs/gui';
import '@babylonjs/loaders';
import { SkyMaterial } from '@babylonjs/materials';

function createSky(scene) {
    const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 1000 }, scene);
    const skyMaterial = new SkyMaterial("skyMaterial", scene);
    skyMaterial.backFaceCulling = false;
    skyMaterial.inclination = 0;
    skyMaterial.azimuth = 0.25;
    skyMaterial.luminance = 1;
    skyMaterial.turbidity = 10;
    skybox.material = skyMaterial;
}

function createCameraAndLight(scene, canvas) {
    const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2, 5, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);
    light.intensity = 0.7;
}

const sceneGUIs = new Map();

function createBirdScene(engine, canvas, switchToMenu) {
    const scene = new BABYLON.Scene(engine);
    createCameraAndLight(scene, canvas);
    createSky(scene);

    // Create and store the GUI texture for this scene
    const gui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);
    sceneGUIs.set(scene, gui);

    let bird;
    let flyAnimation;
    let isMoving = false;
    const movementSpeed = 0.2;
    const obstacles = createObstacles(scene);
    

    BABYLON.SceneLoader.ImportMesh("", "models/", "bird.glb", scene, function (newMeshes, particleSystems, skeletons) {
        bird = newMeshes[0];
        bird.position = new BABYLON.Vector3(0, 0, 0);

        const camera = new BABYLON.FollowCamera("followCam", new BABYLON.Vector3(0, 10, -10), scene);
        camera.lockedTarget = bird;
        camera.radius = 20;
        camera.heightOffset = 4;
        camera.rotationOffset = 0;
        camera.attachControl(canvas);

        if (skeletons.length > 0) {
            flyAnimation = scene.beginAnimation(skeletons[0], 0, 100, true, 1.0);
            flyAnimation.pause();
        }
    });

    window.addEventListener('keydown', function (event) {
        if (bird && flyAnimation) {
            switch (event.key) {
                case 'w':
                case 's':
                case 'a':
                case 'd':
                    isMoving = true;
                    updateBirdPosition(event.key, bird, movementSpeed, obstacles, scene);
                    flyAnimation.restart();
                    break;
            }
        }
    });

    window.addEventListener('keyup', function (event) {
        if (['w', 's', 'a', 'd'].includes(event.key)) {
            isMoving = false;
            setTimeout(() => {
                if (!isMoving) flyAnimation.pause();
            }, 100);
        }
    });

    addBackToMenuButton(scene, switchToMenu);

    return scene;
}

function updateBirdPosition(key, bird, movementSpeed, obstacles, scene) {
    const futurePosition = bird.position.clone();
    switch (key) {
        case 'w': futurePosition.z += movementSpeed; break;
        case 's': futurePosition.z -= movementSpeed; break;
        case 'a': futurePosition.x -= movementSpeed; break;
        case 'd': futurePosition.x += movementSpeed; break;
    }

    let collision = false;
    for (let obstacle of obstacles) {
        if (BABYLON.Vector3.Distance(futurePosition, obstacle.position) < 1) {
            collision = true;
            showCollisionMessage(scene);
            break;
        }
    }

    if (!collision) {
        bird.position = futurePosition;
    }
}
function showCollisionMessage(scene) {
    const gui = sceneGUIs.get(scene);
    if (!gui) return;

    const text1 = new GUI.TextBlock();
    text1.text = "Collision detected!";
    text1.color = "red";
    text1.fontSize = 24;
    gui.addControl(text1);

    // Remove the message after a specified duration
    setTimeout(() => {
        gui.removeControl(text1);
    }, 1000);
}

function createObstacles(scene) {
    const obstacles = [];
    for (let i = 0; i < 5; i++) {
        const obstacle = BABYLON.MeshBuilder.CreateBox(`obstacle${i}`, { size: 1 }, scene);
        obstacle.position = new BABYLON.Vector3(Math.random() * 20 - 10, 0, Math.random() * 20 - 10);
        obstacles.push(obstacle);
    }
    return obstacles;
}

function addBackToMenuButton(scene, switchToMenu) {
    const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);
    const backButton = GUI.Button.CreateSimpleButton("backButton", "Back to Menu");
    backButton.width = "150px";
    backButton.height = "40px";
    backButton.color = "white";
    backButton.background = "blue";
    backButton.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    backButton.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    backButton.onPointerUpObservable.add(switchToMenu);
    advancedTexture.addControl(backButton);
}

function createMenuScene(engine, canvas, switchScene) {
    const scene = new BABYLON.Scene(engine);
    createCameraAndLight(scene, canvas);
    createSky(scene);
    const clickSound = new BABYLON.Sound("clickSound", "sounds/buttonClickSound.mp3", scene, null, { autoplay: false });

    const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI_Menu", true, scene);
    const descriptionText = new GUI.TextBlock();
    descriptionText.text = "Welcome to the game! Use WASD to move the bird and avoid obstacles.";
    descriptionText.color = "white";
    descriptionText.fontSize = 24;
    descriptionText.height = "60px";
    descriptionText.top = "100px";
    descriptionText.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    advancedTexture.addControl(descriptionText);

    const birdButton = GUI.Button.CreateSimpleButton("birdButton", "Bird Scene");
    birdButton.textBlock.text = "Play game!";
    birdButton.width = "150px";
    birdButton.height = "40px";
    birdButton.color = "white";
    birdButton.background = "brown";
    birdButton.top = "250px";
    birdButton.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    birdButton.onPointerUpObservable.add(() => {
        clickSound.play();
        switchScene(createBirdScene(engine, canvas, () => switchScene(scene)));
    });
    advancedTexture.addControl(birdButton);

    return scene;
}

export default function setupMainScene(canvasElementId) {
    const canvas = document.getElementById(canvasElementId) as HTMLCanvasElement;
    const engine = new BABYLON.Engine(canvas, true);

    const switchScene = (newScene) => {
        engine.stopRenderLoop();
        engine.runRenderLoop(() => {
            newScene.render();
        });
    };

    const menuScene = createMenuScene(engine, canvas, switchScene);
    switchScene(menuScene);

    window.addEventListener('resize', () => {
        engine.resize();
    });
}

setupMainScene('renderCanvas');
