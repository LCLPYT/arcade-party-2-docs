---
outline: deep
---

# Minigames

Each [minigame](/develop/basics/terminology.md#minigames) lives within its own Gradle subproject in `src/minigames`.

There are different types of minigames:
- FFA games (no teams)
- Team games (2 teams or multiple smaller ones)

Most minigames are played on pre-built [maps](/develop/basics/terminology.md#maps--game-maps), but it is also possible to generate a new world to play in on the fly.

## Minigame Architecture
### `MiniGame` descriptor
Every minigame has an entry point implementing the `MiniGame` interface.
This entry point is used define information of the minigame, for example the id, the icon and whether the game can be played right now.
Each minigame must also define a `MiniGameFactory`.

### `MiniGameFactory`
A `MiniGameFactory` is responsible for creating instances of the minigame.
Generally, the factory also creates and loads the map the minigame is played on.
Additional work such as I/O-Stuff may also be done by the factory.
Once everything is ready, all dependencies are then passed to the minigame instance.

### `MiniGameInstance` class
Minigame instances are the final and main part of the minigame implementation.
It contains the actual game logic and flow.
All minigame instances must implement the `MiniGameInstance` interface.
Once the arcade party mode is ready, it calls start on the minigame instance.
The instance is then supposed to teleport players into the newly loaded map.
In practice, this is handled automatically by the default implementation of minigame instance (`MapGameInstance`), assuming the minigame instance extends it.

### Common factory setup
If the minigame uses maps and doesn't require additional setup work, the provided `MapLevelGameFactory` can be used to simplify the instance creation process.
Otherwise, a custom factory implementation is needed.
Custom factories using maps may call `openRandomMap()` on the `MiniGameHandle` argument.

### Common base classes
Since many minigames use similar logic, there are some base classes that can be extended from.

At the moment, these base classes require a map on order to be used. 
This may change in the future as refactoring progresses in an effort to favor composition.

#### `FFAGameInstance`
Represents a generic free-for-all minigame.
Implementations are required to provide a DataContainer fitting to the minigame, such as integer scores, an order or something entirely different.

#### `EliminationGameInstance`
An FFA game where players can be eliminated. 
Eliminated players can then only spectate the remaining players.
The last remaining players wins.

#### `TeamGameInstance`
Represents a generic minigame with teams.
In contrast to FFA minigames, in team minigames, players are assigned teams which work together to win the minigame.
If a team wins, all team members will be counted as winners.

#### `TeamEliminationGameInstance`
Same as `EliminationGameInstance`, but with teams.
