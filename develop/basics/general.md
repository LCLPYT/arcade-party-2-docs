---
outline: deep
---

# General information
Arcade Party 2 is a game mode for Minecraft: Java Edition utilizing the [mg-api game toolkit](https://github.com/LCLPYT/mg-lobby).
It is the successor to the original Arcade Party game mode, developed in 2017 by LCLP as a SpigotMC plugin.
The new version is vastly more robust and scalable, featuring a huge library of minigames.

## Overall Goal
The goal of Arcade Party 2 is to provide a fun experience for everyone.
At it's core, Arcade Party consist of a lot of small minigames (Spleef, One in the chamber, Jump and Run ...).

In the default configuration, players get points depending on how good they rank in each minigame.
When someone reaches a score of 30 or higher, they win.

The codebase, however, was built to allow other game mode variations as well.
For example, a Mario-Party-like board game will be added as an alternative to the score system in the future.

An additional goal of the project is to stay vanilla Minecraft compatible.
Everybody should be able to join the server and play Arcade Party 2, regardless of their client.
Nonetheless, it is recommended to play with the provided [Minigame Modpack](https://modrinth.com/modpack/lclps-minigame-pack) for the best player experience.

## Codebase
Arcade Party 2 is written in Kotlin and Java.
The project started with just using Java in 2023, but started migrating to Kotlin in 2025.
As of the time of writing, the majority of the codebase is now written in Kotlin.

The codebase is orchestrated using Gradle.
Each minigame has its own Gradle subproject, isolating the minigames from each others code.
Additionally, there is a subproject `lib` for shared code between the minigames.
Finally, there is a subproject for each of the "modes" (scoring system / board-game variation).

### Dependencies
The game depends on various other libraries, adhering to a modular design.
Most notably, the following libraries are used:
- [mg-api and mg-lobby](https://github.com/LCLPYT/mg-lobby) - the game toolkit and game runtime
- [kibu](https://github.com/LCLPYT/kibu) - general modding library providing hooks, schedulers etc.
- [gaco](https://github.com/LCLPYT/gaco) - game commons for development of mg-api games
- [fantasy](https://github.com/NucleoidMC/fantasy) - third party mod introducing dimension loading at runtime
- [kibu-world-api](https://github.com/LCLPYT/kibu-world-api) - extension for fantasy allowing to load persisted worlds
- [map-canvas-api](https://github.com/Patbox/map-canvas-api) - third party mod for displaying images in-game using map items
- [fabric-api](https://github.com/FabricMC/fabric-api) - general modding library for developing for the Fabric modloader
- [combat-control](https://github.com/LCLPYT/combat-control) - mod to reintroduce classic Minecraft combat.
- [notica](https://github.com/LCLPYT/notica) - mod for playing high-quality note block music

Other dependencies can be found in the arcade-party-2 repo in `gradle/libs.versions.toml`.