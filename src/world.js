export class World {
    Tiles = {
        WALL: '#',
        PATH: '%',
        STONE_FLOOR: '.',
        WOODEN_PLANK: '|',
        GRASS: ',',
        DOOR: 'D',
        SPAWN: 'S',
        BOX: 'B',
        ITEM: 'I',
        PERSON: 'N',
        PATHFINDER: 'F',
        WHITESPACE: ' '
    };

    Map = {
        map: [],
        name: "",
        tileEffects: {},
        uncovered: [],
        usedSpecialTiles: {},
        unlockedDoors: {},
        dangerousTiles: {}
    };

    lastTile = "";
    lastDangerTile = "";

    mapString = "";

    Maps = {
        introduction: {
            /*
            ###############
            #......D......#
            #.............#
            #.............#
            #.............#
            #......S......#
            ###############
            */
            name: "Introduction",
            map: [
                // 7 * 15
                "###############".split(''),
                "#......D......#".split(''),
                "#.............#".split(''),
                "#.............#".split(''),
                "#.............#".split(''),
                "#......S......#".split(''),
                "###############".split(''),
            ],
            uncovered: Array.apply(null, Array(7)).map(r => Array.apply(null, Array(15)).map(c => true)), // Introduction map is always uncovered
            usedSpecialTiles: {},
            unlockedDoors: {
                7: {
                    1: false
                }
            },
            tileEffects: {
                7: {
                    1: function () {
                        Game.Engine.exitIntroduction();
                    }
                }
            },
            dangerousTiles: {
                dangerMap: Array.apply(null, Array(7)).map(r => Array.apply(null, Array(15)).map(c => " ")),
                enemies: {}
            }
        },
        corridor: {
            /*
#####################################
#...................................#
#...................................#
#...................................#
#...................................#
#...................................#
#.....#########################.....#
#.....#                       #.....######
#.....#                       #..........#
#.....#                       #..........#
#.....#                       #.........D#
#.....#                       #..........#
#.....#                       #..........#
#.....#                       ############
#.....#
#.....#
#.....#
#.....##########################
#..............................#
#..............................#
#..............................#
#..............................#
#..............................#
##########################.....#
                         #.....#
                         #.....#
                         #.....#
                         #.....#
                         #.....#
                         #.....#
                         #.....#
                         #..D..#
                         #######
            */
            name: "Corridor",
            map: [
                // 33 * 42
                "#####################################     ".split(''),
                "#......................I............#     ".split(''),
                "#...................................#     ".split(''),
                "#...................................#     ".split(''),
                "#...................................#     ".split(''),
                "#...................................#     ".split(''),
                "#.....#########################.....#     ".split(''),
                //
                "#.....#                       #.....######".split(''),
                "#.....#                       #..........#".split(''),
                "#.....#                       #..........#".split(''),
                "#.....#                       #.........D#".split(''),
                "#.....#                       #..........#".split(''),
                "#.....#                       #..........#".split(''),
                "#.....#                       ############".split(''),
                "#.....#                                   ".split(''),
                "#.....#                                   ".split(''),
                "#.....#                                   ".split(''),
                //
                "#.....##############################      ".split(''),
                "#..................................#      ".split(''),
                "#..................................#      ".split(''),
                "#..................................#      ".split(''),
                "#..................................#      ".split(''),
                "#..................................#      ".split(''),
                "##############################.....#      ".split(''),
                //
                "                             #.....#      ".split(''),
                "                             #.....#      ".split(''),
                "                             #.....#      ".split(''),
                "                             #.....#      ".split(''),
                "                             #.....#      ".split(''),
                "                             #.....#      ".split(''),
                "                             #.....#      ".split(''),
                "                             #..D..#      ".split(''),
                "                             #######      ".split(''),
            ],
            uncovered: Array.apply(null, Array(33)).map(r => Array.apply(null, Array(42)).map(c => false)),
            usedSpecialTiles: {
                23: {
                    1: false
                },
            },
            unlockedDoors: {
                32: {
                    31: false
                },
                40: {
                    10: false
                }
            },
            dangerousTiles: {
                dangerMap: Array.apply(null, Array(33)).map(r => Array.apply(null, Array(42)).map(c => "#")),
                enemies: {
                    "#": {
                        enemies: [
                            {
                                enemyName: "Spider",
                                message: "A spider pounces from the shadows, fangs sharp.",
                                enemyHealth: 3,
                                enemyAttacks: {
                                    attack: {
                                        name: "bite",
                                        damage: 2,
                                        cooldown: 1,
                                        cooldownRemaining: 1,
                                        logMessage: function (damage, enemyName) {
                                            return "> " + enemyName + " bit you for " + damage + " damage.";
                                        },
                                        probability: 1
                                    },
                                    prepare: {
                                        name: "prepare",
                                        damage: 0,
                                        cooldown: 1,
                                        cooldownRemaining: 0,
                                        logMessage: function (damage, enemyName) {
                                            return "> " + enemyName + " prepares its fangs for another strike.";
                                        },
                                        probability: 1
                                    }
                                },
                                loot: [
                                    {
                                        id: "meat",
                                        amount: function () {
                                            return Math.random() > 0.5 ? 1 : 0;
                                        }
                                    },
                                    {
                                        id: "string",
                                        amount: function () {
                                            return 1;
                                        }
                                    }
                                ],
                                onVictory: function () {
                                    console.log("Victory");
                                },
                                probability: 0.03
                            },
                            {
                                enemyName: "Rat",
                                message: "A rat leaps out of a hole in the wall, teeth and claws baring.",
                                enemyHealth: 3,
                                enemyAttacks: {
                                    attack: {
                                        name: "",
                                        damage: 1,
                                        cooldown: 0,
                                        cooldownRemaining: 0,
                                        logMessage: function (damage, enemyName) {
                                            return "> " + enemyName + " bit you for " + damage + " damage.";
                                        },
                                        probability: 1
                                    }
                                },
                                loot: [
                                    {
                                        id: "meat",
                                        amount: function () {
                                            return Math.random() > 0.5 ? 1 : 0;
                                        }
                                    },
                                    {
                                        id: "fur",
                                        amount: function () {
                                            return 1;
                                        }
                                    }
                                ],
                                onVictory: function () {
                                    console.log("Victory");
                                },
                                probability: 0.03
                            }
                        ]
                    }
                }
            },
            tileEffects: {
                23: {
                    1: function () {
                        if (!Game.World.Map.usedSpecialTiles[23][1]) Game.Events.corridorItemEvent();
                    }
                },
                32: {
                    31: function () {
                        Game.Display.Logs.add({
                            text: "You try to force your way back in the room, but the rusty door hinge jams and refuses to open. Oh well, forward is the only direction now."
                        });
                    }
                },
                40: {
                    10: function () {
                        Game.Engine.exitCorridor();
                    }
                }
            }
        },
        library: {
            name: "Library",
            map: [
                // 50 * 50
                "###############          ##################       ".split(''),
                "#||||||D||||||#          #||||||||B|||||||#       ".split(''),
                "#|||||||||||||############||||||||||||||||#       ".split(''),
                "#|||||||||||||............||||||||||||||||#       ".split(''),
                "#|||||||||||||############||||||||||||||||#       ".split(''),
                "#|||||||||||||#          #||||||||||||||||#       ".split(''),
                "#|||||||||||||#          #||||||||||||||||#       ".split(''),
                "###############          ######.########.##       ".split(''),
                "                              #.#      #.#        ".split(''),
                "                              #.#      #.#        ".split(''),
                "                              #.#     ##.#########".split(''),
                "       ###################    #.#     #||||||||||#".split(''),
                "       #|||||||||||||||||#    #.#     #||||||||||#".split(''),
                "       #|||||||||||||||||######.#     #||||||||||#".split(''),
                "       #|||||B|||||||||||.......#     #||||||||||#".split(''),
                "       #|||||||||||||||||########     #||||||||||#".split(''),
                "       #|||||||||||||||||#            #|||||I||||#".split(''),
                "       #|||||||||||||||||#            ############".split(''),
                "       #|||||||||||||||||#                        ".split(''),
                "       #|||||||||||||||||#                        ".split(''),
                "       #|||||||||||||||||###########              ".split(''),
                "       #|||||||||||||||||..........###########    ".split(''),
                "       ###########################|||||||||||#    ".split(''),
                "                                 #|||||||||||#    ".split(''),
                "                                 #|||||||||||#    ".split(''),
                "                                 #|||||||||||#    ".split(''),
                "  ###############                #|B|||||||||#    ".split(''),
                "  #|||||||||||||#                #|||||||||||#    ".split(''),
                "  #|||||||||||||#                #|||||||||||#    ".split(''),
                "  #B||||||||||||#                #|||||||||||#    ".split(''),
                "  #|||||||||||||#                #|||||||||||#    ".split(''),
                "  #|||||||||||||##################|||||||||||#    ".split(''),
                "  #|||||||||||||..................|||||||||||#    ".split(''),
                "  #|||||||||||||##################|||||||||||#    ".split(''),
                "  #|||||||||||||#                #|||||||||||#    ".split(''),
                "  #|||||||||||||#                #|||||||||||#    ".split(''),
                "  ######.########                #||||||||||B#    ".split(''),
                "       #.#                       #|||||||||||#    ".split(''),
                "       #.#                       #############    ".split(''),
                "       #.#                                        ".split(''),
                "       #.#                                        ".split(''),
                "       #.#                                        ".split(''),
                "      ##.########                                 ".split(''),
                "      #|||||||||#                                 ".split(''),
                "      #|||||||||#                                 ".split(''),
                "      #|||||||||#                                 ".split(''),
                "      #|||||||||#                                 ".split(''),
                "      #|||||||||#                                 ".split(''),
                "      #||||D||||#                                 ".split(''),
                "      ###########                                 ".split(''),
            ],
            uncovered: Array.apply(null, Array(50)).map(r => Array.apply(null, Array(50)).map(c => false)),
            usedSpecialTiles: {
                3: {
                    29: false
                },
                13: {
                    14: false
                },
                34: {
                    1: false
                },
                35: {
                    26: false
                },
                44: {
                    16: false,
                    36: false
                }
            },
            unlockedDoors: {
                44: {
                    16: false
                }
            },
            tileEffects: {
                3: {
                    29: function () {
                        if (Game.World.Maps.library.usedSpecialTiles[3][29]) return;

                        Game.World.Maps.library.usedSpecialTiles[3][29] = true;

                        Game.Events.libraryBoxEvent();
                    }
                },
                7: {
                    1: function () {
                        Game.Engine.exitLibrary();
                    }
                },
                11: {
                    48: function () {
                        Game.World.setCurrentMap("corridor");
                        Game.World.moveTo(40, 10, true);

                        Game.Display.Logs.add({
                            text: "A long corridor stretches ahead, fading into endless shadows."
                        });
                    }
                },
                13: {
                    14: function () {
                        if (Game.World.Maps.library.usedSpecialTiles[13][14]) return;

                        Game.World.Maps.library.usedSpecialTiles[13][14] = true;

                        Game.Events.libraryBoxEvent();
                    }
                },
                34: {
                    1: function () {
                        if (Game.World.Maps.library.usedSpecialTiles[34][1]) return;

                        Game.World.Maps.library.usedSpecialTiles[34][1] = true;

                        Game.Events.libraryBoxEvent();
                    }
                },
                35: {
                    26: function () {
                        if (Game.World.Maps.library.usedSpecialTiles[35][26]) return;

                        Game.World.Maps.library.usedSpecialTiles[35][26] = true;

                        Game.Events.libraryBoxEvent();
                    }
                },
                44: {
                    16: function () {
                        if (!Game.World.Map.usedSpecialTiles[44][16]) Game.Events.libraryWorkbenchEvent();
                    },
                    36: function () {
                        if (Game.World.Maps.library.usedSpecialTiles[44][36]) return;

                        Game.World.Maps.library.usedSpecialTiles[44][36] = true;

                        Game.Events.libraryBoxEvent(44, 36);
                    }
                }
            },
            dangerousTiles: {
                dangerMap: Array.apply(null, Array(50)).map(r => Array.apply(null, Array(50)).map(c => " ")),
                enemies: {}
            }
        },
        computerRoom: {
            name: "Computer Room",
            map: [
                // 9 * 15
                "###############".split(''),
                "#............D#".split(''),
                "#.............#".split(''),
                "#.............#".split(''),
                "#I............#".split(''),
                "#.............#".split(''),
                "#.............#".split(''),
                "#......D......#".split(''),
                "###############".split(''),
            ],
            uncovered: Array.apply(null, Array(9)).map(r => Array.apply(null, Array(15)).map(c => false)),
            usedSpecialTiles: {
                1: {
                    4: false
                }
            },
            unlockedDoors: {
                13: {
                    1: false
                }
            },
            tileEffects: {
                1: {
                    4: function () {
                        if (!Game.World.Map.usedSpecialTiles[1][4]) Game.Events.computerRoomComputerEvent();
                        else Game.Display.Logs.add({
                            text: "There is nothing more to see in this computer."
                        });
                    }
                },
                7: {
                    7: function () {
                        Game.World.setCurrentMap("library");
                        Game.World.moveTo(7, 1, true);

                        Game.Display.Logs.add({
                            text: "Rows upon rows of bookshelves appear, covered with dust and cobwebs after years of abandonment."
                        });
                    }
                },
                13: {
                    1: function () {
                        Game.Engine.exitComputerRoom();
                    }
                }
            },
            dangerousTiles: {
                dangerMap: Array.apply(null, Array(9)).map(r => Array.apply(null, Array(15)).map(c => " ")),
                enemies: {}
            }
        },
        oldStreet: {
            name: "Old Street",
            map: [
                // 9 * 34
                "##################################".split(''),
                "#........N.......................#".split(''),
                "#...............................D#".split(''),
                "#................................#".split(''),
                "#...##############################".split(''),
                "#...#                             ".split(''),
                "#...#                             ".split(''),
                "#.D.#                             ".split(''),
                "#####                             ".split(''),
            ],
            uncovered: Array.apply(null, Array(9)).map(r => Array.apply(null, Array(34)).map(c => false)),
            usedSpecialTiles: {
                9: {
                    1: false
                }
            },
            unlockedDoors: {
                32: {
                    2: false
                }
            },
            tileEffects: {
                9: {
                    1: function () {
                        if (!Game.World.Map.usedSpecialTiles[9][1]) Game.Events.oldStreetPersonEvent();
                        else Game.Display.Logs.add({
                            text: "The girl looks back at you and says: \"I've told you everything I know already.\""
                        });
                    }
                },
                2: {
                    7: function () {
                        Game.World.setCurrentMap("computerRoom");
                        Game.World.moveTo(13, 1, true);

                        Game.Display.Logs.add({
                            text: "Piles of abandoned computer equipment, once blinking lights extinguished, once whirring disks silent."
                        });
                    }
                },
                32: {
                    2: function () {
                        Game.Engine.exitOldStreet();
                    }
                }
            },
            dangerousTiles: {
                dangerMap: Array.apply(null, Array(9)).map(r => Array.apply(null, Array(34)).map(c => " ")),
                enemies: {}
            }
        },
        pathToCity: {
            name: "Path to City",
            map: [
                // 13 * 30
                "#############".split(''),
                "#,,,,,D,,,,,#".split(''),
                "#,,,,,,,,,,,#".split(''),
                "#,,,,,,,,,,,#".split(''),
                "#,,,,,,,,,,,#".split(''),
                "#,,,,,,,,,,,#".split(''),
                "#,,,,,,,,,,,#".split(''),
                "#,,,,,,,,,,,#".split(''),
                "#,,,,,,,,,,,#".split(''),
                "#,,,,,,,,,,,#".split(''),
                "#,,,,,,,,,,,#".split(''),
                "#,,,,,,,,,,,#".split(''),
                "#,,,,,,,,,,,#".split(''),
                "#,,,,,,,,,,,#".split(''),
                "#,,,,,,,,,,,#".split(''),
                "#,,,,,,,,,,,#".split(''),
                "#,,,,,,,,,,,#".split(''),
                "#,,,,,,,,,,,#".split(''),
                "#,,,,,,,,,,,#".split(''),
                "#,,,,,,,,,,,#".split(''),
                "#,,,,,,,,,,,#".split(''),
                "#,,,,,,,,,,,#".split(''),
                "#,,,,,,,,,,,#".split(''),
                "#,,,,,,,,,,,#".split(''),
                "#,,,,,,,,,,,#".split(''),
                "#,,,,,,,,,,,#".split(''),
                "#,,,,,,,,,,,#".split(''),
                "#,,,,,,,,,,,#".split(''),
                "#,,,,,,,,,,,#".split(''),
                "#,,,,,,,,,,,#".split(''),
                "#,,,,,,,,,,,#".split(''),
                "#,,,,,,,,,,,#".split(''),
                "#,,,,,,,,,,,#".split(''),
                "#,,,,,D,,,,,#".split(''),
                "#############".split(''),
            ],
            uncovered: Array.apply(null, Array(35)).map(r => Array.apply(null, Array(13)).map(c => false)),
            usedSpecialTiles: {
            },
            unlockedDoors: {
                6: {
                    1: false,
                    28: false
                }
            },
            tileEffects: {
                6: {
                    1: function () {
                        Game.Engine.exitPathToCity();
                    },
                    33: function () {
                        Game.World.setCurrentMap("oldStreet");
                        Game.World.moveTo(32, 2, true);

                        Game.Display.Logs.add({
                            text: "An abandoned street, a lone person standing underneath a rusting streetlight as the wind batters the floor."
                        });
                    }
                },
            },
            dangerousTiles: {
                dangerMap: Array.apply(null, Array(35)).map(r => Array.apply(null, Array(13)).map(c => "#")),
                enemies: {
                    "#": {
                        enemies: [
                            {
                                enemyName: "Snake",
                                message: "A snake leaps from within the yellowed grass, fangs ready to draw blood.",
                                enemyHealth: 3,
                                enemyAttacks: {
                                    attack: {
                                        name: "bite",
                                        damage: 3,
                                        cooldown: 1,
                                        cooldownRemaining: 1,
                                        logMessage: function (damage, enemyName) {
                                            return "> " + enemyName + " bit you for " + damage + " damage.";
                                        },
                                        probability: 1
                                    },
                                    prepare: {
                                        name: "prepare",
                                        damage: 0,
                                        cooldown: 1,
                                        cooldownRemaining: 0,
                                        logMessage: function (damage, enemyName) {
                                            return "> The snake rears up, ready to strike.";
                                        },
                                        probability: 1
                                    }
                                },
                                loot: [
                                    {
                                        id: "meat",
                                        amount: function () {
                                            return Math.random() > 0.5 ? 2 : 1;
                                        }
                                    }
                                ],
                                onVictory: function () {
                                    console.log("Victory");
                                },
                                probability: 0.07
                            },
                            {
                                enemyName: "Fox",
                                message: "A fox snarls, defending its territory.",
                                enemyHealth: 5,
                                enemyAttacks: {
                                    attack: {
                                        name: "",
                                        damage: 1,
                                        cooldown: 0,
                                        cooldownRemaining: 0,
                                        logMessage: function (damage, enemyName) {
                                            return "> " + enemyName + " attacked you for " + damage + " damage.";
                                        },
                                        probability: 1
                                    }
                                },
                                loot: [
                                    {
                                        id: "meat",
                                        amount: function () {
                                            return Math.random() > 0.5 ? 1 : 0;
                                        }
                                    },
                                    {
                                        id: "fur",
                                        amount: function () {
                                            return Math.random() > 0.5 ? 2 : 1;
                                        }
                                    }
                                ],
                                onVictory: function () {
                                    console.log("Victory");
                                },
                                probability: 0.07
                            },
                            {
                                enemyName: "Lizard",
                                message: "A lizard spits out its forked tongue to attack.",
                                enemyHealth: 3,
                                enemyAttacks: {
                                    attack: {
                                        name: "Attack",
                                        damage: 2,
                                        cooldown: 0,
                                        cooldownRemaining: 0,
                                        logMessage: function (damage, enemyName) {
                                            return "> " + enemyName + " attacked you for " + damage + " damage.";
                                        },
                                        probability: 1
                                    }
                                },
                                loot: [
                                    {
                                        id: "meat",
                                        amount: function () {
                                            return Math.random() > 0.5 ? 1 : 0;
                                        }
                                    },
                                    {
                                        id: "wood",
                                        amount: function () {
                                            return Math.random() > 0.5 ? 2 : 1;
                                        }
                                    }
                                ],
                                onVictory: function () {
                                    console.log("Victory");
                                },
                                probability: 0.07
                            }
                        ]
                    }
                }
            }
        },
        entranceToCity: {
            name: "Entrance to City",
            map: [
                // 23 * 10
                "#######################".split(''),
                "#..........D..........#".split(''),
                "#.....................#".split(''),
                "#.....................#".split(''),
                "######,,,,,,,,,,,######".split(''),
                "     #,,,,,,,,,,,#     ".split(''),
                "     #,,,,,,,,,,,#     ".split(''),
                "     #,,,,,D,,,,,#     ".split(''),
                "     #############     ".split(''),
            ],
            uncovered: Array.apply(null, Array(10)).map(r => Array.apply(null, Array(23)).map(c => true)),
            usedSpecialTiles: {
            },
            unlockedDoors: {},
            tileEffects: {
                11: {
                    1: function () {
                        Game.Engine.exitEntranceToCity();
                    },
                    7: function () {
                        Game.World.setCurrentMap("pathToCity");
                        Game.World.moveTo(6, 1, true);

                        Game.Display.Logs.add({
                            text: "A long and dusty path, tread by only a daring few, the artificial night hiding dangers in the sea of dying grass."
                        });
                    }
                },
            },
            dangerousTiles: {
                dangerMap: Array.apply(null, Array(10)).map(r => Array.apply(null, Array(23)).map(c => " ")),
                enemies: {}
            }
        },
        cityCenter: {
            name: "City Center",
            map: [
                // 47 * 19
                "     #####################################     ".split(''),
                "     #.................B.................#     ".split(''),
                "     #...................................#     ".split(''),
                "     #...................................#     ".split(''),
                "     #.........N.........................#     ".split(''),
                "     #...................................#     ".split(''),
                "     #...................................#     ".split(''),
                "######...................................######".split(''),
                "#.............................................#".split(''),
                "#D...........................................D#".split(''),
                "#.............................................#".split(''),
                "######.....................B.............######".split(''),
                "     #...................................#     ".split(''),
                "     #...................................#     ".split(''),
                "     #B..................................#     ".split(''),
                "     #...................................#     ".split(''),
                "     #...................................#     ".split(''),
                "     #.................N..............B..#     ".split(''),
                "     #####################################     ".split(''),
            ],
            uncovered: Array.apply(null, Array(19)).map(r => Array.apply(null, Array(47)).map(c => false)),
            usedSpecialTiles: {
                6: {
                    14: false
                },
                15: {
                    4: false
                },
                23: {
                    1: false,
                    17: false
                },
                27: {
                    11: false
                },
                38: {
                    17: false
                }
            },
            unlockedDoors: {
            },
            tileEffects: {
                1: {
                    9: function () {
                        if (Game.Resources.ResourceData.find(r => r.id === "key").amount) {
                            Game.Display.Logs.add({
                                text: "Wrong door, the guards say. This is a permit to leave via the door on the opposite side."
                            });
                        } else {
                            Game.Display.Logs.add({
                                text: "The door is locked, and the guards do not let you out."
                            });
                        }
                    }
                },
                6: {
                    14: function () {
                        if (Game.World.Map.usedSpecialTiles[6][14]) return;

                        Game.World.Map.usedSpecialTiles[6][14] = true;

                        Game.Events.cityCenterBinEvent();
                    }
                },
                15: {
                    4: function () {
                        if (Game.World.Map.usedSpecialTiles[15][4]) {
                            Game.Display.Logs.add({
                                text: "The teenager, objective complete and your piece of iron in hand, ignores you."
                            });
                        } else {
                            if (Game.Resources.ResourceData.find(r => r.id === "iron").amount > 1) {
                                Game.Events.cityCenterTeenagerEvent();
                            } else {
                                Game.Display.Logs.add({
                                    text: "The teenager, self-conceited as they all are, simply ignores you."
                                });
                            }
                        }
                    }
                },
                23: {
                    1: function () {
                        if (Game.World.Map.usedSpecialTiles[23][1]) return;

                        Game.World.Map.usedSpecialTiles[23][1] = true;

                        Game.Events.cityCenterBinEvent();
                    },
                    17: function () {
                        if (Game.World.Map.usedSpecialTiles[23][17]) {
                            Game.Display.Logs.add({
                                text: "Business done, the permit dealer ignores you."
                            });
                        } else {
                            if (Game.Resources.ResourceData.find(r => r.id === "virbuck").amount) {
                                Game.Events.cityCenterPermitDealerEvent();
                            } else {
                                Game.Display.Logs.add({
                                    text: "The permit dealer is happy to give you a permit to exit this place, well at least if you pay the money first."
                                });
                            }
                        }
                    }
                },
                27: {
                    11: function () {
                        if (Game.World.Map.usedSpecialTiles[27][11]) return;

                        Game.World.Map.usedSpecialTiles[27][11] = true;

                        Game.Events.cityCenterBinEvent();
                    }
                },
                38: {
                    17: function () {
                        if (Game.World.Maps.cityCenter.usedSpecialTiles[38][17]) return;

                        Game.World.Maps.cityCenter.usedSpecialTiles[38][17] = true;

                        Game.Events.cityCenterBinEvent();
                    }
                },
                45: {
                    9: function () {
                        if (Game.Resources.ResourceData.find(r => r.id === "key").amount) {
                            Game.Events.cityCenterExitEvent();
                        } else {
                            Game.Display.Logs.add({
                                text: "The guards raise their weapons. The Shades are out there, they say. You will need a permit to get out, which can be purchased from the permit dealer at a price."
                            });
                        }
                    }
                },
            },
            dangerousTiles: {
                dangerMap: Array.apply(null, Array(19)).map(r => Array.apply(null, Array(47)).map(c => " ")),
                enemies: {}
            }
        },
        leaveCityPath: {
            name: "Leave City Path",
            map: [
                // 33 * 45
                "#########                        ".split(''),
                "#,,,D,,,#                        ".split(''),
                "#,,,,,,,#                        ".split(''),
                "#,,,,,,,#                        ".split(''),
                "#,,,,,,,#                        ".split(''),
                "#,,,,,,,#                        ".split(''),
                "#,,,,,,,#                        ".split(''),
                "#,,,,,,,#                        ".split(''),
                "#,,,,,,,#                        ".split(''),
                "#,,,,,,,#                        ".split(''),
                "#,,,,,,,#                        ".split(''),
                "#,,,,,,,#########################".split(''),
                "#,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,#".split(''),
                "#,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,#".split(''),
                "#,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,#".split(''),
                "#,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,#".split(''),
                "#,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,#".split(''),
                "#,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,#".split(''),
                "#,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,#".split(''),
                "#########################,,,,,,,#".split(''),
                "                        #,,,,,,,#".split(''),
                "                        #,,,,,,,#".split(''),
                "                        #,,,,,,,#".split(''),
                "                        #,,,,,,,#".split(''),
                "                        #,,,,,,,#".split(''),
                "                        #,,,,,,,#".split(''),
                "#########################,,,,,,,#".split(''),
                "#,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,#".split(''),
                "#,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,#".split(''),
                "#,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,#".split(''),
                "#,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,#".split(''),
                "#,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,#".split(''),
                "#,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,#".split(''),
                "#,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,#".split(''),
                "#,,,,,,,#########################".split(''),
                "#,,,,,,,#                        ".split(''),
                "#,,,,,,,#                        ".split(''),
                "#,,,,,,,#                        ".split(''),
                "#,,,,,,,#                        ".split(''),
                "#,,,,,,,#                        ".split(''),
                "#,,,,,,,#                        ".split(''),
                "#,,,,,,,#                        ".split(''),
                "#,,,,,,,#                        ".split(''),
                "#,,,D,,,#                        ".split(''),
                "#########                        ".split(''),
            ],
            uncovered: Array.apply(null, Array(45)).map(r => Array.apply(null, Array(33)).map(c => true)),
            usedSpecialTiles: {
            },
            unlockedDoors: {
                4: {
                    1: false,
                    43: false
                }
            },
            tileEffects: {
                4: {
                    43: function () {
                        Game.Display.Logs.add({
                            text: "The steel gate is locked, and the guards do not let you back in."
                        });
                    },
                    1: function () {
                        Game.Engine.exitLeaveCityPath();
                    }
                },
            },
            dangerousTiles: {
                dangerMap: Array.apply(null, Array(45)).map(r => Array.apply(null, Array(33)).map(c => "#")),
                enemies: {
                    "#": {
                        enemies: [
                            {
                                enemyName: "Wolf",
                                message: "A wolf pounces from the shadows.",
                                enemyHealth: 5,
                                enemyAttacks: {
                                    attack: {
                                        name: "bite",
                                        damage: 2,
                                        cooldown: 0,
                                        cooldownRemaining: 0,
                                        logMessage: function (damage, enemyName) {
                                            return "> " + enemyName + " bit you for " + damage + " damage.";
                                        },
                                        probability: 1
                                    },
                                },
                                loot: [
                                    {
                                        id: "meat",
                                        amount: function () {
                                            return Math.random() > 0.5 ? 2 : 1;
                                        }
                                    },
                                    {
                                        id: "fur",
                                        amount: function () {
                                            return Math.random() > 0.5 ? 3 : 2;
                                        }
                                    },
                                    {
                                        id: "iron",
                                        amount: function () {
                                            return Math.random() > 0.5 ? 1 : 0;
                                        }
                                    }
                                ],
                                onVictory: function () {
                                    console.log("Victory");
                                },
                                probability: 0.03
                            },
                            {
                                enemyName: "Giant Lizard",
                                message: "A giant lizard covered with spiny scales attacks.",
                                enemyHealth: 10,
                                enemyAttacks: {
                                    attack: {
                                        name: "attack",
                                        damage: 1,
                                        cooldown: 0,
                                        cooldownRemaining: 0,
                                        logMessage: function (damage, enemyName) {
                                            return "> " + enemyName + " attacked you for " + damage + " damage.";
                                        },
                                        probability: 1
                                    }
                                },
                                loot: [
                                    {
                                        id: "meat",
                                        amount: function () {
                                            return Math.random() > 0.5 ? 2 : 1;
                                        }
                                    },
                                    {
                                        id: "wood",
                                        amount: function () {
                                            return Math.random() > 0.5 ? 3 : 2;
                                        }
                                    },
                                    {
                                        id: "iron",
                                        amount: function () {
                                            return Math.random() > 0.5 ? 1 : 0;
                                        }
                                    }
                                ],
                                onVictory: function () {
                                    console.log("Victory");
                                },
                                probability: 0.03
                            },
                            {
                                enemyName: "Bird",
                                message: "A strange bird armed with a sharp beak approaches.",
                                enemyHealth: 5,
                                enemyAttacks: {
                                    attack: {
                                        name: "attack",
                                        damage: 4,
                                        cooldown: 1,
                                        cooldownRemaining: 1,
                                        logMessage: function (damage, enemyName) {
                                            return "> " + enemyName + " pecked you for " + damage + " damage.";
                                        },
                                        probability: 1
                                    },
                                    prepare: {
                                        name: "prepare",
                                        damage: 0,
                                        cooldown: 1,
                                        cooldownRemaining: 0,
                                        logMessage: function (damage, enemyName) {
                                            return "> " + enemyName + " prepares to strike.";
                                        },
                                        probability: 1
                                    }
                                },
                                loot: [
                                    {
                                        id: "meat",
                                        amount: function () {
                                            return Math.random() > 0.5 ? 2 : 1;
                                        }
                                    },
                                    {
                                        id: "string",
                                        amount: function () {
                                            return 1;
                                        }
                                    },
                                    {
                                        id: "iron",
                                        amount: function () {
                                            return Math.random() > 0.5 ? 1 : 0;
                                        }
                                    }
                                ],
                                onVictory: function () {
                                    console.log("Victory");
                                },
                                probability: 0.03
                            }
                        ]
                    }
                }
            }
        },
        entranceToShadeHeadquarters: {
            name: "Entrance to Shade Headquarters",
            map: [
                // 23 * 12
                "#######################".split(''),
                "#,,,,,,,...D...,,,,,,,#".split(''),
                "#,,,,,,,,.....,,,,,,,,#".split(''),
                "#,,,,,,,,,,.,,,,,,,,,,#".split(''),
                "#,,,,,,,,,,,,,,,,,,,,,#".split(''),
                "#,,,,,,,,,,,,,,,,,,,,,#".split(''),
                "#,,,,,,,,,,,,,,,,,,,,,#".split(''),
                "######,,,,,,,,,,,######".split(''),
                "     #,,,,,,,,,,,#     ".split(''),
                "     #,,,,,,,,,,,#     ".split(''),
                "     #,,,,,D,,,,,#     ".split(''),
                "     #############     ".split(''),
            ],
            uncovered: Array.apply(null, Array(12)).map(r => Array.apply(null, Array(23)).map(c => false)),
            usedSpecialTiles: {
            },
            unlockedDoors: {},
            tileEffects: {
                11: {
                    1: function () {
                        Game.Engine.exitEntranceToShadeHeadquarters();
                    },
                    10: function () {
                        Game.World.setCurrentMap("leaveCityPath");
                        Game.World.moveTo(4, 1, true);
                        Game.Display.Logs.add({
                            text: "The cold winter winds scour the land. A long and winding path stretches out, enemies lurking in the long grass."
                        });
                    }
                }
            },
            dangerousTiles: {
                dangerMap: Array.apply(null, Array(12)).map(r => Array.apply(null, Array(23)).map(c => " ")),
                enemies: {}
            }
        },
        shadeHeadquarters: {
            name: "Shade Headquarters",
            map: [
                // 33 * 51
                "#################################".split(''),
                "#...............................#".split(''),
                "#...............................#".split(''),
                "#...............................#".split(''),
                "#D..............................#".split(''),
                "#...............................#".split(''),
                "#...............................#".split(''),
                "#...............................#".split(''),
                "#########################.......#".split(''),
                "                        #.......#".split(''),
                "                        #.......#".split(''),
                "                        #.......#".split(''),
                "                        #.......#".split(''),
                "                        #.......#".split(''),
                "                        #.......#".split(''),
                "                        #.......#".split(''),
                "                        #.......#".split(''),
                "#########################.......#".split(''),
                "#...............................#".split(''),
                "#...............................#".split(''),
                "#...............................#".split(''),
                "#...............................#".split(''),
                "#...............................#".split(''),
                "#...............................#".split(''),
                "#...............................#".split(''),
                "#.......#########################".split(''),
                "#.......#                        ".split(''),
                "#.......#                        ".split(''),
                "#.......#                        ".split(''),
                "#.......#                        ".split(''),
                "#.......#                        ".split(''),
                "#.......#                        ".split(''),
                "#.......#########################".split(''),
                "#...............................#".split(''),
                "#...............................#".split(''),
                "#...............................#".split(''),
                "#...............................#".split(''),
                "#...............................#".split(''),
                "#...............................#".split(''),
                "#...............................#".split(''),
                "#########################.......#".split(''),
                "                        #.......#".split(''),
                "                        #.......#".split(''),
                "                        #.......#".split(''),
                "                        #.......#".split(''),
                "                        #.......#".split(''),
                "                        #.......#".split(''),
                "                        #.......#".split(''),
                "                        #.......#".split(''),
                "                        #...D...#".split(''),
                "                        #########".split(''),
            ],
            uncovered: Array.apply(null, Array(51)).map(r => Array.apply(null, Array(33)).map(c => false)),
            usedSpecialTiles: {
            },
            unlockedDoors: {
                1: {
                    4: false
                },
                28: {
                    49: false
                }
            },
            tileEffects: {
                1: {
                    4: function () {
                        Game.Engine.exitShadeHeadquarters();
                    },
                },
                28: {
                    49: function () {
                        Game.Display.Logs.add({
                            text: "The alloy door is shut. The only way to go is forward."
                        });
                    }
                }
            },
            dangerousTiles: {
                dangerMap: Array.apply(null, Array(51)).map(r => Array.apply(null, Array(33)).map(c => "#")),
                enemies: {
                    "#": {
                        enemies: [
                            {
                                enemyName: "Shade Bot",
                                message: "A Shade bot, armed with a sharp spinning blade, walks up to you.",
                                enemyHealth: 25,
                                enemyAttacks: {
                                    attack: {
                                        name: "slash",
                                        damage: 3,
                                        cooldown: 0,
                                        cooldownRemaining: 0,
                                        logMessage: function (damage, enemyName) {
                                            return "> " + enemyName + " slashed you for " + damage + " damage.";
                                        },
                                        probability: 1
                                    },
                                },
                                loot: [
                                    {
                                        id: "alloy",
                                        amount: function () {
                                            return Math.random() > 0.5 ? 2 : 1;
                                        }
                                    },
                                    {
                                        id: "iron",
                                        amount: function () {
                                            return Math.random() > 0.5 ? 3 : 2;
                                        }
                                    }
                                ],
                                onVictory: function () {
                                    console.log("Victory");
                                },
                                probability: 0.04
                            },
                            {
                                enemyName: "Shade Bot",
                                message: "A Shade bot, armed with a powerful red laser, walks up to you.",
                                enemyHealth: 20,
                                enemyAttacks: {
                                    attack: {
                                        name: "attack",
                                        damage: 7,
                                        cooldown: 2,
                                        cooldownRemaining: 2,
                                        logMessage: function (damage, enemyName) {
                                            return "> " + enemyName + " laser beamed you for " + damage + " damage.";
                                        },
                                        probability: 1
                                    },
                                    prepare: {
                                        name: "prepare",
                                        damage: 0,
                                        cooldown: 2,
                                        cooldownRemaining: 0,
                                        logMessage: function (damage, enemyName) {
                                            return "> " + enemyName + " raises its laser for another blow.";
                                        },
                                        probability: 1
                                    },
                                    prepare2: {
                                        name: "prepare",
                                        damage: 0,
                                        cooldown: 2,
                                        cooldownRemaining: 1,
                                        logMessage: function (damage, enemyName) {
                                            return "> " + enemyName + "'s laser glows red with energy.";
                                        },
                                        probability: 1
                                    },
                                },
                                loot: [
                                    {
                                        id: "alloy",
                                        amount: function () {
                                            return Math.random() > 0.5 ? 2 : 1;
                                        }
                                    },
                                    {
                                        id: "iron",
                                        amount: function () {
                                            return Math.random() > 0.5 ? 3 : 2;
                                        }
                                    }
                                ],
                                onVictory: function () {
                                    console.log("Victory");
                                },
                                probability: 0.04
                            },
                            {
                                enemyName: "Shade Bot",
                                message: "A Shade bot, armed with a big iron shield, walks up to you.",
                                enemyHealth: 40,
                                enemyAttacks: {
                                    attack: {
                                        name: "attack",
                                        damage: 1,
                                        cooldown: 0,
                                        cooldownRemaining: 0,
                                        logMessage: function (damage, enemyName) {
                                            return "> " + enemyName + " smashed you for " + damage + " damage.";
                                        },
                                        probability: 1
                                    }
                                },
                                loot: [
                                    {
                                        id: "alloy",
                                        amount: function () {
                                            return Math.random() > 0.5 ? 2 : 1;
                                        }
                                    },
                                    {
                                        id: "iron",
                                        amount: function () {
                                            return Math.random() > 0.5 ? 3 : 2;
                                        }
                                    }
                                ],
                                onVictory: function () {
                                    console.log("Victory");
                                },
                                probability: 0.03
                            }
                        ]
                    }
                }
            }
        },
        pathfinder: {
            name: "The Pathfinder",
            map: [
                // 21 * 9
                "#####################".split(''),
                "#...................#".split(''),
                "#...................#".split(''),
                "#...................#".split(''),
                "#.........F.........#".split(''),
                "#...................#".split(''),
                "#...................#".split(''),
                "#..................D#".split(''),
                "#####################".split(''),
            ],
            uncovered: Array.apply(null, Array(9)).map(r => Array.apply(null, Array(21)).map(c => false)),
            usedSpecialTiles: {
            },
            unlockedDoors: {
            },
            tileEffects: {
                10: {
                    4: function () {
                        Game.Engine.pathfinder();
                    }
                },
                19: {
                    7: function () {
                        Game.World.setCurrentMap("shadeHeadquarters");
                        Game.World.moveTo(1, 4, true);
                        Game.Display.Logs.add({
                            text: "Shattered Shade robots lie on the stone floor, defeated and banished from their own headquarters. Only a few robots remain."
                        });
                    },
                },
            },
            dangerousTiles: {
                dangerMap: Array.apply(null, Array(9)).map(r => Array.apply(null, Array(21)).map(c => " ")),
                enemies: {}
            }
        },
        end: {
            name: "The End",
            map: [
                // 5 * 5
                "#####".split(''),
                "#...#".split(''),
                "#.S.#".split(''),
                "#...#".split(''),
                "#####".split(''),
            ],
            uncovered: Array.apply(null, Array(5)).map(r => Array.apply(null, Array(5)).map(c => true)),
            usedSpecialTiles: {
            },
            unlockedDoors: {
            },
            tileEffects: {
            },
            dangerousTiles: {
                dangerMap: Array.apply(null, Array(5)).map(r => Array.apply(null, Array(5)).map(c => " ")),
                enemies: {}
            }
        },
    };

    Player = {
        Position: {
            x: 0,
            y: 0
        },
        health: 10
    };

    computeMaxHealth() {
        let health = 10;
        if (Game.Resources.ResourceData.find(r => r.id === "furarmour").amount) health += 5;
        if (Game.Resources.ResourceData.find(r => r.id === "ironarmour").amount) health += 15;
        if (Game.Resources.ResourceData.find(r => r.id === "alloyarmour").amount) health += 20;

        return health;
    }

    computeViewDistance() {
        let distance = 4;
        if (Game.Resources.ResourceData.find(r => r.id === "torch").amount) distance += 1;

        return distance;
    }

    setCurrentMap(map) {
        if (this.Map.name) {
            this.Maps[this.Map.name].uncovered = this.Map.uncovered;
            this.Maps[this.Map.name].usedSpecialTiles = this.Map.usedSpecialTiles;
        }
        this.Map.map = this.Maps[map].map;
        this.Map.name = map;
        this.Map.tileEffects = this.Maps[map].tileEffects;
        this.Map.uncovered = this.Maps[map].uncovered;
        this.Map.usedSpecialTiles = this.Maps[map].usedSpecialTiles;
        this.Map.unlockedDoors = this.Maps[map].unlockedDoors;
        this.Map.dangerousTiles = this.Maps[map].dangerousTiles;
        // let spawnLocation = { x: 0, y: 0 };
        // let found = false;
        // for (let y in this.Map.map) {
        //     for (let x in this.Map.map[y]) {
        //         if (this.Map.map[y][x] === this.Tiles.SPAWN) {
        //             spawnLocation = { x: Number(x), y: Number(y) };
        //             found = true;
        //             break;
        //         }
        //     }
        //     if (found) break;
        // }
        // this.moveTo(spawnLocation.x, spawnLocation.y);
        this.render();
    }

    uncoverTiles() {
        let viewDistance = this.computeViewDistance();

        this.Map.uncovered[this.Player.Position.y][this.Player.Position.x] = true;

        let previousNodes = [{
            x: this.Player.Position.x,
            y: this.Player.Position.y
        }];

        for (let i = 1; i <= viewDistance; i++) {
            let newNodes = [];
            for (let n of previousNodes) {
                if (n.y - 1 >= 0) {
                    this.Map.uncovered[n.y - 1][n.x] = true;
                    newNodes.push({
                        x: n.x,
                        y: n.y - 1
                    });
                }
                if (n.x - 1 >= 0) {
                    newNodes.push({
                        x: n.x - 1,
                        y: n.y
                    });
                    this.Map.uncovered[n.y][n.x - 1] = true;
                }
                if (n.x + 1 < this.Map.map[0].length) {
                    newNodes.push({
                        x: n.x + 1,
                        y: n.y
                    });
                    this.Map.uncovered[n.y][n.x + 1] = true;
                }
                if (n.y + 1 < this.Map.map.length) {
                    this.Map.uncovered[n.y + 1][n.x] = true;
                    newNodes.push({
                        x: n.x,
                        y: n.y + 1
                    });
                }
            }
            previousNodes = newNodes;
        }
    }

    moveUp() {
        this.Player.Position.y--;
        this.uncoverTiles();
        this.runTileEffect();
        this.tileMessage();
        this.dangerousTile();
        this.render();
    }

    moveDown() {
        this.Player.Position.y++;
        this.uncoverTiles();
        this.runTileEffect();
        this.tileMessage();
        this.dangerousTile();
        this.render();
    }

    moveLeft() {
        this.Player.Position.x--;
        this.uncoverTiles();
        this.runTileEffect();
        this.tileMessage();
        this.dangerousTile();
        this.render();
    }

    moveRight() {
        this.Player.Position.x++;
        this.uncoverTiles();
        this.runTileEffect();
        this.tileMessage();
        this.dangerousTile();
        this.render();
    }

    moveTo(x, y, suppressTileEffect = false) {
        this.Player.Position.x = x;
        this.Player.Position.y = y;
        this.uncoverTiles();
        if (!suppressTileEffect) this.runTileEffect();
        if (!suppressTileEffect) this.tileMessage();
        if (!suppressTileEffect) this.dangerousTile();
        this.render();
    }

    collisionDetect(x, y) {
        switch (this.Map.map[y][x]) {
            case this.Tiles.WALL:
                return true;
            default:
                return false;
        }
    }

    dangerousTile() {
        if (
            this.Map.dangerousTiles.dangerMap[this.Player.Position.y][this.Player.Position.x] === " "
            || (this.Map.usedSpecialTiles[this.Player.Position.x] !== undefined && this.Map.usedSpecialTiles[this.Player.Position.x][this.Player.Position.y] !== undefined)
            || (this.Map.unlockedDoors[this.Player.Position.x] !== undefined && this.Map.unlockedDoors[this.Player.Position.x][this.Player.Position.y] !== undefined)
        ) return;

        const enemies = this.Map.dangerousTiles.enemies[this.Map.dangerousTiles.dangerMap[this.Player.Position.y][this.Player.Position.x]].enemies;

        let rand = Math.random();

        let chosenEnemy = null;

        for (let e in enemies) {
            if (rand > enemies[e].probability) {
                rand -= enemies[e].probability;
            } else {
                chosenEnemy = enemies[e];
                break;
            }
        }

        if (chosenEnemy === null) return;

        Game.Display.Logs.add({
            text: chosenEnemy.message
        });

        Game.Events.createCombatEvent({
            enemyName: chosenEnemy.enemyName,
            enemyHealth: chosenEnemy.enemyHealth,
            enemyAttacks: chosenEnemy.enemyAttacks,
            chainEvent: true,
            onVictory: function () {
                chosenEnemy.onVictory();
            },
            onEnd: function () {
                let loot = [];

                for (let i in chosenEnemy.loot) {
                    let amount = chosenEnemy.loot[i].amount();
                    if (amount) loot.push({
                        id: chosenEnemy.loot[i].id,
                        amount
                    })
                }

                Game.Events.createItemPickupEvent({
                    name: "Loot " + chosenEnemy.enemyName,
                    description: chosenEnemy.enemyName + " is dead. You could use some of the resources for yourself.",
                    items: loot
                });
            }
        });
    }

    runTileEffect() {
        if (this.Map.tileEffects[this.Player.Position.x] && this.Map.tileEffects[this.Player.Position.x][this.Player.Position.y]) this.Map.tileEffects[this.Player.Position.x][this.Player.Position.y]();
    }

    tileMessage() {
        if (this.Map.map[this.Player.Position.y][this.Player.Position.x] !== this.lastTile) {
            let currentTile = this.Map.map[this.Player.Position.y][this.Player.Position.x];

            if (currentTile === this.Tiles.STONE_FLOOR) {
                Game.Display.Logs.add({
                    text: "The cold stone floor shines a dull, unforgiving gray."
                });
            } else if (currentTile === this.Tiles.WOODEN_PLANK) {
                Game.Display.Logs.add({
                    text: "The aged wooden planks creaks with every step."
                });
            } else if (currentTile === this.Tiles.WOODEN_PLANK) {
                Game.Display.Logs.add({
                    text: "The dried grass, yellowed and dying, sways in the gentle breeze."
                });
            } else if (currentTile === this.Tiles.PATHFINDER) {
                Game.Display.Logs.add({
                    text: "You step into the Pathfinder. The strange, mysterious technology lies dormant."
                });
            }

            this.lastTile = currentTile;
        }
        if (this.Map.dangerousTiles.dangerMap[this.Player.Position.y][this.Player.Position.x] !== this.lastDangerTile) {
            let currentDangerTile = this.Map.dangerousTiles.dangerMap[this.Player.Position.y][this.Player.Position.x];
            this.lastDangerTile = currentDangerTile;
            if (currentDangerTile === " ") return;

            Game.Display.Logs.add({
                text: "You sense unseen danger lurking in the shadows, ready to strike at the most unexpected."
            });
        }
    }

    render() {
        this.mapString = "";
        let boldedTiles = false;
        if (this.Map.map.length < 50) this.mapString += "<br/>".repeat(Math.ceil((50 - this.Map.map.length) / 2));

        function boldTile() {
            if (!boldedTiles) {
                Game.World.mapString += "<span class=\"text-black\">";
                boldedTiles = true;
            }
        }

        function unboldTile() {
            if (boldedTiles) {
                boldedTiles = false;
                Game.World.mapString += "</span>";
            }
        }

        for (let i in this.Map.map) {
            for (let j in this.Map.map[i]) {
                if (Number(i) === this.Player.Position.y && Number(j) === this.Player.Position.x) {
                    this.mapString += "<span class=\"text-black\"><b>@</b></span>";
                    continue;
                }
                if (this.Map.uncovered[i][j]) {
                    switch (this.Map.map[i][j]) {
                        case this.Tiles.STONE_FLOOR:
                            unboldTile();
                            this.mapString += this.Tiles.STONE_FLOOR;
                            break;
                        case this.Tiles.WOODEN_PLANK:
                            unboldTile();
                            this.mapString += this.Tiles.WOODEN_PLANK;
                            break;
                        case this.Tiles.GRASS:
                            unboldTile();
                            this.mapString += this.Tiles.GRASS;
                            break;
                        case this.Tiles.WALL:
                            boldTile();
                            this.mapString += this.Tiles.WALL;
                            break;
                        case this.Tiles.DOOR:
                            boldTile();
                            this.mapString += this.Tiles.DOOR;
                            break;
                        case this.Tiles.SPAWN:
                            boldTile();
                            this.mapString += this.Tiles.SPAWN;
                            break;
                        case this.Tiles.ITEM:
                            if (this.Map.usedSpecialTiles[j][i]) {
                                unboldTile();
                            } else {
                                boldTile();
                            }
                            this.mapString += this.Tiles.ITEM;
                            break;
                        case this.Tiles.BOX:
                            if (this.Map.usedSpecialTiles[j][i]) {
                                unboldTile();
                            } else {
                                boldTile();
                            }
                            this.mapString += this.Tiles.BOX;
                            break;
                        case this.Tiles.PERSON:
                            if (this.Map.usedSpecialTiles[j][i]) {
                                unboldTile();
                            } else {
                                boldTile();
                            }
                            this.mapString += this.Tiles.PERSON;
                            break;
                        case this.Tiles.PATHFINDER:
                            boldTile();
                            this.mapString += this.Tiles.PATHFINDER;
                            break;
                        case this.Tiles.PATH:
                            unboldTile();
                            this.mapString += this.Tiles.PATH;
                            break;
                        case this.Tiles.WHITESPACE:
                            unboldTile();
                            this.mapString += "&nbsp;";
                            break;
                        default:
                            console.log("Unknown tile, probably typo");
                    }
                } else {
                    if (boldedTiles) {
                        boldedTiles = false;
                        this.mapString += "</span>";
                    }
                    this.mapString += "&nbsp;";
                }
            }
            this.mapString += "<br/>";
        }
        if (this.Map.map.length < 50) this.mapString += "<br/>".repeat(Math.floor((50 - this.Map.map.length) / 2));
        Game.Renderer.updateMap();
    }
}