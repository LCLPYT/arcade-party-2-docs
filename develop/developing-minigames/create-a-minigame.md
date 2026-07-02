---
outline: deep
---

# Create a minigame
This teaches you what steps you need to follow in order to add a new [minigame](/develop/basics/minigames.md).

> **Note**: There is a [Python script](/develop/developing-minigames/minigame-setup-script.md) available that automates the setup process described in this chapter.
> It is still recommended to read this chapter in order to get a better understanding on how minigames work.

## Setting up a new minigame manually
In the following, the placeholder `<your_minigame>` represents the id of the minigame you want to implement.
When implementing this, replace the placeholder with your desired minigame id in the appropriate case.

For example, if you want to create a minigame named "Bow Spleef":
- `<your_minigame>` -> `bow_spleef`
- `<YourMinigame>` -> `BowSpleef`

### Creating a Gradle subproject
First, you'll need a new Gradle subproject.
For that, just create a new directory `src/minigames/<your_minigame>`.

Second, create a minimal buildscript file `src/minigames/<your_minigame>/build.gradle.kts`:
```
plugins {
    alias(libs.plugins.kotlin.jvm)
}
```

This configures the new subproject to use Kotlin.
You could also use other JVM languages, such as Java, Scala or Groovy, however this projects tries to target Kotlin as main language.

Finally, register your minigame in `settings.gradle`:
```
def minigames = [
    ...
    "<your_minigame>"
]
```

If you refresh the Gradle project with IntelliJ, everything should now be set up.

### Creating the minigame class
The minigame class serves as an identifier for your minigame.
It provides some information about the id of your minigame, when it can be played and how it is created.

