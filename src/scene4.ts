import * as BABYLON from '@babylonjs/core';
import * as GUI from '@babylonjs/gui';
import '@babylonjs/loaders';
import { SkyMaterial } from '@babylonjs/materials';


    function createSkybox(scene: BABYLON.Scene): void {
        // Create the skybox mesh
        const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, scene);
        skybox.infiniteDistance = true;
    
        // Create and assign the sky material
        const skyMaterial = new SkyMaterial("skyMaterial", scene);
        skyMaterial.backFaceCulling = false;
        skybox.material = skyMaterial;
    
        // Set properties of the sky material
        skyMaterial.luminance = 0.1;
        skyMaterial.turbidity = 10;
        skyMaterial.rayleigh = 2;
        skyMaterial.mieCoefficient = 0.005;
        skyMaterial.mieDirectionalG = 0.8;
    
        // Update the sun position
        const sunPosition = new BABYLON.Vector3(0, 100, 0);
        skyMaterial.sunPosition = sunPosition;
    }
    


function createCameraAndLight(scene: BABYLON.Scene, canvas: HTMLCanvasElement): void {
    const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2, 5, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);
    light.intensity = 0.7;
}

function setupButtonAudio(scene: BABYLON.Scene): BABYLON.Sound {
    return new BABYLON.Sound("clickSound", "sounds/buttonClickSound.mp3", scene, null, { autoplay: false });
}

function createSphereScene(engine: BABYLON.Engine, canvas: HTMLCanvasElement, switchToMenu: () => void): BABYLON.Scene {
    const scene = new BABYLON.Scene(engine);
    createCameraAndLight(scene, canvas);
    createSkybox(scene);

    const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 1 }, scene);
    sphere.position.y = 1;

    const spherePBRMaterial = new BABYLON.PBRMaterial("spherePBRMaterial", scene);
    spherePBRMaterial.albedoColor = new BABYLON.Color3(1, 0.766, 0.336); // Gold color
    spherePBRMaterial.metallic = 1.0;
    spherePBRMaterial.roughness = 0.4;
    sphere.material = spherePBRMaterial;

    scene.registerBeforeRender(() => {
        sphere.rotation.y += 0.01;
    });

    addBackToMenuButton(scene, switchToMenu);

    return scene;
}

function createCubeScene(engine: BABYLON.Engine, canvas: HTMLCanvasElement, switchToMenu: () => void): BABYLON.Scene {
    const scene = new BABYLON.Scene(engine);
    createCameraAndLight(scene, canvas);
    createSkybox(scene);

    const box = BABYLON.MeshBuilder.CreateBox("box", { size: 1 }, scene);
    box.position.y = 1;

    // Creating a PBR material for the cube
    const cubePBRMaterial = new BABYLON.PBRMaterial("cubePBRMaterial", scene);
    cubePBRMaterial.albedoColor = new BABYLON.Color3(0.2, 0.5, 0.8); // Custom color
    cubePBRMaterial.metallic = 0.9; //  metallic effect
    cubePBRMaterial.roughness = 0.3; // surface roughness

    box.material = cubePBRMaterial;

    scene.registerBeforeRender(() => {
        box.rotation.y += 0.01;
    });

    addBackToMenuButton(scene, switchToMenu);

    return scene;
}

function createMenuScene(engine: BABYLON.Engine, canvas: HTMLCanvasElement, switchScene: (scene: BABYLON.Scene) => void): BABYLON.Scene {
    const scene = new BABYLON.Scene(engine);
    createCameraAndLight(scene, canvas);
    createSkybox(scene);
    const clickSound = setupButtonAudio(scene);

    const backgroundMusic = new BABYLON.Sound("backgroundMusic", "sounds/backgroundMusic.mp3", scene, null, { loop: true, autoplay: true });
    let isMusicPlaying = true;

    const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI_Menu", true, scene);

    // Menu Title
    const title = new GUI.TextBlock();
    title.text = "Menu";
    title.color = "white";
    title.fontSize = 24;
    title.height = "30px";
    title.top = "-100px";
    title.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    advancedTexture.addControl(title);

    // Sphere Button
    const sphereButton = GUI.Button.CreateSimpleButton("sphereButton", "");
    configureMenuButton(sphereButton, "green", "-50px");
    addTextToButton(sphereButton, "Sphere Scene"); // Add text to the button
    sphereButton.onPointerUpObservable.add(() => {
        clickSound.play();
        switchScene(createSphereScene(engine, canvas, () => switchScene(scene)));
    });
    advancedTexture.addControl(sphereButton);

    // Cube Button
    const cubeButton = GUI.Button.CreateSimpleButton("cubeButton", "");
    configureMenuButton(cubeButton, "blue", "50px");
    addTextToButton(cubeButton, "Cube Scene"); // Add text to the button
    cubeButton.onPointerUpObservable.add(() => {
        clickSound.play();
        switchScene(createCubeScene(engine, canvas, () => switchScene(scene)));
    });
    advancedTexture.addControl(cubeButton);

    // Music Toggle Button
    const musicToggleButton = GUI.Button.CreateSimpleButton("musicToggleButton", isMusicPlaying ? "Music: On" : "Music: Off");
    configureMenuButton(musicToggleButton, "orange", "150px");
    musicToggleButton.onPointerUpObservable.add(() => {
        isMusicPlaying = !isMusicPlaying;
        backgroundMusic.setVolume(isMusicPlaying ? 1 : 0);
        // Update text directly
        musicToggleButton.textBlock.text = isMusicPlaying ? "Music: On" : "Music: Off";
    });
    advancedTexture.addControl(musicToggleButton);

    return scene;
}

function addBackToMenuButton(scene: BABYLON.Scene, switchToMenu: () => void): void {
    const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);

    const backButton = GUI.Button.CreateSimpleButton("backButton", "");
    configureMenuButton(backButton, "red", "bottom-right");
    addTextToButton(backButton, "Back to Menu"); // Add text to the button
    backButton.onPointerUpObservable.add(switchToMenu);
    advancedTexture.addControl(backButton);
}

function configureMenuButton(button: GUI.Button, background: string, top: string): void {
    button.width = "150px";
    button.height = "40px";
    button.color = "white";
    button.background = background;
    button.top = top;
    button.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
}

// Function to add text to a button
function addTextToButton(button: GUI.Button, text: string): void {
    if (button.children && button.children[0] instanceof GUI.TextBlock) {
        const textBlock = button.children[0] as GUI.TextBlock;
        textBlock.text = text;
    }
}

export default function setupMainScene(canvasElementId: string): void {
    const canvas = document.getElementById(canvasElementId) as HTMLCanvasElement;
    const engine = new BABYLON.Engine(canvas, true);

    const switchScene = (newScene: BABYLON.Scene) => {
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
