export class Engine {
    init() {
        Game.Renderer.updateResources();

        Game.World.setCurrentMap("introduction");
        Game.World.moveTo(7, 5);
        Game.Command.setCommandHandler(Game.Command.worldCommandHandler);

        Game.Display.Logs.add({
            text: `
            The chilling air freezes deep within your heart, the fading sunlight casts a long shadow over the door ahead of you from gaps in rusting iron bars.<br/>
            You have no idea how you got here, your memory seems to have been wiped.<br/>
            All that you can remember is an inexplicable longing to find <em>something</em>, no matter how perilous the path, but you cannot remember exactly what nor why.<br/>
            You reach for your pockets, and a battered guidebook materialises. Perhaps using the command [help] can guide your journey.<br/>
            `
        });
    }

    gameOver() {
        Game.Renderer.gameOver();
        setTimeout(() => document.getElementById("gameOver").classList.remove("hidden"), 1000);
    }

    exitIntroduction() {
        Game.Events.introductionEvent();
    }

    exitCorridor() {
        if (Game.World.Maps.corridor.unlockedDoors[40][10]) {
            Game.World.setCurrentMap("library");
            Game.World.moveTo(11, 48, true);
            Game.Display.Logs.add({
                text: "Rows upon rows of bookshelves appear, covered with dust and cobwebs after years of abandonment."
            });
        } else Game.Events.corridorExitEvent();
    }

    exitLibrary() {
        if (Game.World.Maps.library.unlockedDoors[44][16]) {
            Game.World.setCurrentMap("computerRoom");
            Game.World.moveTo(7, 7, true);
            Game.Display.Logs.add({
                text: "Piles of abandoned computer equipment, once blinking lights extinguished, once whirring disks silent."
            });
        } else Game.Events.libraryExitEvent();
    }

    exitComputerRoom() {
        if (Game.World.Maps.computerRoom.unlockedDoors[13][1]) {
            Game.World.setCurrentMap("oldStreet");
            Game.World.moveTo(2, 7, true);
            Game.Display.Logs.add({
                text: "An abandoned street, a lone person standing underneath a rusting streetlight as the wind batters the floor."
            });
        } else Game.Events.computerRoomExitEvent();
    }

    exitOldStreet() {
        if (Game.World.Maps.oldStreet.unlockedDoors[32][2]) {
            Game.World.setCurrentMap("pathToCity");
            Game.World.moveTo(6, 33, true);
            Game.Display.Logs.add({
                text: "A long and dusty path, tread by only a daring few, the artificial night hiding dangers in the sea of dying grass."
            });
        } else {
            if (!Game.World.Maps.oldStreet.usedSpecialTiles[9][1]) {
                Game.Display.Logs.add({
                    text: "You look at the person standing beneath the streetlamp. Perhaps she knows some useful information."
                });
            } else {
                Game.World.setCurrentMap("pathToCity");
                Game.World.moveTo(6, 33, true);
                Game.Display.Logs.add({
                    text: "A long and dusty path, tread by only a daring few, the artificial night hiding dangers in the sea of dying grass. A silhouette of a great city faintly appears on the distant horizon."
                });

                Game.World.Maps.oldStreet.unlockedDoors[32][2] = true;
            }
        };
    }

    exitPathToCity() {
        if (Game.World.Maps.pathToCity.unlockedDoors[6][1]) {
            Game.World.setCurrentMap("entranceToCity");
            Game.World.moveTo(11, 7, true);
            Game.Display.Logs.add({
                text: "The entrance of the city of dreams stands right ahead, guardian to the isolated world inside."
            });
        } else Game.Events.pathToCityExitEvent();
    }

    exitEntranceToCity() {
        Game.Events.entranceToCityExitEvent();
    }

    exitCityCenter() {
        Game.Events.cityCenterExitEvent();
    }

    exitLeaveCityPath() {
        if (Game.World.Maps.leaveCityPath.unlockedDoors[4][1]) {
            Game.World.setCurrentMap("entranceToCity");
            Game.World.moveTo(11, 7, true);
            Game.Display.Logs.add({
                text: "The entrance of the city of dreams stands right ahead, guardian to the isolated world inside."
            });
        } else Game.Events.leaveCityPathExitEvent();
    }

    exitEntranceToShadeHeadquarters() {
        Game.Events.entranceToShadeHeadquartersExitEvent();
    }

    exitShadeHeadquarters() {
        Game.World.setCurrentMap("pathfinder");
        Game.World.moveTo(19, 7, true);

        if (Game.World.Maps.shadeHeadquarters.unlockedDoors[1][4]) {
            Game.Display.Logs.add({
                text: "The Pathfinder gleams a beautiful silver, a glass cylinder the size of a person with knobs and levers scattered around."
            });
        } else {
            Game.Display.Logs.add({
                text: "The torrents upon torrents of Shade bots now lie broken on the cold stone floor. The Pathfinder gleams a beautiful silver, a glass cylinder the size of a person with knobs and levers scattered around. This is the key to finding Virbox."
            });
            Game.World.Maps.shadeHeadquarters.unlockedDoors[1][4] = true;
        }
    }

    pathfinder() {
        if (Game.Resources.ResourceData.find(r => r.id === "crystal").amount) {
            Game.Events.pathfinderLeaveEvent();
        } else if (Game.Resources.ResourceData.find(r => r.id === "jsengine").amount) {
            Game.Events.pathfinderRepairEvent();
        } else if (Game.Resources.ResourceData.find(r => r.id === "jsfragment").amount === 5) {
            Game.Display.Logs.add({
                text: "The Pathfinder is broken beyond all known repair. Perhaps [craft] a JS engine."
            });
        } else Game.Events.pathfinderFindEvent();
    }

    endgame() {
        Game.Events.fightMacro();
    }
}
