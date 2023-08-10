export class Command {

    currentCommandHandler = new Function();

    ParserCombinator = {
        // Most of the parser combinator code borrowed from Varun Ramesh's guide
        success: function (index) {
            return {
                success: true,
                nextIndex: index
            }
        },
        failure() {
            return {
                success: false
            }
        },
        word: function (word) {
            return function (tokens, i) {
                if (i >= tokens.length) return Game.Command.ParserCombinator.failure();
                else if (tokens[i] == word) return Game.Command.ParserCombinator.success(i + 1);
                else return Game.Command.ParserCombinator.failure();
            }
        },
        not: function (word) {
            return function (tokens, i) {
                if (i >= tokens.length) return Game.Command.ParserCombinator.failure();
                else if (tokens[i] != word) return Game.Command.ParserCombinator.success(i + 1);
                else return Game.Command.ParserCombinator.failure();
            }
        },
        sequence: function (...parsers) {
            return function (tokens, i) {
                for (const parser of parsers) {
                    const result = parser(tokens, i);
                    if (!result.success) return Game.Command.ParserCombinator.failure();
                    i = result.nextIndex;
                }
                return Game.Command.ParserCombinator.success(i);
            }
        },
        anyOf: function (...parsers) {
            return function (tokens, i) {
                for (const parser of parsers) {
                    const result = parser(tokens, i);
                    if (result.success) return result;
                }
                return Game.Command.ParserCombinator.failure();
            }
        },
        optional: function (parser) {
            return function (tokens, i) {
                const result = parser(tokens, i);
                if (result.success) return result;
                return Game.Command.ParserCombinator.success(i);
            };
        },
        endOfStream(tokens, i) {
            return (i == tokens.length) ? Game.Command.ParserCombinator.success(i) : Game.Command.ParserCombinator.failure();
        },
        notEndOfStream(tokens, i) {
            return (i != tokens.length) ? Game.Command.ParserCombinator.success(i) : Game.Command.ParserCombinator.failure();
        },
        editDistance: function (source, target) {
            const distance = new Array(source.length + 1)
                .fill(0).map(() => new Array(target.length + 1).fill(0));
            for (let i = 0; i <= source.length; ++i) distance[i][0] = i;
            for (let j = 0; j <= target.length; ++j) distance[0][j] = j;
            for (let i = 1; i <= source.length; ++i) {
                for (let j = 1; j <= target.length; ++j) {
                    const match = (source[i - 1] === target[j - 1]);
                    distance[i][j] = Math.min(
                        match ? distance[i - 1][j - 1] : Infinity,
                        1 + distance[i - 1][j - 1],
                        1 + distance[i][j - 1],
                        1 + distance[i - 1][j])
                }
            }
            return distance[source.length][target.length];
        },
        fuzzyMatch: function (w, dist = 2) {
            return function (stream, i) {
                if (i >= stream.length) return Game.Command.ParserCombinator.failure();
                else if (Game.Command.ParserCombinator.editDistance(stream[i], w) <= dist)
                    return Game.Command.ParserCombinator.success(i + 1);
                else return Game.Command.ParserCombinator.failure();
            };
        },
        ifSuccess: function (parser, callback) {
            return function (tokens, i) {
                const result = parser(tokens, i);
                if (result.success) callback();
                return result;
            }
        }
    }

    helpCommands = {
        "help": {
            name: "help",
            description: "Gets information on commands.",
            usage: "help [command]",
            aliases: [],
            usable: true,
            unlocked: true
        },
        "item": {
            name: "item",
            description: "Gets information on items.",
            usage: "item [command]",
            aliases: [],
            usable: true,
            unlocked: true
        },
        "up": {
            name: "up",
            description: "Move your character up one tile.",
            usage: "up",
            aliases: ["(go, move) up", "w"],
            usable: true,
            unlocked: true
        },
        "down": {
            name: "down",
            description: "Move your character down one tile.",
            usage: "down",
            aliases: ["(go, move) down", "s"],
            usable: true,
            unlocked: true
        },
        "left": {
            name: "left",
            description: "Move your character left one tile.",
            usage: "left",
            aliases: ["(go, move) left", "a"],
            usable: true,
            unlocked: true
        },
        "right": {
            name: "right",
            description: "Move your character right one tile.",
            usage: "right",
            aliases: ["(go, move) right", "d"],
            usable: true,
            unlocked: true
        },
        "world": {
            name: "world",
            description: "Information on the current map.",
            usage: "world",
            aliases: ["map"],
            usable: true,
            unlocked: true
        },
        "drop": {
            name: "drop",
            description: "Put down an item.",
            usage: "drop &lt;item&gt;",
            aliases: ["put down"],
            usable: true,
            unlocked: true
        },
        "craft": {
            name: "craft",
            description: "Craft an item with resources.",
            usage: "craft, build, create [item, \"list\"]",
            aliases: ["make", "build", "create"],
            usable: false,
            unlocked: false
        }
    };

    commandFound = false;

    standardCommandHandler(command) {
        console.log("Standard command handler");

        const $p = Game.Command.ParserCombinator;

        $p.ifSuccess(
            $p.sequence(
                $p.word("help"),
                $p.notEndOfStream
            ),
            () => {
                this.commandFound = true;
                console.log(command);
                const commandName = command.join(' ').replace(/^help +/, "").trim();
                let commandEntry = this.helpCommands[commandName];
                if (!commandEntry) {
                    for (let c of Object.keys(this.helpCommands)) {
                        if (this.helpCommands[c].aliases.includes(commandName)) {
                            commandEntry = this.helpCommands[c];
                            break;
                        }
                    }
                }
                if (!commandEntry) {
                    let eventAction = Game.Events.CurrentEvent.scenes[Game.Events.CurrentEvent.currentScene].actions.find(c => c.commandParser(command, 1).success);
                    if (eventAction && Game.Events.eventActive) {
                        if (eventAction.help) {
                            Game.Display.Logs.add({
                                text: `
                                Help for event command ${eventAction.help.name} ${commandName !== eventAction.help.name ? "(alias of " + commandName + ")" : ""}<br/>
                                Usage: ${eventAction.help.usage.replaceAll(">", "&gt;").replaceAll("<", "&lt;")}<br/>
                                ${eventAction.help.aliases.length ?
                                        ("Aliases: " + eventAction.help.aliases.join(", ") + "<br/>")
                                        : ""
                                    }
                                Description: ${eventAction.help.description}<br/>
                            `
                            });
                        } else {
                            Game.Display.Logs.add({
                                text: "As comprehensive as the guidebook can possibly be, it cannot document all possible events."
                            });
                        }
                    } else Game.Display.Logs.add({
                        text: "Flipping through the pages of the guidebook, you find there is no such command as " + commandName + "."
                    });
                } else if (commandEntry.unlocked) {
                    Game.Display.Logs.add({
                        text: `
                    Help for command ${commandEntry.name} ${commandName !== commandEntry.name ? "(alias of " + commandName + ")" : ""}<br/>
                    ${commandEntry.usable ? "" : "This command cannot be used right now.<br/>"}
                    Usage: ${commandEntry.usage}<br/>
                    ${commandEntry.aliases.length ?
                                ("Aliases: " + commandEntry.aliases.join(", ") + "<br/>")
                                : ""
                            }
                    Description: ${commandEntry.description} <br/>
                    `
                    });
                } else {
                    Game.Display.Logs.add({
                        text: "Although you find the entry for the command " + commandName + ", you cannot understand a word of it. Perhaps come back later."
                    });
                }
            }
        )(command, 0);

        $p.ifSuccess(
            $p.sequence(
                $p.word("help"),
                $p.endOfStream
            ),
            () => {
                this.commandFound = true;
                let eventCommands = [];
                for (let a of Game.Events.CurrentEvent.scenes[Game.Events.CurrentEvent.currentScene].actions) {
                    eventCommands.push(a.name);
                }

                Game.Display.Logs.add({
                    text: `
                A battered guidebook<br/>
                Use [help &lt;command&gt;] to learn about specific commands.<br/>
                Commands:<br/>
                ${Object.keys(this.helpCommands).filter(k => this.helpCommands[k].unlocked).join(", ")}<br/>
                    ${Game.Events.eventActive ?
                            "Event Commands:<br/>" +
                            eventCommands.join(", ") +
                            "<br/>"
                            : ""
                        }
                        `
                });
            }
        )(command, 0);
        // sudo
        // Easter egg
        $p.ifSuccess(
            $p.word("sudo"),
            () => {
                this.commandFound = true;
                Game.Display.Logs.add({
                    text: "You do not have root privileges in this world."
                });
            }
        )(command, 0);

        $p.ifSuccess(
            $p.word("system"),
            () => {
                this.commandFound = true;
                Game.Display.Logs.add({
                    text: `
                    Simulation: Virbox Adventure<br/>
                    OS: VirbOS<br/>
                    All systems operational. Simulation is running smoothly.<br/>
                    `
                });
            }
        )(command, 0);

        $p.ifSuccess(
            $p.anyOf(
                $p.word("vi"),
                $p.word("vim")
            ),
            () => {
                this.commandFound = true;
                Game.Display.Logs.add({
                    text: "The second best text editor after Emacs."
                });
            }
        )(command, 0);

        $p.ifSuccess(
            $p.word("emacs"),
            () => {
                this.commandFound = true;
                Game.Display.Logs.add({
                    text: "The second best text editor after Vi."
                });
            }
        )(command, 0);

        $p.ifSuccess(
            $p.word("cd"),
            () => {
                this.commandFound = true;
                Game.Display.Logs.add({
                    text: "There is no escape. You cannot flee from the reality of this world."
                });
            }
        )(command, 0);
    }

    worldCommandHandler(command) {
        console.log("World command handler");

        const $p = Game.Command.ParserCombinator;

        // w, (go, move) up
        $p.ifSuccess(
            $p.anyOf(
                $p.word("w"),
                $p.sequence(
                    $p.optional(
                        $p.anyOf(
                            $p.word("go"),
                            $p.word("move")
                        )
                    ),
                    $p.word("up")
                )
            ),
            () => {
                this.commandFound = true;
                if (Game.Events.eventActive) {
                    Game.Display.Logs.add({
                        text: "You are too focused on the current event to move."
                    });
                    return;
                };
                console.log("Player move up");
                if (!Game.World.collisionDetect(Game.World.Player.Position.x, Game.World.Player.Position.y - 1)) Game.World.moveUp();
                Game.World.render();
            }
        )(command, 0);

        // a, (go, move) left
        $p.ifSuccess(
            $p.anyOf(
                $p.word("a"),
                $p.sequence(
                    $p.optional(
                        $p.anyOf(
                            $p.word("go"),
                            $p.word("move")
                        )
                    ),
                    $p.word("left")
                )
            ),
            () => {
                this.commandFound = true;
                if (Game.Events.eventActive) {
                    Game.Display.Logs.add({
                        text: "You are too focused on the current event to move."
                    });
                    return;
                };
                console.log("Player move left");
                if (!Game.World.collisionDetect(Game.World.Player.Position.x - 1, Game.World.Player.Position.y)) Game.World.moveLeft();
                Game.World.render();
            }
        )(command, 0);

        // s, (go, move) down
        $p.ifSuccess(
            $p.anyOf(
                $p.word("s"),
                $p.sequence(
                    $p.optional(
                        $p.anyOf(
                            $p.word("go"),
                            $p.word("move")
                        )
                    ),
                    $p.word("down")
                )
            ),
            () => {
                this.commandFound = true;
                if (Game.Events.eventActive) {
                    Game.Display.Logs.add({
                        text: "You are too focused on the current event to move."
                    });
                    return;
                };
                console.log("Player move down");
                if (!Game.World.collisionDetect(Game.World.Player.Position.x, Game.World.Player.Position.y + 1)) Game.World.moveDown();
                Game.World.render();
            }
        )(command, 0);

        // d, (go, move) down
        $p.ifSuccess(
            $p.anyOf(
                $p.word("d"),
                $p.sequence(
                    $p.optional(
                        $p.anyOf(
                            $p.word("go"),
                            $p.word("move")
                        )
                    ),
                    $p.word("right")
                )
            ),
            () => {
                this.commandFound = true;
                if (Game.Events.eventActive) {
                    Game.Display.Logs.add({
                        text: "You are too focused on the current event to move."
                    });
                    return;
                };
                console.log("Player move right");
                if (!Game.World.collisionDetect(Game.World.Player.Position.x + 1, Game.World.Player.Position.y)) Game.World.moveRight();
                Game.World.render();
            }
        )(command, 0);

        // world, map
        $p.ifSuccess(
            $p.anyOf(
                $p.word("world"),
                $p.word("map")
            ),
            () => {
                this.commandFound = true;
                let usedTiles = [];
                for (let y in Game.World.Map.map) {
                    for (let x in Game.World.Map.map[y]) {
                        if (Game.World.Map.uncovered[y][x] && !usedTiles.includes(Game.World.Map.map[y][x])) usedTiles.push(Game.World.Map.map[y][x]);
                    }
                }
                Game.Display.Logs.add({
                    text: `
					World map: ${Game.World.Maps[Game.World.Map.name].name}<br/>
					Tiles:<br/>
					${usedTiles.includes(Game.World.Tiles.WALL) ?
                            "#: Wall<br/>"
                            : ""
                        }
					${usedTiles.includes(Game.World.Tiles.PATH) ?
                            "%: Path<br/>"
                            : ""
                        }
					${usedTiles.includes(Game.World.Tiles.STONE_FLOOR) ?
                            ".: Stone floor<br/>"
                            : ""
                        }
                    ${usedTiles.includes(Game.World.Tiles.WOODEN_PLANK) ?
                            "|: Wooden plank<br/>"
                            : ""
                        }
					${usedTiles.includes(Game.World.Tiles.DOOR) ?
                            "D: Doorway<br/>"
                            : ""
                        }
					${usedTiles.includes(Game.World.Tiles.SPAWN) ?
                            "S: Spawn point<br/>"
                            : ""
                        }
					${usedTiles.includes(Game.World.Tiles.ITEM) ?
                            "I: Item<br/>"
                            : ""
                        }
					`
                });
            }
        )(command, 0);
        this.standardCommandHandler(command);
        this.craftingCommandHandler(command);
    }

    eventCommandHandler(command) {
        const $p = Game.Command.ParserCombinator;

        for (let action of Game.Events.CurrentEvent.scenes[Game.Events.CurrentEvent.currentScene].actions) {
            $p.ifSuccess(
                action.commandParser,
                () => {
                    this.commandFound = true;
                    action.effect(command);
                    if (action.nextScene === "end") {
                        if (!action.chainEvent) Game.Events.eventActive = false;
                    } else {
                        Game.Events.CurrentEvent.currentScene = action.nextScene;
                    }
                    Game.Renderer.updateModal();
                }
            )(command, 0);
        }
    }

    craftingCommandHandler(command) {
        console.log("Crafting command handler");

        const $p = Game.Command.ParserCombinator;

        // craft
        $p.ifSuccess(
            $p.sequence(
                $p.anyOf(
                    $p.word("craft"),
                    $p.word("make"),
                    $p.word("build"),
                    $p.word("create")
                ),
                $p.word("list")
            ),
            () => {
                this.commandFound = true;

                if (Game.Resources.ResourceData.find(r => r.id === "workbench").amount === 0) {
                    Game.Display.Logs.add({
                        text: "You cannot make anything without tools."
                    });
                    return;
                }

                let craftableString = "";
                for (let i in Game.Resources.Crafting) {
                    let craft = Game.Resources.Crafting[i];
                    if (!craft.unlocked) continue;

                    let craftedResource = Game.Resources.ResourceData.find(r => r.id === craft.id);

                    let requiredResources = [];

                    for (let i in craft.resources) {
                        requiredResources.push(craft.resources[i].amount + " " + Game.Resources.getResourceNameFromId(craft.resources[i].id));
                    }

                    craftableString += `
                        ${craftedResource.name}: ${requiredResources.join(", ")}<br/>
                        `;
                }
                Game.Display.Logs.add({
                    text: `
                        Craftable items:<br/>
                        ${craftableString}
                        `
                });
            }
        )(command, 0);
        $p.ifSuccess(
            $p.sequence(
                $p.anyOf(
                    $p.word("craft"),
                    $p.word("make"),
                    $p.word("build"),
                    $p.word("create")
                ),
                $p.not("list")
            ),
            () => {
                this.commandFound = true;

                if (Game.Resources.ResourceData.find(r => r.id === "workbench").amount === 0) {
                    Game.Display.Logs.add({
                        text: "You cannot make anything without tools."
                    });
                    return;
                }

                if (Game.Events.eventActive) {
                    Game.Display.Logs.add({
                        text: "You are too focused on the current event to craft anything."
                    });
                    return;
                }

                const craftedItem = command.join(' ').replace(/^(craft|make|build|create) */, "");
                console.log("Craft " + craftedItem);

                let itemId;
                for (let i in Game.Resources.ResourceData) {
                    if (Game.Resources.ResourceData[i].name === craftedItem || Game.Resources.ResourceData[i].id === craftedItem) {
                        itemId = Game.Resources.ResourceData[i].id;
                        break;
                    }
                }

                const craft = Game.Resources.Crafting.find(c => c.id === itemId);

                if (craft === undefined) {
                    Game.Display.Logs.add({
                        text: "There is no such thing as " + craftedItem + ". Use the [craft list] command to see what you can make."
                    });
                    return;
                }

                if (!craft.unlocked) {
                    Game.Display.Logs.add({
                        text: "A strange feeling washes over you, as if there was more to be explored, but you do not know how to craft " + craftedItem + "."
                    });
                    return;
                }

                let craftable = true;
                let missingResources = [];
                let spaceFreed = 0;
                for (let i in craft.resources) {
                    spaceFreed += Game.Resources.ResourceData.find(r => r.id === craft.resources[i].id).space * craft.resources[i].amount;
                    if (Game.Resources.ResourceData.find(r => r.id === craft.resources[i].id).amount < craft.resources[i].amount) {
                        craftable = false;
                        missingResources.push(craft.resources[i].amount - Game.Resources.ResourceData.find(r => r.id === craft.resources[i].id).amount + " " + Game.Resources.getResourceNameFromId(craft.resources[i].id));
                    }
                }
                if (!craftable) {
                    Game.Display.Logs.add({
                        text: `You do not have enough resources to craft ${Game.Resources.getResourceNameFromId(craft.id)}. You are missing ${missingResources.join(", ")}.`
                    });
                    return;
                }

                if (Game.Resources.computeFreeSpace() + spaceFreed < Game.Resources.ResourceData.find(r => r.id === craft.id).space) {
                    Game.Display.Logs.add({
                        text: "You do not have enough space to craft " + Game.Resources.getResourceNameFromId(craft.id) + ". Free some space with the [drop] command."
                    });
                    return;
                }

                for (let i in craft.resources) {
                    Game.Resources.ResourceData.find(r => r.id === craft.resources[i].id).amount -= craft.resources[i].amount;
                }

                Game.Resources.ResourceData.find(r => r.id === craft.id).amount++;

                Game.Resources.ResourceData.find(r => r.id === craft.id).unlocked = true;

                if (craft.onCraft) craft.onCraft();

                Game.Renderer.updateResources();
            }
        )(command, 0);
        $p.ifSuccess(
            $p.sequence(
                $p.anyOf(
                    $p.word("craft"),
                    $p.word("make"),
                    $p.word("build"),
                    $p.word("create")
                ),
                $p.endOfStream
            ),
            () => {
                this.commandFound = true;

                if (Game.Resources.ResourceData.find(r => r.id === "workbench").amount === 0) {
                    Game.Display.Logs.add({
                        text: "You cannot make anything without tools."
                    });
                    return;
                }

                Game.Display.Logs.add({
                    text: `
                    A workbench<br/>
                    Use [craft list] to see craftable items, and [craft &lt;item&gt;] to craft a specific item.
                    `
                });
            }
        )(command, 0);

        // drop
        $p.ifSuccess(
            Game.Command.ParserCombinator.anyOf(
                Game.Command.ParserCombinator.word("drop"),
                Game.Command.ParserCombinator.sequence(
                    Game.Command.ParserCombinator.word("put"),
                    Game.Command.ParserCombinator.word("down"),
                ),
            ),
            () => {
                if (this.commandFound) return;

                this.commandFound = true;

                const item = command.join(' ').replace(/(drop|(put down)) +/, "");
                let itemId;
                for (let i in Game.Resources.ResourceData) {
                    if (Game.Resources.ResourceData[i].name === item || Game.Resources.ResourceData[i].id === item) {
                        itemId = Game.Resources.ResourceData[i].id;
                        break;
                    }
                }
                const itemResource = Game.Resources.ResourceData.find(r => r.id === itemId);

                if (itemResource === undefined) {
                    Game.Display.Logs.add({
                        text: "You cannot find the item you are trying to put down."
                    });
                    return;
                }
                if (!itemResource.unlocked) {
                    Game.Display.Logs.add({
                        text: "A strange feeling washes over you, as if there was something more to be explored, but you cannot find the item you are trying to put down."
                    });
                    return;
                }
                if (itemResource.space === 0) {
                    Game.Display.Logs.add({
                        text: "You feel there is no point in throwing away something that consumes no space in the first place."
                    });
                    return;
                }
                if (itemResource.amount === 0) {
                    Game.Display.Logs.add({
                        text: "You have nothing to put down."
                    });
                    return;
                }

                itemResource.amount--;

                Game.Display.Logs.add({
                    text: "You put " + item + " down."
                });

                Game.Renderer.updateResources();
            }
        )(command, 0);

        // item
        $p.ifSuccess(
            $p.sequence(
                $p.word("item"),
                $p.notEndOfStream
            ),
            () => {
                this.commandFound = true;

                const item = command.join(' ').replace(/item +/, "");
                let itemId;
                for (let i in Game.Resources.ResourceData) {
                    if (Game.Resources.ResourceData[i].name === item || Game.Resources.ResourceData[i].id === item) {
                        itemId = Game.Resources.ResourceData[i].id;
                        break;
                    }
                }
                const itemResource = Game.Resources.ResourceData.find(r => r.id === itemId);

                if (itemResource === undefined) {
                    Game.Display.Logs.add({
                        text: "There is no such item as " + item + " in the pages of your guidebook."
                    });
                    return;
                }
                if (!itemResource.unlocked) {
                    Game.Display.Logs.add({
                        text: "A strange feeling washes over you, as if there was something more to be explored, but you cannot find the item in the guidebook."
                    });
                    return;
                }
                Game.Display.Logs.add({
                    text: `
                    Item ${itemResource.name}<br/>
                    Description: ${itemResource.description}<br/>
                    Amount: ${itemResource.amount}<br/>
                    Space: ${itemResource.space} ${itemResource.space ? "(total " + itemResource.space * itemResource.amount + ")" : ""}<br/>
                    `
                });
            }
        )(command, 0);

        $p.ifSuccess(
            $p.sequence(
                $p.word("item"),
                $p.endOfStream
            ),
            () => {
                this.commandFound = true;

                Game.Display.Logs.add({
                    text: "Consult your battered guidebook for information on items.<br/> Use [item &lt;item&gt;] to get information on a specific item."
                });
            }
        )(command, 0);
    }

    setCommandHandler(handler) {
        this.currentCommandHandler = handler;
    }

    refreshUsableCommands() {
        if (Game.Events.eventActive) {
            this.helpCommands.up.usable = false;
            this.helpCommands.down.usable = false;
            this.helpCommands.left.usable = false;
            this.helpCommands.right.usable = false;
            this.helpCommands.craft.usable = false;
        } else {
            this.helpCommands.up.usable = true;
            this.helpCommands.down.usable = true;
            this.helpCommands.left.usable = true;
            this.helpCommands.right.usable = true;
            this.helpCommands.craft.usable = true;
        }
    }

    evaluateCommand(command) {
        this.commandFound = false;
        this.refreshUsableCommands();
        if (Game.Events.eventActive) this.eventCommandHandler(command.trim().split(' '));
        this.currentCommandHandler(command.trim().split(' '));
        console.log("Evaluate command \"" + command + "\" with " + this.currentCommandHandler.name);

        if (!this.commandFound) {
            Game.Display.Logs.add({
                text: "Your command echoes in the empty winds, incomprehensible. Perhaps use the [help] command."
            });
        }
    }

    listenForCommands() {
        const commandInput = document.getElementById("command");
        commandInput.addEventListener("keypress", (key) => {
            if (key.code !== "Enter" || !commandInput.value) return;
            Game.Command.evaluateCommand(commandInput.value);
            commandInput.value = "";
        });
    }
}
