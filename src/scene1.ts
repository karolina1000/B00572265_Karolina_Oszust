import {
    Engine, Scene, Vector3, HemisphericLight, ArcRotateCamera, MeshBuilder, StandardMaterial, Color3,
    ShadowGenerator, DirectionalLight, Mesh, Animation, Space, Texture,
} from "@babylonjs/core";
import { SkyMaterial } from "@babylonjs/materials";




let shadowGenerator;

export default function createMyScene(canvasElementId: string): Scene {
    const canvas = document.getElementById(canvasElementId) as HTMLCanvasElement;
    const engine = new Engine(canvas, true);
    const scene = new Scene(engine);

    setupCameraAndLighting(scene, canvas);
    addEnhancedMerging(scene);
    addElegantMotion(scene);
    addGround(scene); // Add ground to the scene
    setupSkyMaterial(scene);
    doRender(engine, scene);

    return scene;
}

function setupCameraAndLighting(scene: Scene, canvas: HTMLCanvasElement): void {
    const camera = new ArcRotateCamera('camera1', -Math.PI / 2, Math.PI / 2.2, 15, new Vector3(0, 3, 0), scene);
    camera.attachControl(canvas, true);

    const light1 = new HemisphericLight('light1', new Vector3(1, 1, 0), scene);
    light1.intensity = 0.7;

    const light2 = new DirectionalLight('dir01', new Vector3(-1, -2, -1), scene);
    light2.position = new Vector3(20, 40, 20);
    light2.intensity = 0.5;

    shadowGenerator = new ShadowGenerator(1024, light2);
    shadowGenerator.useBlurExponentialShadowMap = true;
    shadowGenerator.blurKernel = 32;
    shadowGenerator.setDarkness(0.7);
}

function addEnhancedMerging(scene: Scene): void { // Mesh merging for a custom shape
    const torus = MeshBuilder.CreateTorus("torus", { diameter: 3, thickness: 0.5 }, scene);
    torus.position = new Vector3(0, 1, 0);
    applyTextureToMesh(torus, 'textures/torusTexture.jpg', scene);

    const sphere = MeshBuilder.CreateSphere("sphere", { diameter: 2 }, scene);
    sphere.position = new Vector3(0, 1, 0);
    applyTextureToMesh(sphere, 'textures/cubeTexture2.jpg', scene);

    const mergedMesh = Mesh.MergeMeshes([torus, sphere], true, true, undefined, false, true);
    mergedMesh.position.y += 1;

    torus.receiveShadows = true;
    sphere.receiveShadows = true;
    mergedMesh.receiveShadows = true;

    shadowGenerator.addShadowCaster(torus);
    shadowGenerator.addShadowCaster(sphere);
    shadowGenerator.addShadowCaster(mergedMesh);
}

function addElegantMotion(scene: Scene): void {
    const cylinder = MeshBuilder.CreateCylinder("cylinder", { height: 3, diameter: 1 }, scene);
    cylinder.position = new Vector3(-5, 1, 0);
    applyTextureToMesh(cylinder, 'textures/cylinderTexture.jpg', scene);

    animateMesh(scene, "cylinder", 'position.y', 120, 1, 2);

    cylinder.receiveShadows = true;
    shadowGenerator.addShadowCaster(cylinder);
}

function addGround(scene: Scene): void {
    const ground = MeshBuilder.CreateGround("ground", { width: 100, height: 100 }, scene);
    ground.position.y = -0.5; // Position the ground slightly below other objects

    const groundMaterial = new StandardMaterial("groundMat", scene);
    
    ground.material = groundMaterial;

    ground.receiveShadows = true;
}


function setupSkyMaterial(scene: Scene): void {
    const skybox = MeshBuilder.CreateBox("skyBox", { size: 1000 }, scene);
    const skyMaterial = new SkyMaterial("skyMaterial", scene);
    skyMaterial.backFaceCulling = false;
    skybox.material = skyMaterial;
}

function applyTextureToMesh(mesh, texturePath, scene) {
    const material = new StandardMaterial(`${mesh.name}Mat`, scene);
    material.diffuseTexture = new Texture(texturePath, scene);
    mesh.material = material;
}

function animateMesh(scene, meshName, property, duration, from, to) {
    const animation = new Animation(meshName + 'Anim', property, 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
    const keyFrames = [];
    keyFrames.push({ frame: 0, value: from });
    keyFrames.push({ frame: duration, value: to });
    animation.setKeys(keyFrames);

    const mesh = scene.getMeshByName(meshName);
    if (mesh) {
        mesh.animations.push(animation);
        scene.beginAnimation(mesh, 0, duration, true);
    }
}

function doRender(engine: Engine, scene: Scene): void {
    engine.runRenderLoop(() => {
        scene.render();
    });

    window.addEventListener('resize', () => {
        engine.resize();
    });
}

// Run the scene setup
createMyScene('renderCanvas');
