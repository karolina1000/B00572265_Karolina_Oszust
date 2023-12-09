import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';
import { SkyMaterial } from 'babylonjs-materials';

export default function createMyScene(canvasElementId: string): BABYLON.Scene {
    const canvas = document.getElementById(canvasElementId) as HTMLCanvasElement;
    const engine = new BABYLON.Engine(canvas, true);
    const scene = new BABYLON.Scene(engine);

    setupCamera(scene, canvas);
    setupLighting(scene);
    addSkybox(scene);
    addTerrain(scene);
    addPyramids(scene);
    addMorePyramids(scene);
    mergePyramids(scene);
    doRender(engine, scene);

    return scene;
}

function setupCamera(scene: BABYLON.Scene, canvas: HTMLCanvasElement): void {
    const camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 4, 10, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    camera.lowerBetaLimit = 0.1;
    camera.upperBetaLimit = (Math.PI / 2) * 0.9;
    camera.lowerRadiusLimit = 10;
    camera.upperRadiusLimit = 50;
}

function setupLighting(scene: BABYLON.Scene): void {
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);
}

function addSkybox(scene: BABYLON.Scene): void {
    const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, scene);
    const skyMaterial = new SkyMaterial("skyMaterial", scene);
    skyMaterial.backFaceCulling = false;
    skybox.material = skyMaterial;
}

function addTerrain(scene: BABYLON.Scene): void {
    let ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "textures/heightMap.png", 100, 100, 150, 0, 10, scene, false);
    let groundMaterial = new BABYLON.StandardMaterial("groundMat", scene);
    groundMaterial.diffuseTexture = new BABYLON.Texture("textures/cylinderTexture.jpg", scene);
    ground.material = groundMaterial;
}

function addPyramids(scene: BABYLON.Scene): void {
    const pyramidMaterial = new BABYLON.StandardMaterial("pyramidMat", scene);
    pyramidMaterial.diffuseTexture = new BABYLON.Texture("textures/pyramidTexture.jpg", scene);

    const pyramid1 = createPyramid(scene, "pyramid1", 5, 10);
    pyramid1.position = new BABYLON.Vector3(-10, 13, 10);
    pyramid1.material = pyramidMaterial;

    const pyramid2 = createPyramid(scene, "pyramid2", 5, 10);
    pyramid2.position = new BABYLON.Vector3(5, 12, 10);
    pyramid2.material = pyramidMaterial;
}

function addMorePyramids(scene: BABYLON.Scene): void {
    const pyramidMaterial = new BABYLON.StandardMaterial("pyramidMat", scene);
    pyramidMaterial.diffuseTexture = new BABYLON.Texture("textures/pyramidTexture.jpg", scene);

    const positions = [
        new BABYLON.Vector3(15, 12, 15),
        new BABYLON.Vector3(-15, 12, -15),
        new BABYLON.Vector3(20, 12, -20),
    ];
    const sizes = [3, 5, 7];

    positions.forEach((position, index) => {
        const pyramid = createPyramid(scene, `additionalPyramid${index}`, sizes[index], sizes[index] * 2);
        pyramid.position = position;
        pyramid.material = pyramidMaterial;
    });
}

function mergePyramids(scene: BABYLON.Scene): void {
    const meshes = scene.meshes.filter(mesh => mesh instanceof BABYLON.Mesh && mesh.name.includes("pyramid"));
    
    const pyramids = meshes as BABYLON.Mesh[];

    const mergedPyramid = BABYLON.Mesh.MergeMeshes(pyramids, true, true, undefined, false, true);
    if (mergedPyramid) {
        mergedPyramid.position.y = 1; // Adjust position if needed
    }
}


function createPyramid(scene, name, height, baseWidth) {
    return BABYLON.MeshBuilder.CreateCylinder(name, {
        diameterTop: 0, 
        diameterBottom: baseWidth, 
        height: height, 
        tessellation: 4
    }, scene);
}

function doRender(engine: BABYLON.Engine, scene: BABYLON.Scene): void {
    engine.runRenderLoop(() => {
        scene.render();
    });

    window.addEventListener('resize', () => {
        engine.resize();
    });
}

createMyScene('renderCanvas');
