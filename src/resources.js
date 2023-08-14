export class Resources {
    ResourceData = [
        {
            name: "plant",
            id: "plant",
            amount: 0,
            space: 0,
            description: "A mysterious green plant, said to have unimaginable power.",
            unlocked: false
        },
        {
            name: "water",
            id: "water",
            amount: 0,
            space: 0,
            description: "Water to quench your thirst.",
            unlocked: false
        },
        {
            name: "food",
            id: "food",
            amount: 0,
            space: 1,
            description: "Food to restore your strength.",
            unlocked: false
        },
        {
            name: "meat",
            id: "meat",
            amount: 0,
            space: 0,
            description: "Edible resource that can be processed into food.",
            unlocked: false
        },
        {
            name: "wood",
            id: "wood",
            amount: 0,
            space: 0,
            description: "A material made from trees that can be used for many things.",
            unlocked: false
        },
        {
            name: "fur",
            id: "fur",
            amount: 0,
            space: 0,
            description: "A soft, warm furry material obtained from killing animals.",
            unlocked: false
        },
        {
            name: "string",
            id: "string",
            amount: 0,
            space: 0,
            description: "A long material that can be used to tie things together.",
            unlocked: false
        },
        {
            name: "stick",
            id: "stick",
            amount: 0,
            space: 1,
            description: "A stick, useful for many purposes.",
            unlocked: false
        },
        {
            name: "iron",
            id: "iron",
            amount: 0,
            space: 0,
            description: "A gray metal, hard and strong.",
            unlocked: false
        },
        {
            name: "alloy",
            id: "alloy",
            amount: 0,
            space: 0,
            description: "A strange, alien silver metal, hard and durable unlike anything ever seen.",
            unlocked: false
        },
        {
            name: "key",
            id: "key",
            amount: 0,
            space: 0,
            description: "Unlock a door.",
            unlocked: false
        },
        {
            name: "virbuck",
            id: "virbuck",
            amount: 0,
            space: 0,
            description: "Virboxlandia's currency.",
            unlocked: false
        },
        {
            name: "crystal",
            id: "crystal",
            amount: 0,
            space: 0,
            description: "Pure condensed energy to power the Pathfinder.",
            unlocked: false
        },
        {
            name: "js fragment",
            id: "jsfragment",
            amount: 0,
            space: 0,
            description: "A mysterious substance, said to make up the fabric of the world itself.",
            unlocked: false
        },
        {
            name: "js engine",
            id: "jsengine",
            amount: 0,
            space: 0,
            description: "A powerful machine that can manipulate the fabric of existence, bending reality to your will.",
            unlocked: false
        },
        {
            name: "torch",
            id: "torch",
            amount: 0,
            space: 0,
            description: "A handheld flame to illuminate your dark path. +1 view distance.",
            unlocked: false
        },
        {
            name: "spear",
            id: "spear",
            amount: 0,
            space: 2,
            description: "A sharp, pointy stick used to stab anyone that stands in you way. 2 damage, 1 cooldown.",
            unlocked: false
        },
        {
            name: "iron sword",
            id: "ironsword",
            amount: 0,
            space: 3,
            description: "A strong iron blade, always trusty in the wilderness. 3 damage, 2 cooldown.",
            unlocked: false
        },
        {
            name: "alloy sword",
            id: "alloysword",
            amount: 0,
            space: 5,
            description: "An extremely strong weapon with a sweeping sharp edge. 5 damage, 3 cooldown.",
            unlocked: false
        },
        {
            name: "backpack",
            id: "backpack",
            amount: 0,
            space: 0,
            description: "A backpack that allows you to carry more things. +5 space.",
            unlocked: false
        },
        {
            name: "wagon",
            id: "wagon",
            amount: 0,
            space: 0,
            description: "An iron tray with two wheels, can carry very heavy things. +15 space.",
            unlocked: false
        },
        {
            name: "fur armour",
            id: "furarmour",
            amount: 0,
            space: 0,
            description: "Soft and weak, but better than nothing. +5 health.",
            unlocked: false
        },
        {
            name: "iron armour",
            id: "ironarmour",
            amount: 0,
            space: 0,
            description: "Hard and strong, good protection to its wearer. +15 health.",
            unlocked: false
        },
        {
            name: "alloy armour",
            id: "alloyarmour",
            amount: 0,
            space: 0,
            description: "Extremely durable defense, developed by the Shades to fight against the brightest of the Virboxlanders. +20 health.",
            unlocked: false
        },
        {
            name: "workbench",
            id: "workbench",
            amount: 0,
            space: 0,
            description: "Tools to create items from other items. Usable with [craft].",
            unlocked: false
        },
        {
            name: "guidebook",
            id: "guidebook",
            amount: 1,
            space: 0,
            description: "A book full of information to guide you. Usable with [help].",
            unlocked: true
        }
    ];

    Crafting = [
        {
            id: "stick",
            resources: [
                {
                    id: "wood",
                    amount: 1
                }
            ],
            onCraft: function () {
                if (Game.Resources.Crafting.find(c => c.id === "spear").unlocked) return;
                
                Game.Display.Logs.add({
                    text: "You found out how to make new things."
                });

                Game.Resources.Crafting.find(c => c.id === "spear").unlocked = true;
            },
            unlocked: true
        },
        {
            id: "food",
            resources: [
                {
                    id: "meat",
                    amount: 1
                },
                {
                    id: "wood",
                    amount: 1
                }
            ],
            unlocked: true
        },
        {
            id: "string",
            resources: [
                {
                    id: "fur",
                    amount: 2
                }
            ],
            onCraft: function () {
                if (Game.Resources.Crafting.find(c => c.id === "furarmour").unlocked) return;
                
                Game.Display.Logs.add({
                    text: "You found out how to make new things."
                });

                Game.Resources.Crafting.find(c => c.id === "backpack").unlocked = true;
                Game.Resources.Crafting.find(c => c.id === "furarmour").unlocked = true;
            },
            unlocked: true
        },
        {
            id: "spear",
            resources: [
                {
                    id: "stick",
                    amount: 1
                },
                {
                    id: "wood",
                    amount: 2
                },
                {
                    id: "string",
                    amount: 1
                }
            ],
            unlocked: false
        },
        {
            id: "ironsword",
            resources: [
                {
                    id: "stick",
                    amount: 1
                },
                {
                    id: "iron",
                    amount: 5
                },
                {
                    id: "string",
                    amount: 1
                }
            ],
            unlocked: false
        },
        {
            id: "alloysword",
            resources: [
                {
                    id: "stick",
                    amount: 1
                },
                {
                    id: "alloy",
                    amount: 5
                },
                {
                    id: "string",
                    amount: 1
                }
            ],
            unlocked: false
        },
        {
            id: "backpack",
            resources: [
                {
                    id: "stick",
                    amount: 2
                },
                {
                    id: "string",
                    amount: 1
                },
                {
                    id: "fur",
                    amount: 5
                }
            ],
            unlocked: false
        },
        {
            id: "wagon",
            resources: [
                {
                    id: "stick",
                    amount: 5
                },
                {
                    id: "string",
                    amount: 1
                },
                {
                    id: "iron",
                    amount: 5
                }
            ],
            unlocked: false
        },
        {
            id: "furarmour",
            resources: [
                {
                    id: "string",
                    amount: 2
                },
                {
                    id: "fur",
                    amount: 5
                }
            ],
            onCraft: function () {
                Game.World.Player.health = Math.min(Game.World.Player.health + 5, Game.World.computeMaxHealth());
            },
            unlocked: false
        },
        {
            id: "ironarmour",
            resources: [
                {
                    id: "string",
                    amount: 2
                },
                {
                    id: "iron",
                    amount: 5
                }
            ],
            onCraft: function () {
                Game.World.Player.health = Math.min(Game.World.Player.health + 15, Game.World.computeMaxHealth());
            },
            unlocked: false
        },
        {
            id: "alloyarmour",
            resources: [
                {
                    id: "string",
                    amount: 2
                },
                {
                    id: "alloy",
                    amount: 5
                }
            ],
            onCraft: function () {
                Game.World.Player.health = Math.min(Game.World.Player.health + 20, Game.World.computeMaxHealth());
            },
            unlocked: false
        },
        {
            id: "torch",
            resources: [
                {
                    id: "stick",
                    amount: 1
                },
                {
                    id: "wood",
                    amount: 5
                },
            ],
            unlocked: true
        },
        {
            id: "jsengine",
            resources: [
                {
                    id: "jsfragment",
                    amount: 5
                },
                {
                    id: "alloy",
                    amount: 1
                },
            ],
            unlocked: false
        },
    ]

    getResourceNameFromId(id) {
        return this.ResourceData.find(r => r.id === id).name;
    }

    computeMaxSpace() {
        let space = 10;
        if (Game.Resources.ResourceData.find(r => r.id === "backpack").amount) space += 5;
        if (Game.Resources.ResourceData.find(r => r.id === "wagon").amount) space += 15;

        return space;
    }

    computeUsedSpace() {
        let space = 0;
        for (let i in this.ResourceData) {
            space += this.ResourceData[i].space * this.ResourceData[i].amount;
        }
        return space;
    }

    computeFreeSpace() {
        return this.computeMaxSpace() - this.computeUsedSpace();
    }
};