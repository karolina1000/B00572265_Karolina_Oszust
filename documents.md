# sources

Resources and models used in my project:

bird - https://sketchfab.com/3d-models/hummingbird-flying-4e6d591f6e50493aa5e31355084fc4e8
Sky Material - https://doc.babylonjs.com/toolsAndResources/assetLibraries/materialsLibrary/skyMat
Lava Texture -  https://forum.babylonjs.com/t/lava-texture-fun/5888
PBR - https://doc.babylonjs.com/features/featuresDeepDive/materials/using/masterPBR
https://doc.babylonjs.com/toolsAndResources/assetLibraries/availableTextures
Pyramid textures - https://www.flickr.com/photos/nikmakepeace/4085109977
Marble Textures - https://unsplash.com/s/photos/marble-texture
Water texture - https://www.piqsels.com/id/public-domain-photo-fsxlp
Sand texture - https://pl.3dexport.com/3dmodel-sand-and-road-texture-88674.htm
Swirl texture - https://unblast.com/download/41145/
Ocean texture - https://wallpaperaccess.com/ocean-texture
other textures - https://github.com/BabylonJS/Documentation/blob/master/content/toolsAndResources/assetLibraries/availableTextures.
background music - https://pixabay.com/music/build-up-scenes-a-long-way-166




# Functions used: 


# scene 1


addEnhancedMerging(scene): Demonstrates mesh merging by creating a torus and a sphere, and then merging them into a single mesh. This function also applies textures to the meshes and configures them to receive shadows.

addElegantMotion(scene): Adds a cylinder mesh to the scene and animates its vertical position. This demonstrates how to apply simple animations to objects in Babylon.js.

addGround(scene): Creates a ground plane for the scene, applying a standard material to it, and configuring it to receive shadows.

setupSkyMaterial(scene): Creates a skybox with a sky material, providing a background for the scene.

applyTextureToMesh(mesh, texturePath, scene): Applies a texture to a given mesh.

animateMesh(scene, meshName, property, duration, from, to): Animates mesh.


# scene 2


addTerrain(scene): Generates a terrain mesh using a heightmap texture. This creates a ground with varying elevations, simulating a desert landscape.

addPyramids(scene): Constructs two pyramids using the createPyramid function and positions them in the scene. A texture is applied to these pyramids.

addMorePyramids(scene): Adds additional pyramids at various positions and sizes to create a bigger landscape. 

mergePyramids(scene): Merges all pyramid meshes into a single mesh. 

createPyramid(scene, name, height, baseWidth): A helper function to create a pyramid mesh.


# scene 3

createBirdScene(engine, canvas, switchToMenu): Sets up the main game scene. It creates the scene, camera, lighting, and skybox, loads a bird model, sets up a follow camera to track the bird, and initializes the bird's movement and collision detection with obstacles.

updateBirdPosition(key, bird, movementSpeed, obstacles, scene): Updates the bird's position based on user input (WASD keys), checks for collisions with obstacles, and updates the scene accordingly.

showCollisionMessage(scene): Displays a collision message using the GUI when the bird collides with an obstacle.

createObstacles(scene): Generates random obstacles in the scene for the bird to avoid.

addBackToMenuButton(scene, switchToMenu): Adds a "Back to Menu" button to the bird scene, allowing the user to return to the main menu.

createMenuScene(engine, canvas, switchScene): Creates the main menu scene with a button to start the bird scene and a description of the game.

setupMainScene(canvasElementId): Initializes the entire application. It sets up the rendering engine, handles scene switching, and manages window resizing events.

switchScene(newScene): A utility function to switch between different scenes



# scene 4

setupButtonAudio(scene): Creates a sound object for button click feedback.

createSphereScene(engine, canvas, switchToMenu): Creates a scene with a rotating sphere demonstrating the use of PBR materials for realistic rendering. Includes a "Back to Menu" button to return to the main menu.

createCubeScene(engine, canvas, switchToMenu): Similar to createSphereScene, but with a cube.

createMenuScene(engine, canvas, switchScene): Constructs the main menu scene with options to navigate to the sphere or cube scenes. Includes background music and demonstrates dynamic GUI elements like buttons and text blocks.

addBackToMenuButton(scene, switchToMenu): Adds a GUI button to return to the main menu.

configureMenuButton(button, background, top): A utility function to for the appearance of menu buttons.

addTextToButton(button, text): Add text to buttons.

setupMainScene(canvasElementId): Initializes the entire application, handling the main rendering loop and window resize events. It sets up the menu scene as the starting point of the application.



# scene5

