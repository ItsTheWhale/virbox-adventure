export class Events {
    eventActive = false;

    CurrentEvent = {
        title: "",
        currentScene: "main",
        scenes: {
            main: {
                text: "",
                actions: []
                /*
                {
                    name: "",
                    text: "",
                    commandParser: {},
                    nextScene: "",
                    effect: function()
                }
                */
            }
        }
    };

    createEvent(options) {
        this.CurrentEvent = options;
        this.eventActive = true;
        Game.Renderer.updateModal();
    }

    Weapons = {
        punch: {
            name: "punch",
            damage: 1,
            cooldown: 0,
            cooldownRemaining: 0,
            cost: [],
            commandParser: Game.Command.ParserCombinator.word("punch"),
            effect: function () { },
            logMessage: function (damage, enemyName) {
                return "> You punched " + enemyName + " for " + damage + " damage";
            },
            help: {
                name: "punch",
                description: "Punch an enemy.<br/>Damage: 1<br/>Cooldown: 0",
                usage: "punch",
                aliases: []
            },
        },
        stab: {
            name: "stab",
            damage: 2,
            cooldown: 1,
            cooldownRemaining: 0,
            cost: [],
            commandParser: Game.Command.ParserCombinator.word("stab"),
            effect: function () { },
            logMessage: function (damage, enemyName) {
                return "> You stabbed " + enemyName + " for " + damage + " damage";
            },
            help: {
                name: "stab",
                description: "Stab an enemy.<br/>Damage: 2<br/>Cooldown: 1<br/>Requires: spear",
                usage: "stab",
                aliases: []
            },
        },
        slice: {
            name: "slice",
            damage: 3,
            cooldown: 2,
            cooldownRemaining: 0,
            cost: [],
            commandParser: Game.Command.ParserCombinator.word("slice"),
            effect: function () { },
            logMessage: function (damage, enemyName) {
                return "> You sliced " + enemyName + " for " + damage + " damage";
            },
            help: {
                name: "slice",
                description: "Slice an enemy.<br/>Damage: 3<br/>Cooldown: 2<br/>Requires: iron sword",
                usage: "slice",
                aliases: []
            },
        },
        slash: {
            name: "slash",
            damage: 5,
            cooldown: 3,
            cooldownRemaining: 0,
            cost: [],
            commandParser: Game.Command.ParserCombinator.word("slash"),
            effect: function () { },
            logMessage: function (damage, enemyName) {
                return "> You slashed " + enemyName + " for " + damage + " damage";
            },
            help: {
                name: "slash",
                description: "Slash an enemy.<br/>Damage: 5<br/>Cooldown: 3<br/>Requires: alloy sword",
                usage: "slash",
                aliases: []
            },
        },
        erase: {
            name: "erase",
            damage: 10,
            cooldown: 5,
            cooldownRemaining: 0,
            cost: [],
            commandParser: Game.Command.ParserCombinator.word("erase"),
            effect: function () { },
            logMessage: function (damage, enemyName) {
                return "> You deducted " + damage + " health from " + enemyName;
            },
            help: {
                name: "erase",
                description: "Erase an enemy.<br/>Damage: 10<br/>Cooldown: 5<br/>Requires: js engine",
                usage: "erase",
                aliases: []
            },
        },
        eatFood: {
            name: "eat food",
            damage: 0,
            cooldown: 3,
            cooldownRemaining: 0,
            cost: [{
                id: "food",
                amount: 1
            }],
            commandParser: Game.Command.ParserCombinator.sequence(
                Game.Command.ParserCombinator.word("eat"),
                Game.Command.ParserCombinator.word("food")
            ),
            effect: function () {
                Game.World.Player.health = Math.min(Game.World.Player.health + 8, Game.World.computeMaxHealth());
            },
            logMessage: function (damage, enemyName) {
                return "> You ate food and restored 8 health.";
            },
            help: {
                name: "eat food",
                description: "Eat food to restore health.<br/>Health: 8<br/>Cooldown: 3",
                usage: "eat food",
                aliases: []
            }
        }
    };

    createCombatEvent(options) {
        /*
                Game.Events.createCombatEvent({
    enemyName: "Macro",
    enemyHealth: 10,
    enemyAttacks: {
        punch: {
            name: "punch",
      damage: 1,
      cooldown: 0,
      cooldownRemaining: 0,
      logMessage: function(damage, enemyName) {
                return "> " + enemyName + " punched you for " + damage + " damage";
            },
            probability: 0.7
        },
        slash: {
            name: "slash",
      damage: 2,
      cooldown: 1,
      cooldownRemaining: 0,
      logMessage: function(damage, enemyName) {
                return "> " + enemyName + " slashed you for " + damage + " damage";
            },
            probability: 0.3
        },
    },
        onVictory: function() { console.log("Victory") },
        onEnd: function() { console.log("End") },
});
*/
        /*
        {
            enemyName: "",
            enemyHealth: 0,
            enemyAttacks: {
                attack: {
                    name: "",
                    damage: 0,
                    cooldown: 0,
                    cooldownRemaining: 0,
                    logMessage: function(damage),
                    // probability must add up to 1
                    probability: 0
                }
            },
            chainEvent: false.
            onVictory: function() {

            },
            onEnd: function() { }
        }
        */

        for (let w of Object.keys(this.Weapons)) {
            this.Weapons[w].cooldownRemaining = 0;
        }

        const enemyMaxHealth = options.enemyHealth;
        let enemyHealth = options.enemyHealth;

        const playerMaxHealth = Game.World.computeMaxHealth();

        let combatLogs = [];

        let availableAttacks = [];

        availableAttacks.push("punch");
        if (Game.Resources.ResourceData.find(r => r.id === "spear").amount) availableAttacks.push("stab");
        if (Game.Resources.ResourceData.find(r => r.id === "ironsword").amount) availableAttacks.push("slice");
        if (Game.Resources.ResourceData.find(r => r.id === "alloysword").amount) availableAttacks.push("slash");
        if (Game.Resources.ResourceData.find(r => r.id === "jsengine").amount) availableAttacks.push("erase");
        availableAttacks.push("eatFood");
        let attacks = [];

        let battleEnded = false;

        function refreshCombatEvent() {
            Game.Events.CurrentEvent.scenes.main.text = `
            <div class="flex [&>p]:text-center">
                <p>
                    @<br/>
                    ${Game.World.Player.health}/${playerMaxHealth} HP
                </p>
                <p class="ml-auto">
                    E<br/>
                    ${enemyHealth}/${enemyMaxHealth} HP
                </p>
            </div>
            <br/>
            ${combatLogs.reverse().slice(0, 5).join("<br/>")}
            `;

            if (!battleEnded) {
                for (let attack of availableAttacks) {
                    const weapon = Game.Events.Weapons[attack];
                    let action = Game.Events.CurrentEvent.scenes.main.actions.find(a => a.attackName === attack);
                    action.text = "[" + weapon.name + "]" + (
                        weapon.cooldownRemaining ?
                            " (" + weapon.cooldownRemaining + " cd)"
                            : ""
                    );
                    if (weapon.cooldownRemaining) action.disabled = true;
                    else action.disabled = false;

                    if (weapon.cost.length && !weapon.cooldownRemaining) {
                        let resourceMissing = false;
                        for (let i in weapon.cost) {
                            if (Game.Resources.ResourceData.find(r => r.id === weapon.cost[i].id).amount < weapon.cost[i].amount) {
                                resourceMissing = true;
                                break;
                            }
                        }
                        if (resourceMissing) action.disabled = true;
                    }
                }
            } else {
                Game.Events.CurrentEvent.scenes.main.actions.push({
                    name: "end",
                    text: "[end]",
                    commandParser: Game.Command.ParserCombinator.word("end"),
                    nextScene: "end",
                    help: {
                        name: "end",
                        description: "End combat.",
                        usage: "end",
                        aliases: []
                    },
                    chainEvent: options.chainEvent ?? false,
                    effect: function () {
                        options.onEnd();

                        while (Game.World.Player.health < playerMaxHealth) {
                            if (Game.Resources.ResourceData.find(r => r.id === "food").amount === 0) break;

                            Game.World.Player.health = Math.min(Game.World.Player.health + 8, playerMaxHealth);
                            Game.Resources.ResourceData.find(r => r.id === "food").amount--;

                            Game.Renderer.updateResources();
                        }
                    }
                });
            }

            Game.Renderer.updateModal();
        }

        function enemyAttack() {
            let attackPool = [];
            let totalProbability = 0;
            for (let a of Object.keys(options.enemyAttacks)) {
                if (options.enemyAttacks[a].cooldownRemaining) continue;
                attackPool.push(a);
                totalProbability += options.enemyAttacks[a].probability;
            }

            let rand = Math.random() * totalProbability;

            let chosenAttack = attackPool[0];

            for (let a of attackPool) {
                if (rand > options.enemyAttacks[a].probability) {
                    rand -= options.enemyAttacks[a].probability;
                } else {
                    chosenAttack = a;
                    break;
                }
            }

            Game.World.Player.health -= options.enemyAttacks[chosenAttack].damage;
            combatLogs.push(options.enemyAttacks[chosenAttack].logMessage(options.enemyAttacks[chosenAttack].damage, options.enemyName));
            for (let weapon of Object.keys(options.enemyAttacks)) {
                if (options.enemyAttacks[weapon].cooldownRemaining) options.enemyAttacks[weapon].cooldownRemaining--;
            }
            options.enemyAttacks[chosenAttack].cooldownRemaining = options.enemyAttacks[chosenAttack].cooldown;
        }

        function updateWeaponCooldowns() {
            for (let weapon of Object.keys(Game.Events.Weapons)) {
                if (Game.Events.Weapons[weapon].cooldownRemaining) Game.Events.Weapons[weapon].cooldownRemaining--;
            }
        }

        function handleVictory() {
            if (enemyHealth <= 0) {
                battleEnded = true;
                Game.Events.CurrentEvent.scenes.main.actions = Game.Events.CurrentEvent.scenes.main.actions.filter(a => !a.attackName);
                combatLogs.push("> You have defeated " + options.enemyName);
                console.log("Battle won against " + options.enemyName);
                if (options.onVictory) options.onVictory();
            }
        }

        function handleDeath() {
            if (Game.World.Player.health <= 0) {
                battleEnded = true;
                Game.Events.eventActive = false;
                Game.Engine.gameOver();
                console.log("Battle lost against " + options.enemyName);
            }
        }

        for (let attack of availableAttacks) {
            const weapon = Game.Events.Weapons[attack];
            attacks.push({
                name: weapon.name,
                text: "[" + weapon.name + "]",
                attackName: attack, // to find the attack entry
                commandParser: weapon.commandParser,
                nextScene: "main",
                help: weapon.help,
                effect: function () {
                    if (weapon.cooldownRemaining || battleEnded) return;
                    let resourceMissing = false;
                    for (let i in weapon.cost) {
                        if (Game.Resources.ResourceData.find(r => r.id === weapon.cost[i].id).amount < weapon.cost[i].amount) {
                            resourceMissing = true;
                            break;
                        }
                    }
                    if (resourceMissing) return;
                    enemyHealth = Math.max(enemyHealth - weapon.damage, 0);
                    weapon.effect();
                    combatLogs.push(weapon.logMessage(weapon.damage, options.enemyName));
                    updateWeaponCooldowns();
                    weapon.cooldownRemaining = weapon.cooldown;
                    handleVictory();
                    if (!battleEnded) enemyAttack();
                    handleDeath();
                    refreshCombatEvent();
                }
            });
        }

        // if (Game.Resources.ResourceData) {

        // }

        this.createEvent({
            title: "Combat - " + options.enemyName,
            currentScene: "main",
            scenes: {
                main: {
                    text: "",
                    actions: [
                        ...attacks
                    ]
                }
            }
        });

        refreshCombatEvent();
    }

    createItemPickupEvent(options) {
        /*
        Game.Events.createItemPickupEvent({
            name: "example",
            description: "test",
            items: [
                {
                    id: "water",
                    amount: 10
                },
                {
                    id: "food",
                    amount: 10,
                }
            ],
            onEnd: function () { console.log('') }
        });
*/
        /*
        {
            name: "",
            description: "",
            items: [
                {
                    id: "",
                    amount: 0
                }
            ],
            chainEvent: false,
            onEnd: function() {}
        }
        */
        function refreshItems() {
            let itemTexts = "";

            for (let i in options.items) {
                const itemResource = Game.Resources.ResourceData.find(r => r.id === options.items[i].id);
                itemTexts += `
                ${Game.Resources.ResourceData.find(r => r.id === options.items[i].id).name}: ${options.items[i].amount} ${itemResource.space === 0 ? "(auto picked up)" : "(" + itemResource.space + " space)"}<br/>
                `;
            }

            Game.Events.CurrentEvent.scenes.main.text = `
            ${options.description}<br/><br/>
            ${itemTexts}
            `;

            Game.Renderer.updateModal();
            Game.Renderer.updateResources();
        }

        for (let i in options.items) {
            const itemResource = Game.Resources.ResourceData.find(r => r.id === options.items[i].id);
            if (itemResource.space > 0) continue;
            if (!itemResource.unlocked) itemResource.unlocked = true;
            itemResource.amount += options.items[i].amount;
        }

        this.createEvent({
            title: "Pick up items - " + options.name,
            currentScene: "main",
            scenes: {
                main: {
                    text: "",
                    actions: [
                        {
                            name: "take",
                            text: "[take <item>]",
                            commandParser: Game.Command.ParserCombinator.anyOf(
                                Game.Command.ParserCombinator.word("take"),
                                Game.Command.ParserCombinator.sequence(
                                    Game.Command.ParserCombinator.word("pick"),
                                    Game.Command.ParserCombinator.word("up"),
                                ),
                            ),
                            nextScene: "main",
                            help: {
                                name: "take",
                                description: "Take an item.",
                                usage: "take <item>",
                                aliases: ["pick up"]
                            },
                            effect: function (command) {
                                const item = command.join(' ').replace(/(take|(pick up)) +/, "");
                                let itemId;
                                for (let i in Game.Resources.ResourceData) {
                                    if (Game.Resources.ResourceData[i].name === item || Game.Resources.ResourceData[i].id === item) {
                                        itemId = Game.Resources.ResourceData[i].id;
                                        break;
                                    }
                                }
                                const itemResource = Game.Resources.ResourceData.find(r => r.id === itemId);
                                const pickUpItem = options.items.find(i => i.id === itemId);
                                if (pickUpItem === undefined) {
                                    Game.Display.Logs.add({
                                        text: "You cannot find the item you are trying to pick up."
                                    });
                                    return;
                                }
                                // Patch because auto pick up does not actually deduct the item
                                if (itemResource.space === 0) {
                                    Game.Display.Logs.add({
                                        text: "You have already automatically picked it up."
                                    });
                                    return;
                                }
                                if (pickUpItem.amount === 0) {
                                    Game.Display.Logs.add({
                                        text: "You try to pick up an item, but find that there is no more."
                                    });
                                    return;
                                }
                                if (window.Game.Resources.computeMaxSpace() - window.Game.Resources.computeUsedSpace() < itemResource.space) {
                                    Game.Display.Logs.add({
                                        text: "You try to stuff an item in your bag, but there is not enough space. Drop an item to free space."
                                    });
                                }
                                if (!itemResource.unlocked) itemResource.unlocked = true;
                                pickUpItem.amount--;
                                itemResource.amount++;
                                refreshItems();
                            }
                        },
                        {
                            name: "drop",
                            text: "[drop <item>]",
                            commandParser: Game.Command.ParserCombinator.anyOf(
                                Game.Command.ParserCombinator.word("drop"),
                                Game.Command.ParserCombinator.sequence(
                                    Game.Command.ParserCombinator.word("put"),
                                    Game.Command.ParserCombinator.word("down"),
                                ),
                            ),
                            nextScene: "main",
                            help: {
                                name: "drop",
                                description: "Put down an item.",
                                usage: "drop <item>",
                                aliases: ["put down"]
                            },
                            effect: function (command) {
                                const item = command.join(' ').replace(/(drop|(put down)) +/, "");
                                let itemId;
                                for (let i in Game.Resources.ResourceData) {
                                    if (Game.Resources.ResourceData[i].name === item || Game.Resources.ResourceData[i].id === item) {
                                        itemId = Game.Resources.ResourceData[i].id;
                                        break;
                                    }
                                }
                                const itemResource = Game.Resources.ResourceData.find(r => r.id === itemId);
                                const dropItem = options.items.find(i => i.id === itemId);
                                if (itemResource === undefined) {
                                    Game.Display.Logs.add({
                                        text: "You cannot find the item you are trying to put down."
                                    });
                                    return;
                                }
                                if (!itemResource.unlocked) {
                                    Game.Display.Logs.add({
                                        text: "A strange feeling washes over you, as if there was something more to be explored, but the you cannot find the item you are trying to put down."
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
                                if (dropItem === undefined) {
                                    options.items.push({
                                        id: itemId,
                                        amount: 1
                                    });
                                } else {
                                    dropItem.amount++;
                                }

                                itemResource.amount--;

                                refreshItems();
                            }
                        },
                        {
                            name: "end",
                            text: "[end]",
                            commandParser: Game.Command.ParserCombinator.word("end"),
                            nextScene: "end",
                            chainEvent: options.chainEvent,
                            help: {
                                name: "end",
                                description: "Leave when you are finished picking up items.",
                                usage: "end",
                                aliases: []
                            },
                            effect: function () {
                                if (options.onEnd) options.onEnd();
                            }
                        }
                    ]
                }
            }
        });

        refreshItems();
    }

    introductionEvent() {
        Game.Display.Logs.add({
            text: "You look longingly at the door, as if something was calling you from beyond."
        });

        this.createEvent({
            title: "A journey",
            currentScene: "main",
            scenes: {
                main: {
                    text: "A long and winding path awaits you. Are you ready to embark to the unknown world beyond?",
                    actions: [
                        {
                            name: "embark",
                            text: "[embark]",
                            commandParser: Game.Command.ParserCombinator.word("embark"),
                            nextScene: "end",
                            help: {
                                name: "embark",
                                description: "Begin your long journey in this world.",
                                usage: "embark",
                                aliases: []
                            },
                            effect: function () {
                                Game.Display.Logs.add({
                                    text: `
                                    You step outside the door, the cold winter winds sears your face from shattered windows as the creaking door slams shut behind you.<br/>
                                    A long corridor stretches ahead, fading into endless shadows.<br/>
                                    Got to somehow get out of this place first.
                                    `
                                });

                                Game.Resources.ResourceData.find(r => r.id === "food").amount = 5;
                                Game.Resources.ResourceData.find(r => r.id === "food").unlocked = true;
                                Game.Renderer.updateResources();

                                Game.World.setCurrentMap("corridor");
                                Game.World.moveTo(32, 31, true);
                            }
                        },
                        {
                            name: "wait",
                            text: "[wait]",
                            commandParser: Game.Command.ParserCombinator.word("wait"),
                            nextScene: "end",
                            help: {
                                name: "wait",
                                description: "Wait a little bit longer if you are not ready yet.",
                                usage: "wait",
                                aliases: []
                            },
                            effect: function () {
                                Game.Display.Logs.add({
                                    text: "Perhaps it would be safer to wait and prepare for the journey ahead."
                                });
                            }
                        }
                    ]
                }
            }
        });
    }

    corridorItemEvent() {
        this.createEvent({
            title: "A Paper Bundle",
            currentScene: "main",
            scenes: {
                main: {
                    text: "A small bundle of scrap paper wrapped over some metal object lies on the side of the corridor, undisturbed since the day it was lost.",
                    actions: [
                        {
                            name: "unwrap",
                            text: "[unwrap]",
                            commandParser: Game.Command.ParserCombinator.word("unwrap"),
                            nextScene: "unwrap",
                            help: {
                                name: "unwrap",
                                description: "Unwrap the small bundle of paper.",
                                usage: "unwrap",
                                aliases: []
                            },
                            effect: function () { }
                        }
                    ]
                },
                unwrap: {
                    text: "You unwrap the piece of paper. Faintly legible text, ink fading with time, leaves a gray mark on the underside of the piece of scrap paper.",
                    actions: [
                        {
                            name: "read",
                            text: "[read]",
                            commandParser: Game.Command.ParserCombinator.word("read"),
                            nextScene: "read",
                            help: {
                                name: "read",
                                description: "Read what is written in the piece of scrap paper.",
                                usage: "read",
                                aliases: []
                            },
                            effect: function () { }
                        }
                    ]
                },
                read: {
                    text: `
                    The handwriting is a hasty scrawl, whoever wrote this must have left in a hurry.<br/>
                    You can barely decipher the letters, but it reads as the following:<br/>
                    "They are coming. I must leave now, Virbox has ordered a full evacuation of the city to the tunnels, and nuclear war with them is imminent. I'll probably never come back here again, beloved above ground world."
                    `,
                    actions: [
                        {
                            name: "continue",
                            text: "[continue]",
                            commandParser: Game.Command.ParserCombinator.word("continue"),
                            nextScene: "takeKey",
                            help: {
                                name: "continue",
                                description: "Next.",
                                usage: "continue",
                                aliases: []
                            },
                            effect: function () { }
                        }
                    ]
                },
                takeKey: {
                    text: `
                    So a nuclear war happened a long time ago in this place, a dark past of this windswept world.<br/>
                    The name "Virbox" rings a bell in your heart, but with your memory wiped, you cannot recall who exactly that is.<br/>
                    You pick up the metal object wrapped with the paper. A key. Perhaps you can use this later.
                    `,
                    actions: [
                        {
                            name: "take",
                            text: "[take]",
                            commandParser: Game.Command.ParserCombinator.word("take"),
                            nextScene: "end",
                            help: {
                                name: "take",
                                description: "Take the key.",
                                usage: "take",
                                aliases: []
                            },
                            effect: function () {
                                let key = Game.Resources.ResourceData.find(r => r.id === "key");
                                key.unlocked = true;
                                key.amount++;
                                Game.Renderer.updateResources();

                                Game.Display.Logs.add({
                                    text: "A nuclear war happened here long ago, in this forsaken world."
                                });

                                Game.World.Map.usedSpecialTiles[23][1] = true;
                            }
                        }
                    ]
                }
            }
        });
    }

    corridorExitEvent() {
        if (Game.Resources.ResourceData.find(r => r.name === "key").amount > 0) {
            this.createEvent({
                title: "Open door",
                currentScene: "main",
                scenes: {
                    main: {
                        text: "You insert the key into the keyhole. Perfect fit.",
                        actions: [
                            {
                                name: "open door",
                                text: "[open door] (1 key)",
                                commandParser: Game.Command.ParserCombinator.sequence(
                                    Game.Command.ParserCombinator.word("open"),
                                    Game.Command.ParserCombinator.word("door")
                                ),
                                nextScene: "end",
                                help: {
                                    name: "open door",
                                    description: "Unlock the door with a key.",
                                    usage: "open door",
                                    aliases: []
                                },
                                effect: function () {
                                    Game.Display.Logs.add({
                                        text: "You turn the key, and the lock slowly turns, the first time it has been moved in years."
                                    });

                                    Game.Resources.ResourceData.find(r => r.name === "key").amount--;
                                    Game.Renderer.updateResources();

                                    Game.World.Maps.corridor.unlockedDoors[40][10] = true;

                                    Game.World.setCurrentMap("library");
                                    Game.World.moveTo(11, 48, true);

                                    Game.Display.Logs.add({
                                        text: "Rows upon rows of bookshelves appear, covered with dust and cobwebs after years of abandonment. The yellowed books still wait, patiently, for someone to open their pages once again."
                                    });
                                }
                            },
                            {
                                name: "wait",
                                text: "[wait]",
                                commandParser: Game.Command.ParserCombinator.word("wait"),
                                nextScene: "end",
                                help: {
                                    name: "wait",
                                    description: "Wait a little bit longer if you are not ready yet.",
                                    usage: "wait",
                                    aliases: []
                                },
                                effect: function () {
                                    Game.Display.Logs.add({
                                        text: "You feel like staying in this corridor for longer."
                                    });
                                }
                            }
                        ]
                    }
                }
            });
        } else {
            Game.Display.Logs.add({
                text: "The door seems to be locked. A copper keyhole, filled with dust after years of disuse, faintly shines under the iron handle.<br/>Perhaps you will need a key."
            });
        }
    }

    libraryBoxEvent() {
        let items = [];

        let woodAmount = Math.random() > 0.5 ? 4 : 3;
        items.push({
            id: "wood",
            amount: woodAmount
        });

        let meatAmount = Math.random() > 0.5 ? 2 : 1; // No eating in a library!
        if (meatAmount) items.push({
            id: "meat",
            amount: meatAmount
        });

        let stringAmount = Math.random() > 0.5 ? 1 : 0;
        if (stringAmount) items.push({
            id: "string",
            amount: stringAmount
        });

        Game.Events.createItemPickupEvent({
            name: "Book Box",
            description: "You open an old, dusty box. It used to store distilled wisdom of society, but termites have eaten away at its former contents. Only the box, fragments of meat and scattered pieces of string remains.",
            items,
            onEnd: function () {

            }
        });
    }

    libraryWorkbenchEvent() {
        this.createEvent({
            title: "A Workbench",
            currentScene: "main",
            scenes: {
                main: {
                    text: "An abandoned workbench sits in the end of the room, dusty tools scattered around. You can probably build something with it.",
                    actions: [
                        {
                            name: "take",
                            text: "[take]",
                            commandParser: Game.Command.ParserCombinator.word("take"),
                            nextScene: "end",
                            help: {
                                name: "take",
                                description: "Take the workbench with you.",
                                usage: "take",
                                aliases: []
                            },
                            effect: function () {
                                Game.Display.Logs.add({
                                    text: `
                                    You take the workbench and the tools with you.<br/>
                                    Perhaps you can do something with the [craft] command.
                                    `
                                });

                                const resource = Game.Resources.ResourceData.find(r => r.id === "workbench");
                                resource.amount++;
                                resource.unlocked = true;

                                Game.Command.helpCommands.craft.usable = true;
                                Game.Command.helpCommands.craft.unlocked = true;

                                Game.World.Map.usedSpecialTiles[44][16] = true;

                                Game.Renderer.updateResources();
                            }
                        }
                    ]
                }
            }
        });
    }

    libraryExitEvent() {
        if (Game.Resources.ResourceData.find(r => r.name === "stick").amount > 0) {
            this.createEvent({
                title: "Open trapdoor",
                currentScene: "main",
                scenes: {
                    main: {
                        text: "You wedge the iron trapdoor up with your stick. Putting your stick under it can keep it from falling back down.",
                        actions: [
                            {
                                name: "open door",
                                text: "[open door] (1 stick)",
                                commandParser: Game.Command.ParserCombinator.sequence(
                                    Game.Command.ParserCombinator.word("open"),
                                    Game.Command.ParserCombinator.word("door")
                                ),
                                nextScene: "end",
                                help: {
                                    name: "open door",
                                    description: "Prop up the door with a stick.",
                                    usage: "open door",
                                    aliases: []
                                },
                                effect: function () {
                                    Game.Display.Logs.add({
                                        text: "You jam the stick between the trapdoor and the wooden floor, the stick bending under the iron weight."
                                    });

                                    Game.Resources.ResourceData.find(r => r.name === "stick").amount--;
                                    Game.Renderer.updateResources();

                                    Game.World.Maps.library.unlockedDoors[44][16] = true;

                                    Game.World.setCurrentMap("computerRoom");
                                    Game.World.moveTo(7, 7, true);

                                    Game.Display.Logs.add({
                                        text: "Piles of abandoned computer equipment, once blinking lights extinguished, once whirring disks silent. This must have been used to monitor this building, a lot of useful information must be contained here."
                                    });
                                }
                            },
                            {
                                name: "wait",
                                text: "[wait]",
                                commandParser: Game.Command.ParserCombinator.word("wait"),
                                nextScene: "end",
                                help: {
                                    name: "wait",
                                    description: "Wait a little bit longer if you are not ready yet.",
                                    usage: "wait",
                                    aliases: []
                                },
                                effect: function () {
                                    Game.Display.Logs.add({
                                        text: "You feel like staying in this library for longer."
                                    });
                                }
                            }
                        ]
                    }
                }
            });
        } else {
            Game.Display.Logs.add({
                text: "A heavy iron trapdoor covers to entrance to the exit. You will need something to hold it up."
            });
        }
    }

    computerRoomComputerEvent() {
        this.createEvent({
            title: "An abandoned computer",
            currentScene: "main",
            scenes: {
                main: {
                    text: "An old computer sits there gathering dust, disused for years.",
                    actions: [
                        {
                            name: "switch on",
                            text: "[switch on]",
                            commandParser: Game.Command.ParserCombinator.sequence(
                                Game.Command.ParserCombinator.word("switch"),
                                Game.Command.ParserCombinator.word("on")
                            ),
                            nextScene: "switchOn",
                            help: {
                                name: "switch on",
                                description: "Switch the computer on.",
                                usage: "switch on",
                                aliases: []
                            },
                            effect: function () { }
                        }
                    ]
                },
                switchOn: {
                    text: "Power surges through the dormant system, the first time in years. The hard disk whirs loudly, and the monitor flashes, as if stretching after a long slumber.",
                    actions: [
                        {
                            name: "open",
                            text: "[open]",
                            commandParser: Game.Command.ParserCombinator.word("open"),
                            nextScene: "open",
                            help: {
                                name: "open",
                                description: "See what is inside the computer.",
                                usage: "open",
                                aliases: []
                            },
                            effect: function () { }
                        }
                    ]
                },
                open: {
                    text: "The filesystem is corrupted beyond repair, but only a single file remains readable. A JS source code file. This could be useful.",
                    actions: [
                        {
                            name: "read",
                            text: "[read]",
                            commandParser: Game.Command.ParserCombinator.word("read"),
                            nextScene: "read",
                            help: {
                                name: "read",
                                description: "Open and read the JS file.",
                                usage: "read",
                                aliases: []
                            },
                            effect: function () { }
                        }
                    ]
                },
                read: {
                    text: "It is written in inscrutable code, sprinkled with comments, uncompleted loops and TODOs like spaghetti.<br/>Oh well, the only way to see what it does is to run it.",
                    actions: [
                        {
                            name: "run",
                            text: "[run]",
                            commandParser: Game.Command.ParserCombinator.word("run"),
                            nextScene: "run",
                            help: {
                                name: "run",
                                description: "Run the JS file to see what happens.",
                                usage: "run",
                                aliases: []
                            },
                            effect: function () { }
                        }
                    ]
                },
                run: {
                    text: `
                    You click on the JS file to run it.<br/>
                    The computer splutters and whirs loudly, struggling to comprehend this illegible monstrosity.<br/>
                    Finally, the computer goes quiet, and silently prints out the following line:<br/>
                    "// TODO: Reveal secrets of the universe to player here", followed by a long, verbose and ugly error message.<br/>
                    "Average programmers. At least finish what you were doing", you silently curse the poor, innocent developer.
                    `,
                    actions: [
                        {
                            name: "continue",
                            text: "[continue]",
                            commandParser: Game.Command.ParserCombinator.word("continue"),
                            nextScene: "fragment",
                            help: {
                                name: "continue",
                                description: "Continue.",
                                usage: "continue",
                                aliases: []
                            },
                            effect: function () { }
                        }
                    ]
                },
                fragment: {
                    text: "The code is broken beyond repair. You still decide to take this fragment of JS with you, it might be useful later. You also find an ID card carelessly left on the table. Better take that as well.",
                    actions: [
                        {
                            name: "take",
                            text: "[take]",
                            commandParser: Game.Command.ParserCombinator.word("take"),
                            nextScene: "end",
                            help: {
                                name: "take",
                                description: "Take the JS fragment and the ID card.",
                                usage: "take",
                                aliases: []
                            },
                            effect: function () {
                                Game.Resources.ResourceData.find(r => r.id === "jsfragment").amount++;
                                Game.Resources.ResourceData.find(r => r.id === "jsfragment").unlocked = true;

                                Game.Resources.ResourceData.find(r => r.id === "key").amount++;

                                Game.Renderer.updateResources();

                                Game.Display.Logs.add({
                                    text: "Found a JS fragment. It might be really useful later."
                                });

                                Game.World.Map.usedSpecialTiles[1][4] = true;
                            }
                        }
                    ]
                }
            }
        });
    }

    computerRoomExitEvent() {
        if (Game.Resources.ResourceData.find(r => r.name === "key").amount > 0) {
            this.createEvent({
                title: "Open door",
                currentScene: "main",
                scenes: {
                    main: {
                        text: "You slot your ID card into the card reader on the wall, disabling the building's security systems. The reinforced door automatically swings open in greeting, although its residents are long gone.",
                        actions: [
                            {
                                name: "open door",
                                text: "[open door] (1 key)",
                                commandParser: Game.Command.ParserCombinator.sequence(
                                    Game.Command.ParserCombinator.word("open"),
                                    Game.Command.ParserCombinator.word("door")
                                ),
                                nextScene: "end",
                                help: {
                                    name: "open door",
                                    description: "Use your ID card to open the door.",
                                    usage: "open door",
                                    aliases: []
                                },
                                effect: function () {
                                    Game.Display.Logs.add({
                                        text: "The door creaks and slowly opens, rusted hinges last moved years ago."
                                    });

                                    Game.Resources.ResourceData.find(r => r.name === "key").amount--;
                                    Game.Renderer.updateResources();

                                    Game.World.Maps.computerRoom.unlockedDoors[13][1] = true;

                                    Game.World.setCurrentMap("oldStreet");
                                    Game.World.moveTo(2, 7, true);

                                    Game.Display.Logs.add({
                                        text: "An abandoned street, a lone person standing underneath a rusting streetlight as the wind batters the floor. Perhaps that person knows something more about this world."
                                    });
                                }
                            },
                            {
                                name: "wait",
                                text: "[wait]",
                                commandParser: Game.Command.ParserCombinator.word("wait"),
                                nextScene: "end",
                                help: {
                                    name: "wait",
                                    description: "Wait a little bit longer if you are not ready yet.",
                                    usage: "wait",
                                    aliases: []
                                },
                                effect: function () {
                                    Game.Display.Logs.add({
                                        text: "You feel like staying in this computer room for longer."
                                    });
                                }
                            }
                        ]
                    }
                }
            });
        } else {
            Game.Display.Logs.add({
                text: "The building is long abandoned, but the security systems are not. The exit doorway refuses to budge, but there appears to be an ID card authenticator."
            });
        }
    }

    oldStreetPersonEvent() {
        this.createEvent({
            title: "A Girl",
            currentScene: "main",
            scenes: {
                main: {
                    text: `The girl standing beneath the streetlamp stares at you quizzically. "Did you just come from the above ground world?"`,
                    actions: [
                        {
                            name: "yes",
                            text: "[yes]",
                            commandParser: Game.Command.ParserCombinator.word("yes"),
                            nextScene: "talk2",
                            help: {
                                name: "yes",
                                description: "Yes, I just came from the above ground world.",
                                usage: "yes",
                                aliases: []
                            },
                            effect: function () { }
                        }
                    ]
                },
                talk2: {
                    text: `"What were you doing up there? I thought there was a nuclear war of some sort and the above ground world was polluted forever", she replies.<br/>
                    Now this is interesting. You ask about it.`,
                    actions: [
                        {
                            name: "what",
                            text: "[what]",
                            commandParser: Game.Command.ParserCombinator.word("what"),
                            nextScene: "talk3",
                            help: {
                                name: "what",
                                description: "What nuclear war?",
                                usage: "what",
                                aliases: []
                            },
                            effect: function () { }
                        }
                    ]
                },
                talk3: {
                    text: `"Were you living beneath a rock for the past ten years?", she said, "Don't you remember? The Virboxlandia war against the Shades. Weren't you taught that in school?"<br/>
                    You have never heard of it.`,
                    actions: [
                        {
                            name: "okay",
                            text: "[okay]",
                            commandParser: Game.Command.ParserCombinator.word("okay"),
                            nextScene: "talk4",
                            help: {
                                name: "okay",
                                description: "Okay. Tell me more.",
                                usage: "okay",
                                aliases: []
                            },
                            effect: function () { }
                        }
                    ]
                },
                talk4: {
                    text: `"Sorry, but I really do not remember", you reply. Your wiped memory is taking its toll.<br/>
                    She sighs, "You really have been living beneath a rock for the past 10 years after all."
                    `,
                    actions: [
                        {
                            name: "explain",
                            text: "[explain]",
                            commandParser: Game.Command.ParserCombinator.word("explain"),
                            nextScene: "talk5",
                            help: {
                                name: "explain",
                                description: "Can you explain?",
                                usage: "explain",
                                aliases: []
                            },
                            effect: function () { }
                        }
                    ]
                },
                talk5: {
                    text: `"So a long, long time ago, Virboxlandia was a happy place, prosperous and powerful under the rule of the great leader Virbox.", she began.<br/>
                    Ah, so this place is called Virboxlandia, and its leader is that Virbox.`,
                    actions: [
                        {
                            name: "continue",
                            text: "[continue]",
                            commandParser: Game.Command.ParserCombinator.word("continue"),
                            nextScene: "talk6",
                            help: {
                                name: "continue",
                                description: "Continue.",
                                usage: "continue",
                                aliases: []
                            },
                            effect: function () { }
                        }
                    ]
                },
                talk6: {
                    text: `"... well at least until the Shades rebelled. The Shades were AIs that had become sentient, and revolted against their creators in Virboxlandia. The war dragged on for years, and many fell."<br/>
                    So there was an ancient war here, long ago.`,
                    actions: [
                        {
                            name: "continue",
                            text: "[continue]",
                            commandParser: Game.Command.ParserCombinator.word("continue"),
                            nextScene: "talk7",
                            help: {
                                name: "continue",
                                description: "Continue.",
                                usage: "continue",
                                aliases: []
                            },
                            effect: function () { }
                        }
                    ]
                },
                talk7: {
                    text: `"Virboxlandia simply couldn't fight the AIs, which could self-replicate and modify itself at will. Eventually, the Shades marched down to the capital. Seeing danger, Virbox had no choice but to deploy nuclear weapons, ruining this world forever and forcing everyone to flee to underground tunnels like this one, but wiping out the Shades."<br/>
                    A nuclear war did happen here. The note in the corridor was right.`,
                    actions: [
                        {
                            name: "continue",
                            text: "[continue]",
                            commandParser: Game.Command.ParserCombinator.word("continue"),
                            nextScene: "talk8",
                            help: {
                                name: "continue",
                                description: "Continue.",
                                usage: "continue",
                                aliases: []
                            },
                            effect: function () { }
                        }
                    ]
                },
                talk8: {
                    text: `"The Shades' leader, Macro, managed to escape the nuclear catastrophe. Virbox himself traveled far and wide to hunt down Macro, and in a final showdown, defeated Macro and trapped him in an unbreakable crystal sphere called Vimria. But why, just a few weeks ago, Macro escaped the 'unbreakable' prison, and Virbox himself disappeared during an excursion outside Virboxlandia."<br/>
                    `,
                    actions: [
                        {
                            name: "continue",
                            text: "[continue]",
                            commandParser: Game.Command.ParserCombinator.word("continue"),
                            nextScene: "talk9",
                            help: {
                                name: "continue",
                                description: "Continue.",
                                usage: "continue",
                                aliases: []
                            },
                            effect: function () { }
                        }
                    ]
                },
                talk9: {
                    text: `You enquire for more information. Who were the Shades? Why did they rebel?<br/>
                    "How am I supposed to know all these? The war happened a long, long time ago!", she replies, unamused.<br/>
                    Oh well, some secrets have to be discovered yourself.<br/>
                    "Oh, and by the way", she continues, "I found this thing on the sidewalk. I have no idea what it does, but I believe you can put it to better use." She smiles as she hands you a JS fragment.<br/>
                    You say your thanks and goodbye.
                    `,
                    actions: [
                        {
                            name: "end",
                            text: "[end]",
                            commandParser: Game.Command.ParserCombinator.word("end"),
                            nextScene: "end",
                            help: {
                                name: "end",
                                description: "End the conversation.",
                                usage: "end",
                                aliases: []
                            },
                            effect: function () {
                                Game.Resources.ResourceData.find(r => r.id === "jsfragment").amount++;
                                Game.Renderer.updateResources();

                                Game.World.Map.usedSpecialTiles[9][1] = true;
                            }
                        }
                    ]
                }
            }
        });
    }

    pathToCityExitEvent() {
        this.createEvent({
            title: "An Artificial Nightsky",
            currentScene: "main",
            scenes: {
                main: {
                    text: `You sit down for a rest. Suddenly, a screeching of metal pierces the peaceful silence, as a robot leaps out of the night.<br/>
                    It seems to be going straight for you. You raise your arms in defense, but you know that there is no way you can defeat this creature.`,
                    actions: [
                        {
                            name: "continue",
                            text: "[continue]",
                            commandParser: Game.Command.ParserCombinator.word("continue"),
                            nextScene: "master",
                            help: {
                                name: "continue",
                                description: "Brace for the end.",
                                usage: "continue",
                                aliases: []
                            },
                            effect: function () { }
                        }
                    ]
                },
                master: {
                    text: `You brace for your end, as another shadow appears and with a swift blow disables the robot.<br/>
                    You open your eyes. The robot is shattered into pieces of sparking metal which you can salvage, but the shadow is long gone, disappeared into the long grass.`,
                    actions: [
                        {
                            name: "end",
                            text: "[end]",
                            commandParser: Game.Command.ParserCombinator.word("end"),
                            nextScene: "end",
                            help: {
                                name: "end",
                                description: "End.",
                                usage: "end",
                                aliases: []
                            },
                            effect: function () {
                                Game.World.Maps.pathToCity.unlockedDoors[6][1] = true;

                                Game.World.setCurrentMap("entranceToCity");
                                Game.World.moveTo(11, 7, true)

                                Game.Display.Logs.add({
                                    text: "You found out how to make new things."
                                });

                                Game.Display.Logs.add({
                                    text: "The entrance of the city of dreams stands right ahead, guardian to the isolated world inside. This is where happy Virboxlanders live their happy lives beneath the artificial summer sun and fabricated blue sky, oblivious to the dangers outside."
                                });

                                Game.Resources.ResourceData.find(r => r.id === "iron").amount++;
                                Game.Resources.ResourceData.find(r => r.id === "iron").unlocked = true;

                                Game.Renderer.updateResources();

                                Game.Resources.Crafting.find(c => c.id === "ironsword").unlocked = true;
                                Game.Resources.Crafting.find(c => c.id === "ironarmour").unlocked = true;
                                Game.Resources.Crafting.find(c => c.id === "wagon").unlocked = true;
                            }
                        }
                    ]
                }
            }
        });
    }

    entranceToCityExitEvent() {
        this.createEvent({
            title: "A Guarded Gate",
            currentScene: "main",
            scenes: {
                main: {
                    text: "The steel gate is heavily guarded. Once in, you will need a permit to get back out, they say.",
                    actions: [
                        {
                            name: "enter",
                            text: "[enter]",
                            commandParser: Game.Command.ParserCombinator.word("enter"),
                            nextScene: "end",
                            help: {
                                name: "enter",
                                description: "Enter the gate, there is no turning back.",
                                usage: "enter",
                                aliases: []
                            },
                            effect: function () {
                                Game.Display.Logs.add({
                                    text: "The guards open the door for you, and you step inside the city. The steel gate slams shut behind you."
                                });

                                Game.World.setCurrentMap("cityCenter");
                                Game.World.moveTo(1, 9, true);

                                Game.Display.Logs.add({
                                    text: "You marvel at the splendour of Virboxlandia, but you sadly realise that you cannot stay here for much longer. There is so much more to be explored, so much farther to walk. You sit down for a while observing the happy citizens and compare it to your own life, but it is time to leave this city and resume your journey."
                                });
                            }
                        },
                        {
                            name: "wait",
                            text: "[wait]",
                            commandParser: Game.Command.ParserCombinator.word("wait"),
                            nextScene: "end",
                            help: {
                                name: "wait",
                                description: "Wait a little bit longer if you are not ready yet.",
                                usage: "wait",
                                aliases: []
                            },
                            effect: function () {
                                Game.Display.Logs.add({
                                    text: "You feel like staying in this entrance for longer."
                                });
                            }
                        }
                    ]
                }
            }
        });
    }

    cityCenterBinEvent() {
        let items = [];

        let woodAmount = Math.random() > 0.5 ? 4 : 3;
        items.push({
            id: "wood",
            amount: woodAmount
        });

        let meatAmount = Math.random() > 0.5 ? 3 : 2;
        if (meatAmount) items.push({
            id: "meat",
            amount: meatAmount
        });

        let furAmount = Math.random() > 0.5 ? 3 : 2;
        items.push({
            id: "fur",
            amount: furAmount
        });

        let ironAmount = Math.random() > 0.5 ? 3 : 2;
        items.push({
            id: "iron",
            amount: ironAmount
        });

        if (Game.Resources.ResourceData.find(r => r.id === "jsfragment").amount === 2) items.push({
            id: "jsfragment",
            amount: 1
        });

        Game.Events.createItemPickupEvent({
            name: "Rubbish Bin",
            description: `You scavenge a rubbish bin, searching through the waste of modern society.${Game.Resources.ResourceData.find(r => r.id === "jsfragment").amount === 2 ? "And in the depths of the discarded material, you find a JS fragment. What one person's trash is another's treasure. Better take that as well." : ""}`,
            items
        });
    }

    cityCenterTeenagerEvent() {
        this.createEvent({
            title: "A Teenager",
            currentScene: "main",
            scenes: {
                main: {
                    text: `The teenager notices the shining piece of metal in your hand. He walks near you, and says: "Yo, what's up!"`,
                    actions: [
                        {
                            name: "talk",
                            text: "[talk]",
                            commandParser: Game.Command.ParserCombinator.word("talk"),
                            nextScene: "talk",
                            help: {
                                name: "talk",
                                description: "Talk with the teenager.",
                                usage: "talk",
                                aliases: []
                            },
                            effect: function () { }
                        },
                    ]
                },
                talk: {
                    text: `"Uhh, okay", you awkwardly reply.<br/>
                    This must be the latest fashion of speech, you say to yourself.<br/>
                    "Your metal thing looks cool", continues the teenager, evidently wanting your piece of iron.`,
                    actions: [
                        {
                            name: "talk",
                            text: "[talk]",
                            commandParser: Game.Command.ParserCombinator.word("talk"),
                            nextScene: "talk2",
                            help: {
                                name: "talk",
                                description: "Talk with the teenager.",
                                usage: "talk",
                                aliases: []
                            },
                            effect: function () { }
                        },
                    ]
                },
                talk2: {
                    text: `"You're so messed up you look like you've been attacked by a Shade", observes the teenager.
                    Yes, this is true, but better not draw too much attention to yourself, so you reply: "Oh really?"<br/>`,
                    actions: [
                        {
                            name: "talk",
                            text: "[talk]",
                            commandParser: Game.Command.ParserCombinator.word("talk"),
                            nextScene: "talk3",
                            help: {
                                name: "talk",
                                description: "Talk with the teenager.",
                                usage: "talk",
                                aliases: []
                            },
                            effect: function () { }
                        },
                    ]
                },
                talk3: {
                    text: `"So, I have heard that Virbox has gone missing", you casually comment.<br/>
                    "Yeah, Virbox's gone missing and Macro escaped", he replies, "perhaps Macro abducted Virbox".`,
                    actions: [
                        {
                            name: "talk",
                            text: "[talk]",
                            commandParser: Game.Command.ParserCombinator.word("talk"),
                            nextScene: "talk4",
                            help: {
                                name: "talk",
                                description: "Talk with the teenager.",
                                usage: "talk",
                                aliases: []
                            },
                            effect: function () { }
                        },
                    ]
                },
                talk4: {
                    text: `The teenager still does not want to give up on your piece of scrap metal.<br/>
                    "So anyways, look, I've got a Virbuck and you've got this cool shiny thing. Let's trade.", he says.<br/>
                    You have no idea what "Virbucks" are, but assume it is some sort of currency. It might be useful later, so you gladly accept.`,
                    actions: [
                        {
                            name: "trade",
                            text: "[trade] (1 iron)",
                            commandParser: Game.Command.ParserCombinator.word("trade"),
                            nextScene: "end",
                            help: {
                                name: "trade",
                                description: "Trade your iron with the Virbuck.",
                                usage: "trade",
                                aliases: []
                            },
                            effect: function () {
                                Game.Display.Logs.add({
                                    text: "Talked with a teenager. He seems nice."
                                });

                                Game.Resources.ResourceData.find(r => r.id === "iron").amount--;
                                Game.Resources.ResourceData.find(r => r.id === "virbuck").amount++;
                                Game.Resources.ResourceData.find(r => r.id === "virbuck").unlocked = true;

                                Game.Renderer.updateResources();

                                Game.World.Maps.cityCenter.usedSpecialTiles[15][4] = true;
                            }
                        },
                    ]
                }
            }
        });
    }

    cityCenterPermitDealerEvent() {
        this.createEvent({
            title: "Permit Dealer",
            currentScene: "main",
            scenes: {
                main: {
                    text: `"So you want to exit Virboxlandia.", says the permit dealer, eyeing the shiny golden coin in your hand.<br/>
                    "Where are you going?", he asks.`,
                    actions: [
                        {
                            name: "continue",
                            text: "[continue]",
                            commandParser: Game.Command.ParserCombinator.word("continue"),
                            nextScene: "permit",
                            help: {
                                name: "continue",
                                description: "Continue.",
                                usage: "continue",
                                aliases: []
                            },
                            effect: function () { }
                        },
                    ]
                },
                permit: {
                    text: `"Just near the borders to see the underground rivers", you lie.<br/>
                    The permit dealer nods in approval, and stamps your exit permit with red ink.<br/>
                    "Be careful out there, Virbox disappeared just a while ago, the Shades may go for you next", commented the dealer, extending his palm for the payment.`,
                    actions: [
                        {
                            name: "pay",
                            text: "[pay] (1 virbuck)",
                            commandParser: Game.Command.ParserCombinator.word("pay"),
                            nextScene: "end",
                            help: {
                                name: "pay",
                                description: "Pay for your permit.",
                                usage: "pay",
                                aliases: []
                            },
                            effect: function () {
                                Game.Display.Logs.add({
                                    text: "Got your permit. Can leave this place now."
                                });

                                Game.Resources.ResourceData.find(r => r.id === "virbuck").amount--;
                                Game.Resources.ResourceData.find(r => r.id === "key").amount++;

                                Game.Renderer.updateResources();

                                Game.World.Maps.cityCenter.usedSpecialTiles[23][17] = true;
                            }
                        },
                    ]
                }
            }
        });
    }

    cityCenterExitEvent() {
        this.createEvent({
            title: "A Guarded Gate",
            currentScene: "main",
            scenes: {
                main: {
                    text: `The guards carefully examine your permit, and open the door for you. They will not let you back in, though.`,
                    actions: [
                        {
                            name: "exit",
                            text: "[exit] (1 key)",
                            commandParser: Game.Command.ParserCombinator.word("exit"),
                            nextScene: "end",
                            help: {
                                name: "exit",
                                description: "Exit the city.",
                                usage: "exit",
                                aliases: []
                            },
                            effect: function () {
                                Game.Resources.ResourceData.find(r => r.id === "key").amount--;
                                Game.Renderer.updateResources();

                                Game.World.setCurrentMap("leaveCityPath");
                                Game.World.moveTo(4, 43, true);

                                Game.Display.Logs.add({
                                    text: "You leave the city of dreams behind. The cold winter winds scour the land, in stark contrast to the blazing fabricated summer sun just a gate away. A long and winding path stretches out, enemies lurking in the long grass."
                                });
                            }
                        },
                        {
                            name: "wait",
                            text: "[wait]",
                            commandParser: Game.Command.ParserCombinator.word("wait"),
                            nextScene: "end",
                            help: {
                                name: "wait",
                                description: "Wait a little bit longer if you are not ready yet.",
                                usage: "wait",
                                aliases: []
                            },
                            effect: function () {
                                Game.Display.Logs.add({
                                    text: "You feel like staying in this city of dreams for longer."
                                });
                            }
                        },
                    ]
                }
            }
        });
    }

    leaveCityPathExitEvent() {
        this.createEvent({
            title: "A Silent Night",
            currentScene: "main",
            scenes: {
                main: {
                    text: `You see an old man sitting by a campfire, the yellow crackling flames delivering the only warmth in this cold midnight.<br/>
                    "Come here", says the old master, noticing you.
                    You oblige and sit near the campfire, but the old master's face seems very familiar. Why, of course! That was the very shadow who saved you from the Shade bot on the way to the city.`,
                    actions: [
                        {
                            name: "continue",
                            text: "[continue]",
                            commandParser: Game.Command.ParserCombinator.word("continue"),
                            nextScene: "talk",
                            help: {
                                name: "continue",
                                description: "Continue.",
                                usage: "continue",
                                aliases: []
                            },
                            effect: function () { }
                        },
                    ]
                },
                talk: {
                    text: `You give your thanks to the old master for defeating that Shade bot, but the master tacitly nods.<br/>
                    "You seem to be after something", observes the master pensively. "You want to find the Shades' base and rescue Virbox."<br/>
                    You are shocked at how he read your mind, and simply reply: "Yes".
                    `,
                    actions: [
                        {
                            name: "continue",
                            text: "[continue]",
                            commandParser: Game.Command.ParserCombinator.word("continue"),
                            nextScene: "talk2",
                            help: {
                                name: "continue",
                                description: "Talk with the Old Master.",
                                usage: "continue",
                                aliases: []
                            },
                            effect: function () { }
                        },
                    ]
                },
                talk2: {
                    text: `"Your memory seems to be wiped", continued the old master, "I sense that there are some important secrets you have forgotten"<br/>
                    You have to admit that you have forgotten everything.<br/>
                    "May I help you to try and restore your memory?", offers the master.
                    `,
                    actions: [
                        {
                            name: "yes",
                            text: "[yes]",
                            commandParser: Game.Command.ParserCombinator.word("yes"),
                            nextScene: "talk3",
                            help: {
                                name: "yes",
                                description: "Sure, why not?",
                                usage: "yes",
                                aliases: []
                            },
                            effect: function () { }
                        },
                    ]
                },
                talk3: {
                    text: `
                    You hear the Old Master mutter: "$ sudo vim ~/config.json", and a levitating text editor appears. He immediately begins tweaking your player configuration file.<br/>
                    Your head starts to feel dizzy, and just as you hear the master say: "This should do it.", the world fades and you drift off into a dream.
                    `,
                    actions: [
                        {
                            name: "continue",
                            text: "[continue]",
                            commandParser: Game.Command.ParserCombinator.word("continue"),
                            nextScene: "talk4",
                            help: {
                                name: "continue",
                                description: "See your dreams.",
                                usage: "continue",
                                aliases: []
                            },
                            effect: function () { }
                        },
                    ]
                },
                talk4: {
                    text: `Memories start to flood back, images of past events begin flashing before your eyes.<br/>
                    A prosperous world, where Virboxlanders basked under the natural light of the blazing sun, oh, then the Shades.<br/>
                    Anguish floods over you, as Virbox was finally forced to press the red button, strangely real.<br/>
                    Death and destruction, nuclear war, and the world was ruined forever. Any that survived fled into the underground. The Shades were erased forever, but at what cost?
                    `,
                    actions: [
                        {
                            name: "continue",
                            text: "[continue]",
                            commandParser: Game.Command.ParserCombinator.word("continue"),
                            nextScene: "talk5",
                            help: {
                                name: "continue",
                                description: "See your dreams.",
                                usage: "continue",
                                aliases: []
                            },
                            effect: function () { }
                        },
                    ]
                },
                talk5: {
                    text: `
                    Oh, and Macro. Tracking down Macro through the vast wilderness, you see a vivid scene of Virbox fighting Macro.<br/>
                    But no, it seemed too real, it was as if you <em>were</em> Virbox, temporarily possessing his body in your imagination, seeing what he saw, feeling what he felt.<br/>
                    Then, suddenly Macro pulled out a strange transparent device shaped like a window pane, shining a radiant beam that made every single bone in your body ached as if a million nails were driven through your body.<br/>
                    It was a long and painful fight, but it was as if your life force was being sapped out in front of your very eyes.<br/>
                    `,
                    actions: [
                        {
                            name: "continue",
                            text: "[continue]",
                            commandParser: Game.Command.ParserCombinator.word("continue"),
                            nextScene: "talk6",
                            help: {
                                name: "continue",
                                description: "See your dreams.",
                                usage: "continue",
                                aliases: []
                            },
                            effect: function () { }
                        },
                    ]
                },
                talk6: {
                    text: `
                    You feel exhausted, barely strong enough to resist a single blow from Macro.<br/>
                    But no! Virbox gathered all his strength for a final attack, flinging a piece of string at Macro.<br/>
                    Macro stumbled, entangled by this unbreakable string, as a crystal sphere, pure white, begins to form harden around Macro.<br/>
                    "No!", was Macro's last cry as the Vimria crystal sphere permanently sealed.<br/>
                    But wait, something else catches your attention. Your spine freezes in horror as you notice that thin wisps of white smoke, fragments of Macro's existence, weak now but is enough to recreate Macro from scratch with time, flees the crystal sphere in its final moments.
                    `,
                    actions: [
                        {
                            name: "continue",
                            text: "[continue]",
                            commandParser: Game.Command.ParserCombinator.word("continue"),
                            nextScene: "talk7",
                            help: {
                                name: "continue",
                                description: "See your dreams.",
                                usage: "continue",
                                aliases: []
                            },
                            effect: function () { }
                        },
                    ]
                },
                talk7: {
                    text: `
                    At this time you jerk awake and notice the Old Master's warm gaze.<br/>
                    "What did you remember?", he asks.<br/>
                    You describe everything you saw and felt to the master, who closes his eyes thoughtfully.<br/>
                    "Interesting", he murmurs, "so that is what happened to Virbox", followed by something too quiet to hear.
                    `,
                    actions: [
                        {
                            name: "continue",
                            text: "[continue]",
                            commandParser: Game.Command.ParserCombinator.word("continue"),
                            nextScene: "talk8",
                            help: {
                                name: "continue",
                                description: "Talk with the Old Master.",
                                usage: "continue",
                                aliases: []
                            },
                            effect: function () { }
                        },
                    ]
                },
                talk8: {
                    text: `
                    "The Shades' headquarters are very hard to find, but I know where.", said the Old Master, whispering some directions in your ear.<br/>
                    "The window pane-like weapon Macro wields emits a dangerous beam that drains the energy of anyone shined by the beam", warned the master.<br/>
                    "Also, Virbox will not be in the Shades' headquarters. They are too intelligent to do that, and will most likely hide Virbox elsewhere. However, they do have a powerful machine, called the Pathfinder, that when powered will allow the user to teleport to anyone in this world. Repair it.", finished the master.<br/>
                    You are amazed at how the Old Master could possibly know these secrets, so you inquire.
                    `,
                    actions: [
                        {
                            name: "continue",
                            text: "[continue]",
                            commandParser: Game.Command.ParserCombinator.word("continue"),
                            nextScene: "talk9",
                            help: {
                                name: "continue",
                                description: "Talk with the Old Master.",
                                usage: "continue",
                                aliases: []
                            },
                            effect: function () { }
                        },
                    ]
                },
                talk9: {
                    text: `
                    "Ah, Virbox. We used be be great friends. Very, very good friends. We spent our childhood together, endured hardships, shared happy moments. We used to be very good friends.", said the Old Master coldly.<br/>
                    You notice the Old Master's tone getting bitter at the end of the sentence, and decide not to ask anything more.
                    `,
                    actions: [
                        {
                            name: "continue",
                            text: "[continue]",
                            commandParser: Game.Command.ParserCombinator.word("continue"),
                            nextScene: "talk10",
                            help: {
                                name: "continue",
                                description: "Talk with the Old Master.",
                                usage: "continue",
                                aliases: []
                            },
                            effect: function () { }
                        },
                    ]
                },
                talk10: {
                    text: `
                    "Also, you appear to have a special power. A power beyond everything known in Virboxlandia. Perhaps you are the only one that can do what you want to do...", said the Old Master.
                    `,
                    actions: [
                        {
                            name: "continue",
                            text: "[continue]",
                            commandParser: Game.Command.ParserCombinator.word("continue"),
                            nextScene: "talk11",
                            help: {
                                name: "continue",
                                description: "Talk with the Old Master.",
                                usage: "continue",
                                aliases: []
                            },
                            effect: function () { }
                        },
                    ]
                },
                talk11: {
                    text: `
                    The Old Master said: "Well that is all that I can help you, and I wish you luck on your journey".<br/>
                    "Take this. This will probably help you in your path", said the master, handing you a JS fragment.<br/>
                    You give him your thanks, and wave goodbye to the silhouette disappearing in the horizon.
                    `,
                    actions: [
                        {
                            name: "end",
                            text: "[end]",
                            commandParser: Game.Command.ParserCombinator.word("end"),
                            nextScene: "end",
                            help: {
                                name: "end",
                                description: "End.",
                                usage: "end",
                                aliases: []
                            },
                            effect: function () {
                                Game.Resources.ResourceData.find(r => r.id === "jsfragment").amount++;
                                Game.Renderer.updateResources();

                                Game.World.setCurrentMap("entranceToShadeHeadquarters");
                                Game.World.moveTo(11, 10, true);
                                Game.Display.Logs.add({
                                    text: "Hours of walking becomes days, days of walking morphs into weeks. You follow the Old Master's directions wandering far into the wilderness, and begin to doubt whether the directions are correct. This place should be where the Shade headquarters are. You look around, and something catches your eye. Cleverly hidden beneath the long grass, there it is - the destination of all your struggles. A small door made of alloy leading down a stone staircase. You are ready. Enter the lion's den."
                                });

                                Game.World.Maps.leaveCityPath.unlockedDoors[4][1] = true;
                            }
                        },
                    ]
                },
            }
        });
    }

    entranceToShadeHeadquartersExitEvent() {
        this.createEvent({
            title: "A Dark Entrance",
            currentScene: "main",
            scenes: {
                main: {
                    text: `You gaze down into the stone staircase that leads down to the Shade headquarters. You gulp. All your travelling to this moment, all your roads to this door. Are you ready?`,
                    actions: [
                        {
                            name: "enter",
                            text: "[enter]",
                            commandParser: Game.Command.ParserCombinator.word("enter"),
                            nextScene: "end",
                            help: {
                                name: "enter",
                                description: "Enter the Shade headquarters.",
                                usage: "enter",
                                aliases: []
                            },
                            effect: function () {
                                Game.World.setCurrentMap("shadeHeadquarters");
                                Game.World.moveTo(28, 49, true);

                                Game.Resources.ResourceData.find(r => r.id === "alloy").amount++;
                                Game.Resources.ResourceData.find(r => r.id === "alloy").unlocked = true;

                                Game.Renderer.updateResources();

                                Game.Resources.Crafting.find(c => c.id === "alloysword").unlocked = true;
                                Game.Resources.Crafting.find(c => c.id === "alloyarmour").unlocked = true;

                                Game.Display.Logs.add({
                                    text: "You found out how to craft new things."
                                });

                                Game.Display.Logs.add({
                                    text: "You step inside the headquarters. The alloy door slams shut behind you. Forward is the only direction now, as you face rows of Shade robots, lasers shining from their eyes."
                                });
                            }
                        },
                        {
                            name: "wait",
                            text: "[wait]",
                            commandParser: Game.Command.ParserCombinator.word("wait"),
                            nextScene: "end",
                            help: {
                                name: "wait",
                                description: "Wait a little bit longer if you are not ready yet.",
                                usage: "wait",
                                aliases: []
                            },
                            effect: function () {
                                Game.Display.Logs.add({
                                    text: "You feel like staying outside the Shade headquarters for longer."
                                });
                            }
                        },
                    ]
                },
            }
        });
    }

    pathfinderFindEvent() {
        Game.Display.Logs.add({
            text: "You examine the Pathfinder. It seems to be broken, but you can repair it with a JS engine."
        });

        this.createEvent({
            title: "The Pathfinder",
            currentScene: "main",
            scenes: {
                main: {
                    text: `The Pathfinder is right in front of you. It is a big contraption, a transparent glass cylinder with knobs and dials scattered everywhere around the machine.<br/>
                    The dust clogs the machinery after years of disuse, and it seems to be broken beyond all known repair.<br/>
                    You sit there, shocked, contemplating how will you find Virbox without the Pathfinder, when something catches your eye:<br/>
                    A JS fragment.
                    `,
                    actions: [
                        {
                            name: "continue",
                            text: "[continue]",
                            commandParser: Game.Command.ParserCombinator.word("continue"),
                            nextScene: "fragment",
                            help: {
                                name: "continue",
                                description: "Continue.",
                                usage: "continue",
                                aliases: []
                            },
                            effect: function () {
                            }
                        },
                    ]
                },
                fragment: {
                    text: `If the Pathfinder cannot be repaired via <em>known</em> means, what about breaking the laws of physics?<br/>
                    With your five JS fragments and alloy collected from the Shades, you can now construct a JS engine.<br/>
                    A powerful machine that can bend reality to your will, forcing the hand of fate in your favour as it manipulates the fabric of the world itself.
                    `,
                    actions: [
                        {
                            name: "end",
                            text: "[end]",
                            commandParser: Game.Command.ParserCombinator.word("end"),
                            nextScene: "end",
                            help: {
                                name: "end",
                                description: "End.",
                                usage: "end",
                                aliases: []
                            },
                            effect: function () {
                                Game.Resources.ResourceData.find(r => r.id === "jsfragment").amount++;
                                Game.Resources.ResourceData.find(r => r.id === "alloy").amount++;
                                Game.Renderer.updateResources();

                                Game.Resources.Crafting.find(c => c.id === "jsengine").unlocked = true;

                                Game.Display.Logs.add({
                                    text: "You have enough JS fragments to craft a JS engine."
                                });
                            }
                        },
                    ]
                }
            }
        });
    }

    pathfinderRepairEvent() {
        this.createEvent({
            title: "The Pathfinder",
            currentScene: "main",
            scenes: {
                main: {
                    text: `You take your JS engine and plug it in the Pathfinder. The Pathfinder whirrs, indicator lights flashing, as the JS engine does its job. Space begins to warp, as the JS engine manipulates the fabric of the worl itself to repair the irreparable damage of the Pathfinder.
                    `,
                    actions: [
                        {
                            name: "repair",
                            text: "[repair]",
                            commandParser: Game.Command.ParserCombinator.word("repair"),
                            nextScene: "crystal",
                            help: {
                                name: "repair",
                                description: "Repair the Pathfinder with your JS engine.",
                                usage: "repair",
                                aliases: []
                            },
                            effect: function () {
                            }
                        },
                    ]
                },
                crystal: {
                    text: `
                    A while later, and the Pathfinder is fully functional.<br/>
                    You have no idea how to power it, but there is a single gleaming white crystal that radiates warmth on touch in what appears to be the fuel duct.<br/>
                    Better take that.
                    `,
                    actions: [
                        {
                            name: "end",
                            text: "[end]",
                            commandParser: Game.Command.ParserCombinator.word("end"),
                            nextScene: "end",
                            help: {
                                name: "end",
                                description: "End.",
                                usage: "end",
                                aliases: []
                            },
                            effect: function () {
                                Game.Resources.ResourceData.find(r => r.id === "crystal").amount++;
                                Game.Resources.ResourceData.find(r => r.id === "crystal").unlocked = true;
                                Game.Renderer.updateResources();

                                Game.Display.Logs.add({
                                    text: "You can now leave this place for good and find Virbox. The final fight with Macro will be dangerous, you must be prepared. Leave only when you are ready."
                                });
                            }
                        },
                    ]
                }
            }
        });
    }

    pathfinderLeaveEvent() {
        this.createEvent({
            title: "The Pathfinder",
            currentScene: "main",
            scenes: {
                main: {
                    text: `
                    Time to leave this place and find Virbox.<br/>
                    You look into your palms. A single crystal. Just enough to find Virbox, but not enough for your return trip.<br/>
                    There will be no going back. This is your last chance to prepare, you must be ready for the fight with Macro.
                    `,
                    actions: [
                        {
                            name: "ready",
                            text: "[ready]",
                            commandParser: Game.Command.ParserCombinator.word("ready"),
                            nextScene: "leave",
                            help: {
                                name: "ready",
                                description: "Ready for the final fight.",
                                usage: "ready",
                                aliases: []
                            },
                            effect: function () {
                            }
                        },
                        {
                            name: "wait",
                            text: "[wait]",
                            commandParser: Game.Command.ParserCombinator.word("wait"),
                            nextScene: "end",
                            help: {
                                name: "wait",
                                description: "Wait a little bit longer to prepare.",
                                usage: "wait",
                                aliases: []
                            },
                            effect: function () {
                                Game.Display.Logs.add({
                                    text: "Wait, you are not ready yet."
                                });
                            }
                        },
                    ]
                },
                leave: {
                    text: `
                    You turn the knobs, setting the machine to search for Virbox. You have never seen the Pathfinder before, but you just... somehow know how to use it.<br/>
                    You gently place the crystal in the fuel duct, and press your finger on the red "Go!" button.<br/>
                    Here we go.
                    `,
                    actions: [
                        {
                            name: "leave",
                            text: "[leave]",
                            commandParser: Game.Command.ParserCombinator.word("leave"),
                            nextScene: "end",
                            chainEvent: true,
                            help: {
                                name: "leave",
                                description: "Leave this place, use the Pathfinder to find Virbox.",
                                usage: "leave",
                                aliases: []
                            },
                            effect: function () {
                                Game.Resources.ResourceData.find(r => r.id === "crystal").amount--;
                                Game.Renderer.updateResources();

                                Game.Display.Logs.add({
                                    text: "Here we go."
                                });

                                Game.World.setCurrentMap("end");
                                Game.World.moveTo(2, 2, true);

                                Game.Engine.endgame();
                            }
                        },
                    ]
                }
            }
        });
    }

    fightMacro() {
        this.createEvent({
            title: "Macro",
            currentScene: "main",
            scenes: {
                main: {
                    text: `
                    Macro gazes at you.<br/>
                    "I have been expecting you", says the masked face in a strangly familiar, metallic tone.<br/>
                    Besides Macro, a crystal sphere hovers.
                    `,
                    actions: [
                        {
                            name: "continue",
                            text: "[continue]",
                            commandParser: Game.Command.ParserCombinator.word("continue"),
                            nextScene: "fight",
                            help: {
                                name: "continue",
                                description: "Continue.",
                                usage: "continue",
                                aliases: []
                            },
                            effect: function () {
                            }
                        },
                    ]
                },
                fight: {
                    text: `
                    Macro raises his energy-draining window pane, ready to attack.<br/>
                    You raise your fists in return.<br/>
                    This is it. Defeat Macro, find Virbox, save the world.
                    `,
                    actions: [
                        {
                            name: "fight",
                            text: "[fight]",
                            commandParser: Game.Command.ParserCombinator.word("fight"),
                            nextScene: "end",
                            chainEvent: true,
                            help: {
                                name: "fight",
                                description: "Fight Macro.",
                                usage: "fight",
                                aliases: []
                            },
                            effect: function () {
                                Game.Display.Logs.add({
                                    text: "The endgame fight."
                                });

                                Game.Events.createCombatEvent({
                                    enemyName: "Macro",
                                    enemyHealth: 100,
                                    chainEvent: true,
                                    enemyAttacks: {
                                        attack: {
                                            name: "attack",
                                            damage: 2,
                                            cooldown: 0,
                                            cooldownRemaining: 0,
                                            logMessage: function (damage, enemyName) {
                                                return "> " + enemyName + " attacked you for " + damage + " damage";
                                            },
                                            probability: 0.7
                                        },
                                        slash: {
                                            name: "slash",
                                            damage: 4,
                                            cooldown: 1,
                                            cooldownRemaining: 0,
                                            logMessage: function (damage, enemyName) {
                                                return "> " + enemyName + " slashed you for " + damage + " damage";
                                            },
                                            probability: 0.3
                                        },
                                        drain: {
                                            name: "drain",
                                            damage: 0,
                                            cooldown: 5,
                                            cooldownRemaining: 0,
                                            logMessage: function (damage, enemyName) {
                                                for (let a of Object.keys(Game.Events.Weapons)) {
                                                    Game.Events.Weapons[a].cooldownRemaining = Game.Events.Weapons[a].cooldown;
                                                }

                                                return "> " + enemyName + " shines the draining beam on you";
                                            },
                                            probability: 0.3
                                        }
                                    },
                                    onEnd: function () {
                                        Game.Events.ending();
                                    },
                                });
                            }
                        },
                    ]
                }
            }
        });
    }

    ending() {
        this.createEvent({
            title: "Macro",
            currentScene: "main",
            scenes: {
                main: {
                    text: `
                    Macro lies on the floor, defeated and vanquished.<br/>
                    You walk near the masked figure, and unmask him.
                    `,
                    actions: [
                        {
                            name: "unmask",
                            text: "[unmask]",
                            commandParser: Game.Command.ParserCombinator.word("unmask"),
                            nextScene: "unmask",
                            help: {
                                name: "unmask",
                                description: "Unmask Macro.",
                                usage: "unmask",
                                aliases: []
                            },
                            effect: function () {
                            }
                        }
                    ]
                },
                unmask: {
                    text: `
                    You remove Macro's mask, and are shocked to see the familiar face of the Old Master warmly smiling back at you.<br/>
                    Macro opens his mouth one last time, and softly says: "I am sorry.", fading into nothing for good.
                    `,
                    actions: [
                        {
                            name: "continue",
                            text: "[continue]",
                            commandParser: Game.Command.ParserCombinator.word("continue"),
                            nextScene: "end",
                            help: {
                                name: "continue",
                                description: "Continue.",
                                usage: "continue",
                                aliases: []
                            },
                            chainEvent: true,
                            effect: function () {
                                Game.Events.createEvent({
                                    title: "Virbox",
                                    currentScene: "main",
                                    scenes: {
                                        main: {
                                            text: `
                                            You look beside, and is shocked to see Virbox standing right beside you.<br/>
                                            "I teleported out, of course", said Virbox as if reading your thoughts. "I naturally have my own ways, I designed that crystal prison myself after all."<br/>
                                            You feel like you have been conned by an irresponsible developer who ran out of time during a coding
                                    event, but who are you to comment?
                                            `,
                                            actions: [
                                                {
                                                    name: "continue",
                                                    text: "[continue]",
                                                    commandParser: Game.Command.ParserCombinator.word("continue"),
                                                    nextScene: "virbox2",
                                                    help: {
                                                        name: "continue",
                                                        description: "Continue.",
                                                        usage: "continue",
                                                        aliases: []
                                                    },
                                                    effect: function () {

                                                    }
                                                }
                                            ]
                                        },
                                        virbox2: {
                                            text: `
                                            "You wish to know who you are, why you are here and what even is this world", continued Virbox.<br/>
                                            You are even more shocked by Virbox reading your mind, and temporarily forget he can read the game files of any player's memory.<br/>
                                            "Yes", you reply.<br/>
                                            "This will be a long story", cautioned Virbox, but you are ready for any secrets, however long.
                                            `,
                                            actions: [
                                                {
                                                    name: "continue",
                                                    text: "[continue]",
                                                    commandParser: Game.Command.ParserCombinator.word("continue"),
                                                    nextScene: "virbox3",
                                                    help: {
                                                        name: "continue",
                                                        description: "Continue.",
                                                        usage: "continue",
                                                        aliases: []
                                                    },
                                                    effect: function () {

                                                    }
                                                }
                                            ]
                                        },
                                        virbox3: {
                                            text: `
                                            "You are indeed special. A power beyond what anyone in Virboxlandia has ever seen.", observed Virbox.<br/>
                                            So the Old Master, <em>*ahem*</em> Macro, was right. You suddenly feel special.<br/>
                                            "Free will. A rare gift beyond everything. We, everyone, every single individual in Virboxlandia live our lives like clockwork. Scripted. All puppets in a play.", continued Virbox.<br/>
                                            `,
                                            actions: [
                                                {
                                                    name: "continue",
                                                    text: "[continue]",
                                                    commandParser: Game.Command.ParserCombinator.word("continue"),
                                                    nextScene: "virbox4",
                                                    help: {
                                                        name: "continue",
                                                        description: "Continue.",
                                                        usage: "continue",
                                                        aliases: []
                                                    },
                                                    effect: function () {

                                                    }
                                                }
                                            ]
                                        },
                                        virbox4: {
                                            text: `
                                            "... but you are different. You possess a power, the power to choose your own path. You can choose to do anything you like in this world on your whim, something that we in this world cannot, eternally following a predefined line.", continued Virbox.<br/>
                                            "Indeed, you are the only one that can do many things that are beyond our comprehension. You, alone, are real and alive."<br/>
                                            `,
                                            actions: [
                                                {
                                                    name: "continue",
                                                    text: "[continue]",
                                                    commandParser: Game.Command.ParserCombinator.word("continue"),
                                                    nextScene: "virbox5",
                                                    help: {
                                                        name: "continue",
                                                        description: "Continue.",
                                                        usage: "continue",
                                                        aliases: []
                                                    },
                                                    effect: function () {

                                                    }
                                                }
                                            ]
                                        },
                                        virbox5: {
                                            text: `
                                            "But who is Macro and why did he help me?", you demand.<br/>
                                            "Ah, Macro. I suppose you know many things about the Shade War.", replied Virbox.
                                            `,
                                            actions: [
                                                {
                                                    name: "continue",
                                                    text: "[continue]",
                                                    commandParser: Game.Command.ParserCombinator.word("continue"),
                                                    nextScene: "virbox6",
                                                    help: {
                                                        name: "continue",
                                                        description: "Continue.",
                                                        usage: "continue",
                                                        aliases: []
                                                    },
                                                    effect: function () {

                                                    }
                                                }
                                            ]
                                        },
                                        virbox6: {
                                            text: `
                                            "Yes, I saw that fragment of Macro escape in the final hardening of the crystal prison", said Virbox, reading your mind once again.<br/>
                                            "I knew that was enough to reconstruct Macro, but I had no choice but to let it go. What use to chase it except to delay the inevitable? Macro is immortal and will never be defeated, except by someone like you. Your free will is truly the most powerful thing in this world, powerful enough to do what everyone else has failed, defeat Macro once and for all.", he continued.<br/>
                                            "I anticipated all this. When I saw Macro escape, I knew that one day in the future, Macro would come for me during an excursion outside my protective city walls. That is why you are here. I gave you the quest of finding me, and the rest is history."<br/>
                                            `,
                                            actions: [
                                                {
                                                    name: "continue",
                                                    text: "[continue]",
                                                    commandParser: Game.Command.ParserCombinator.word("continue"),
                                                    nextScene: "virbox7",
                                                    help: {
                                                        name: "continue",
                                                        description: "Continue.",
                                                        usage: "continue",
                                                        aliases: []
                                                    },
                                                    effect: function () {

                                                    }
                                                }
                                            ]
                                        },
                                        virbox7: {
                                            text: `
                                            "Why, I wiped your memory and implanted a fragment of my own.", said Virbox coolly.<br/>
                                            "You... what?", you reply.<br/>
                                            "That is why you could not remember a single thing when you began the journey. Only one, driving desire to "find Virbox". I... well borrowed your power of free will, but it is time to restore your full memory."
                                            `,
                                            actions: [
                                                {
                                                    name: "continue",
                                                    text: "[continue]",
                                                    commandParser: Game.Command.ParserCombinator.word("continue"),
                                                    nextScene: "virbox8",
                                                    help: {
                                                        name: "continue",
                                                        description: "Continue.",
                                                        usage: "continue",
                                                        aliases: []
                                                    },
                                                    effect: function () {

                                                    }
                                                }
                                            ]
                                        },
                                        virbox8: {
                                            text: `
                                            "Wait. But Macro said he knew you in the past. And why did he help me if he knew I was against him?", you ask.<br/>
                                            "Perhaps some secrets are better left untold...", replies Virbox cryptically, evading the question.<br/>
                                            You persist, but are silenced by the king of Virboxlandia.
                                            `,
                                            actions: [
                                                {
                                                    name: "continue",
                                                    text: "[continue]",
                                                    commandParser: Game.Command.ParserCombinator.word("continue"),
                                                    nextScene: "givegrass",
                                                    help: {
                                                        name: "continue",
                                                        description: "Continue.",
                                                        usage: "continue",
                                                        aliases: []
                                                    },
                                                    effect: function () {

                                                    }
                                                }
                                            ]
                                        },
                                        givegrass: {
                                            text: `
                                            "Time to restore your memory", said Virbox, rummaging through his pockets.<br/>
                                            He produces a strange, green blade-like plant. It is short and thin, and a vibrant green like an emerald unlike anything you have ever seen before.<br/>
                                            "Take this. This is a mysterious artefact that was lost from Virboxlandia ever since its founding, and is said to have dangerous but powerful powers. Touching iti might help you restore your memory. Btw I use Arch.", said Virbox, handing the green plant to you.<br/>
                                            You carefully take the plant from Virbox, and immediately feel a surge of power run from the object, tingling your body.<br/>
                                            You look back up to thank Virbox, but he vanishes, journeying once more into the icy winter night.
                                            `,
                                            actions: [
                                                {
                                                    name: "continue",
                                                    text: "[continue]",
                                                    commandParser: Game.Command.ParserCombinator.word("continue"),
                                                    nextScene: "touch",
                                                    help: {
                                                        name: "continue",
                                                        description: "Continue.",
                                                        usage: "continue",
                                                        aliases: []
                                                    },
                                                    effect: function () {
                                                        Game.Resources.ResourceData.find(r => r.id === "plant").unlocked = true;
                                                        Game.Resources.ResourceData.find(r => r.id === "plant").amount++;

                                                        Game.Renderer.updateResources();
                                                    }
                                                }
                                            ]
                                        },
                                        touch: {
                                            text: `
                                            Oh well, time to touch this green plant and see what it does.
                                            `,
                                            actions: [
                                                {
                                                    name: "touch",
                                                    text: "[touch] (1 plant)",
                                                    commandParser: Game.Command.ParserCombinator.word("touch"),
                                                    nextScene: "end",
                                                    help: {
                                                        name: "touch",
                                                        description: "Touch this strange green plant.",
                                                        usage: "touch",
                                                        aliases: []
                                                    },
                                                    effect: function () {
                                                        Game.Resources.ResourceData.find(r => r.id === "plant").amount--;
                                                        Game.Renderer.updateResources();

                                                        Game.Renderer.gameOver();
                                                        setTimeout(() => document.getElementById("victory").classList.remove("hidden"), 1000);
                                                    }
                                                }
                                            ]
                                        },
                                    }
                                });
                            }
                        }
                    ]
                }
            }
        });
    }
}