At this point, you should consider if your minigame should use [prebuilt maps](/develop/basics/terminology.md#maps--game-maps) or if it should be played on randomly generated worlds.
For this guide, let's assume you want to use maps.
If you want to implement a minigame without maps, please read [this chapter](/develop/developing-minigames/minigames-without-maps.md).

Create the directory `src/minigames/<your_minigame>/src/main/kotlin/work/lclpnet/ap2/<your_game>`.
In that directory, create a Kotlin class `<YourMinigame>MiniGame` with the following content:

```kotlin
package work.lclpnet.ap2.<your_minigame>

class <YourMinigame>MiniGame : MiniGame {
    override val id = ApConstants.identifier("<your_minigame>")
    override val type = GameType.FFA
    override val author = ApConstants.PERSON_<...your name constant>
    override fun getIcon(manager: RegistryAccess): ItemStack = ItemStack(Items.WOODEN_SWORD)
    override fun canBeFinale(context: GameStartContext): Boolean = true
    override fun canBePlayed(context: GameStartContext): Boolean = true
    override fun createFactory(): MiniGameFactory = MapLevelGameFactory(::<YourMinigame>Instance)
}
```

The id should be unique among all minigames and should match the package name.

The type determines classifies if the minigame is free-for-all if it is a team game.
This is used by the [game mode](/develop/basics/terminology.md#arcade-party-mode) to determine which games are played.

The author is a reference to a person using the [configuration data container](/develop/misc/configuration-data-container.md) and is used to credit the developer when the game is announced.
If you don't have a name constant yet, create one for yourself.
You can either just hardcode your name as string, or use a reference (denoted with an `@` symbol followed by a key to look up in `configuration.json`).

The icon is shown in the minigame voting screen, as well as in the admin minigame picker.

`canBeFinale()` determines if this game can be played as the final round of a party in case of a draw.
Minigames returning true from this function are required to determine a definite ranking of players. I.e. only one player can win.

`canBePlayed()` determines if a minigame can be started at a given time.
This can be used, for example, to impose player count constraints, e.g. for team games.

Finally, the `createFactory()` function creates a [minigame factory](/develop/basics/minigames.md#minigamefactory) that is used to create an [instance](/develop/basics/minigames.md#minigameinstance-class) of the game.
In this case, the most commonly used shared factory is used: `MapLevelGameFactory`.
This predefined factory chooses a random available map and creates a Minecraft level (aka world / dimension) for it.
The factory needs a function argument that actually creates the minigame instance, given the level and map (in this case the shorthand `::<YourMinigame>Instance` does the job).

Currently, the `<YourMinigame>Instance` class doesn't exist yet, but we'll create it soon.

### Create a Fabric entrypoint with `fabric.mod.json`
Minigames are discovered using [Fabric entrypoints](https://docs.fabricmc.net/develop/loader/fabric-mod-json#entrypoints).
To register an entrypoint for the minigame, create one in `src/minigames/<your_minigame>/src/main/resources/fabric.mod.json`:
```json
{
  "schemaVersion": 1,
  "id": "ap2-minigame-<your-minigame>",
  "version": "${version}",
  "authors": [
    "<your name>"
  ],
  "license": "MIT",
  "environment": "server",
  "entrypoints": {
    "ap2:minigame": [
      {
        "adapter": "kotlin",
        "value": "work.lclpnet.ap2.<your_minigame>.<YourMinigame>MiniGame"
      }
    ]
  },
  "depends": {
    "ap2-lib": "*",
    "fabric-language-kotlin": "*"
  },
  "custom": {
    "timestamp": <current unix timestamp in seconds>,
    "modmenu": {
      "parent": "ap2-minigames"
    }
  }
}
```

As you can see, the `<YourMinigame>MiniGame` class that was just created is registered as an entrypoint for `ap2:minigame`.

The `timestamp` property under `custom` should be a unix timestamp in seconds.
It is used to sort the minigame in the minigame list when sorting by date.

If you are on Linux / macOS, you can obtain the current unix time using:
```bash
date +%s
```

Otherwise, you can also use [this website](https://www.unixtimestamp.com/).

### Create the minigame instance class

The minigame instance class is the place where your game logic lives.
Depending on the [type of game you want to implement](/develop/basics/minigames.md#common-base-classes), you should choose one of the following approaches:

| Type of minigme           | Traits                                                               | Approach to take                                                              |
|---------------------------|----------------------------------------------------------------------|-------------------------------------------------------------------------------|
| FFA minigame              | no teams, manual win condition (e.g. a timer)                        | [Creating an FFA minigame](#creating-an-ffa-minigame)                         |
| FFA elimination minigame  | players can be eliminated, last player remaining wins                | [Creating an FFA elimination minigame](#creating-an-ffa-elimination-minigame) |
| Team minigame             | players are put into teams, teams win together, manual win condition | [Creating a team minigame](#creating-a-team-minigame)                         |
| Team elimination minigame | elimination minigame, but with teams, last team remaining wins       | [Creating a team elimination minigame](#creating-a-team-elimination-minigame) |

Those approaches only apply for minigames with [maps](/develop/basics/terminology.md#maps--game-maps).
For minigames without maps, please read [this chapter](/develop/developing-minigames/minigames-without-maps.md).

#### Creating an FFA Minigame

An FFA minigame is a common type of minigame.
With this type of minigame, the implementation has to implement a game flow including win logic or game completion logic.
The completion logic might be something like a timer or some goal that players have to reach.
The commonly used base class used for such minigames is `FFAGameInstance`.

A basic minigame instance without any logic looks like this:

```kotlin
package work.lclpnet.ap2.<your_minigame>

class <YourMinigame>Instance(gameHandle: MiniGameHandle, level: ServerLevel, map: GameMap) : FFAGameInstance(gameHandle, level, map) {

    override val data = useDataContainer(::IntScoreDataContainer)
    
    override fun prepare() {
        // called when players are teleported to the map
        // some pre-game setup should be done here
    }

    override fun go() {
        // called once the initial delay and countdown is over
    }
}
```

Each FFA minigame has to call `winManager.complete()` eventually.
The `winManager` property is defined in the parent class `FFAGameInstance` and handles the winner detection, player ranking logic and starts the win sequence.

Players will be ranked according to their placement determined by the `data` container.
In this case, an `IntScoreDataContainer` is used, which gives every player an integer as score.
By default, every player has the score zero, and higher scores are ranked higher.

Please continue with [creating a map](#create-a-minigame-map).

#### Creating an FFA Elimination Minigame

An FFA elimination minigame is a common type of minigame where players can be eliminated.
Once a player has been eliminated, they become spectators for the rest of that minigame.

When all players but one have been eliminated, that last remaining player wins the minigame automatically.

A basic minigame instance without any logic looks like this:

```kotlin
package work.lclpnet.ap2.<your_minigame>

import net.minecraft.server.level.ServerLevel
import work.lclpnet.ap2.game.MiniGameHandle
import work.lclpnet.ap2.game.base.EliminationGameInstance
import work.lclpnet.game.map.GameMap

class TestGameInstance(gameHandle: MiniGameHandle, level: ServerLevel, map: GameMap) : EliminationGameInstance(gameHandle, level, map) {

    override fun prepare() {
        // called when players are teleported to the map
        // some pre-game setup should be done here
    }

    override fun go() {
        // called once the initial delay and countdown is over
    }
}
```

Once a player should be eliminated, call `eliminate(ServerPlayer)` or one of the variations defined in the parent class `EliminationGameInstance`.

To eliminate multiple players simultaneously (and give them the same rank), use `eliminateAll(Iterable<ServerPlayer>)`.

Please continue with [creating a map](#create-a-minigame-map).

#### Creating a Team Minigame
Coming soon

#### Creating a Team Elimination Minigame
Coming soon

### Create a minigame map
If your minigame uses [maps](/develop/basics/terminology.md#maps--game-maps), you need to define at least one map in order to play the game.

Minigame maps are managed using [Asset Repositories](/develop/basics/terminology.md#assetrepository).
By default, Arcade Party 2 defines a remote map repository.
To create a new map, start by adding it to a local asset repository.

To do that, create the folder `run/assets/maps` and add it to the maps source option in `run/config/ap2/config.json`:
```json
{
  "maps_source": ["https://assets.lclpnet.work/release/maps/", "assets/maps"]
}
```

Next, create the folder `run/assets/maps/ap2/<your_minigame>`.
This folder will contain all the maps for your minigame, organized in a special structure.

When Arcade Party starts your game, it starts by looking up all the available maps for the game.
This is handled by the `run/assets/maps/ap2/<your_minigame>/index.json` file.
The basic structure should look like this:

```json

{
  "maps": [
    {
      "name": "My Map",
      "icon": "minecraft:diamond",
      "name-translated": {
        "de_de": "Meine Map"
      },
      "authors": [
        "@person.lclp"
      ],
      "variants": [
        {
          "path": "my_map/26.1",
          "depends": {
            "minecraft": ">=26.1"
          }
        }
      ]
    }
  ]
}
```

This json file describes all available maps.
Maps are defined using a JSON-object with name, icon, name translations, authors and using a *path* to the actual map files.

This example uses the special `variants` property, which expands the given objects using the parent object as template.
Internally, the given example would be expanded into the following:
```json
{
  "maps": [
    {
      "path": "my_map/26.1",
      "name": "My Map",
      "icon": "minecraft:diamond",
      "name-translated": {
        "de_de": "Meine Map"
      },
      "authors": [
        "@person.lclp"
      ],
      "depends": {
        "minecraft": ">=26.1"
      }
    }
  ]
}
```
This is also a valid map definition, but it is recommended to use variants directly, because this makes it easier to add versioned map variants in the future.

Technically, only the path is required, but the properties in the example are commonly used by Arcade Party 2.

Next, create the folder pointed to by the `path` property: `run/assets/maps/ap2/<your_minigame>/my_map/26.1`.

In that folder, the map manager will search for the `map.json` file, which contains map properties and identifies the actual Minecraft save file for the map file for the map.
This is a minimal example of `run/assets/maps/ap2/<your_minigame>/my_map/26.1/map.json`:

```json

{
  "source": "world.tar.xz",
  "spawn": [0, 64, 0]
}
```

The `source` property points to the map save file.
The `spawn` property defines the default in-game position where players should be teleported when they are moved to that world.

Supported save formats include:
- .tar.xz files
- .tar.gz files
- .tar files
- .zip files
- plain directory

The content of the archive / directory should be the plain Minecraft dimension files, for example:
```
❯ tar tf run/assets/maps/ap2/spleef/arena/26.1/world.tar.xz
./
./data/
./data/minecraft/
./data/minecraft/weather.dat
./data/minecraft/world_gen_settings.dat
./data/minecraft/custom_boss_events.dat
./data/minecraft/wandering_trader.dat
./data/minecraft/scheduled_events.dat
./data/minecraft/world_clocks.dat
./data/minecraft/game_rules.dat
./data/minecraft/raids.dat
./data/minecraft/world_border.dat
./level.dat
./entities/
./entities/r.-1.-1.mca
./entities/r.-1.0.mca
./entities/r.0.-1.mca
./entities/r.0.0.mca
./poi/
./poi/r.-1.-1.mca
./poi/r.-1.0.mca
./poi/r.0.-1.mca
./poi/r.0.0.mca
./region/
./region/r.-1.-1.mca
./region/r.-1.0.mca
./region/r.0.-1.mca
./region/r.0.0.mca
```

> **Please note**: since Minecraft 26.1, map archives need to contain kibu-world-api compatible dimensions.
> If you want to convert a Minecraft world save to a dimension, please read the [kibu-world-api documentation](https://github.com/LCLPYT/kibu-world-api#converting-a-world-to-a-dimension).
> You can use the [script provided by kibu-world-api](https://github.com/LCLPYT/kibu-world-api#using-the-provided-scripts) to automate this process.

### Testing the setup
Once you created a Gradle subproject, a minigame definition class, a `fabric.mod.json`, a minigame instance class and a map for your minigame, you are now ready to test your setup.

For this, start a development server as described in [this chapter](/develop/running-the-server.md) about the matter.

When starting the development server for the first time, you should make yourself a server operator.
Just type the following command into the stdin / terminal of the server:
```
op <your minecraft username>
```

Once you join the server you should now have special items to manage the game.

You should see your new game in the minigame voting screen in the lobby, or in the admin minigame selector within a party.
Select your game from either the minigame voting screen and start the game, or switch the next minigame to your new minigame during the preparation phase.

If you did everything right, you should be teleported to your new minigame map.
Should you remain in the lobby, please inspect the console output or `run/logs/debug.log` for any errors.

When everything is working, you can start [implementing your actual game logic](/develop/developing-minigames/minigame-logic.md).