Babylon.js engine and sets up two scenes: scene1 and scene2.
Each scene contains a 3D object (a sphere in scene1 and a cube in scene2) with textures and animations.
Lighting and shadow generation are also configured for each scene.
There's a skybox created for both scenes to provide a nicer background.
GUI elements (a "Switch Scene" button) are added to switch between the scenes.
The code sets up event listeners for keyboard input to control the objects in each scene. (Arrows)

Users can interact with the objects in Scene 5 using keyboard inputs. The arrow keys allow for the movement of the sphere and the rotation of the cube, providing an interactive experience.



Explanation:


import * as BABYLON from '@babylonjs/core';
import * as GUI from '@babylonjs/gui';
import '@babylonjs/loaders';
import { SkyMaterial } from '@babylonjs/materials';

Here, the code imports various modules from Babylon.js, including the core library, GUI components, loaders, and materials. These modules are essential for creating and managing 3D scenes.


export default function createMyScenes(canvasElementId) {
    // Function implementation goes here
}
The createMyScenes function is the main entry point for setting up and managing the 3D scenes. It takes the canvasElementId as a parameter, which is the ID of the HTML canvas element where the scenes will be rendered.


const canvas = document.getElementById(canvasElementId) as HTMLCanvasElement;
const engine = new BABYLON.Engine(canvas, true);
This code obtains the HTML canvas element using the provided canvasElementId and initializes a Babylon.js engine using that canvas.


Variables:

let currentScene;
let scene1, scene2;
let switchButton;
let sphere, cube;
Several variables are declared to keep track of the current scene, two scene instances (scene1 and scene2), a switch button for toggling between scenes, and references to sphere and cube meshes.


scene1 = createScene(engine, canvas, "scene1");
scene2 = createScene(engine, canvas, "scene2");
scene1.GUI = scene2.GUI = null;
currentScene = scene1;
Two scenes (scene1 and scene2) are created using the createScene function. Each scene is associated with specific objects and behaviors. The GUI property of both scenes is initialized as null, and currentScene is initially set to scene1


createGUI(engine);
The createGUI function is called to set up the Graphical User Interface (GUI) for the scenes. It creates a button (switchButton) that allows users to switch between scenes.


Rendering:

doRender(engine);
The doRender function is called to start the rendering loop, which continuously renders the current scene. It also adds a resize event listener to handle canvas resizing.


function createScene(engine, canvas, name) {
    // Scene creation logic for "scene1" and "scene2" goes here
    // ...
}
The createScene function is responsible for creating individual scenes. Depending on the name parameter, it sets up either "scene1" or "scene2" with specific 3D objects, materials, animations, and controls.



Scenes switching:

function switchScene(engine) {
    // Switches between "scene1" and "scene2"
    // ...
}
The switchScene function allows users to switch between "scene1" and "scene2". It disposes of the current GUI, creates a new GUI, and updates the currentScene variable accordingly.


Comtrols:

function setupSphereControls() {
    window.addEventListener("keydown", (evt) => {
        switch (evt.key) {
            case "ArrowLeft": sphere.position.x -= 0.1; break;
            case "ArrowRight": sphere.position.x += 0.1; break;
            case "ArrowUp": sphere.position.z -= 0.1; break;
            case "ArrowDown": sphere.position.z += 0.1; break;
        }
    });
}
In the setupSphereControls function:

An event listener is added to the window object to listen for keyboard events (keydown).
When a key is pressed, the event object (evt) is passed to an arrow function.
The arrow function checks which arrow key was pressed using evt.key.
Depending on the arrow key pressed, the position of the sphere (sphere.position) is modified to move it left, right, forward, or backward along the X and Z axes.
For example:

Pressing the "ArrowLeft" key moves the sphere to the left (decreasing its X-coordinate).
Pressing the "ArrowRight" key moves the sphere to the right (increasing its X-coordinate).
Pressing the "ArrowUp" key moves the sphere forward (decreasing its Z-coordinate).
Pressing the "ArrowDown" key moves the sphere backward (increasing its Z-coordinate).



Cube Controls:

function setupCubeControls() {
    window.addEventListener("keydown", (evt) => {
        switch (evt.key) {
            case "ArrowLeft": cube.rotation.y -= 0.1; break;
            case "ArrowRight": cube.rotation.y += 0.1; break;
            case "ArrowUp": cube.rotation.x -= 0.1; break;
            case "ArrowDown": cube.rotation.x += 0.1; break;
        }
    });
}


The setupCubeControls function is similar to setupSphereControls, but it controls the rotation of the cube object instead of its position. It allows users to rotate the cube around its X and Y axes based on the arrow keys pressed.







