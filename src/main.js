import { Renderer } from "./renderer.js";
import { Display } from "./display.js";
import { Events } from "./events.js";
import { Resources } from "./resources.js";
import { Command } from "./command.js";
import { World } from "./world.js";
import { Engine } from "./engine.js";

// Going to borrow some code from another project of mine

const Game = {
    Command: null,
    World: null,
    Renderer: null,
    Resources: null,
    Display: null,
    Engine: null,
    Events: null
};

window.Game = Game;

Game.Renderer = new Renderer();
Game.Display = new Display();
Game.Command = new Command();
Game.Resources = new Resources();
Game.Events = new Events();
Game.World = new World();
Game.Engine = new Engine();

Game.Command.listenForCommands();

document.getElementById("command").focus();

document.addEventListener("alpine:init", () => {
    Alpine.data("Game", () => ({
        Resources: {
            ResourceData: structuredClone(Game.Resources.ResourceData)
        },
        World: {
            mapString: ""  
        },
        Display: {
            Logs: {
                logs: []
            }
        },
        UI: {
            Modal: {
                showModal: false,
                title: "",
                currentScene: "main",
                scenes: {
                    main: {
                        text: "",
                        actions: []
                    }
                }
            },
            Resources: {
                maxSpace: 0,
                freeSpace: 0
            },
            gameOver: false
        }
    }));
});

document.addEventListener("alpine:initialized", () => {
    Game.Engine.init();
});