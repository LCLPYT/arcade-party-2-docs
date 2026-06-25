# Terminology

## Arcade Party Mode
An Arcade Party "mode" is the surrounding game logic beyond the scope of minigames.
It acts sort of like a "shell" around the minigames.
The mode decides when to start a minigame and receives the minigame results after they are completed.

### Default mode
One example of an Arcade Party mode is the "default mode", which puts the players in a waiting lobby between minigames.
Each time a minigame is completed, players are granted points depending on their placement:

| Minigame placement | Granted points |
|--------------------|----------------|
| Ranked #1          | + 3 points     |
| Ranked #2          | + 2 points     |
| Ranked #3          | + 1 points     |
| Ranked #4 or worse | no points      |

### Other modes
At the time of writing, there exists only the "default" mode.

However, there are plans to create alternative modes, such as a team mode, where players compete in overall teams.

Another planned mode is a Mario-Party-like board game mode where players need to roll dice in order to progress on a board.
In between the dice-throws, minigames are played.
Depending on the player placement in the minigames, dice with higher values are given to the players for the next round.

## Minigames
A minigame is a self-contained game that can be started by the current Arcade Party mode.
Minigames are always played in a separate world / dimension.
Most minigames have a fixed set of predefined maps, that the minigame can be played on.
However, there are also minigames where the map is randomly generated each time.

In theory, minigames can have arbitrary logic an can be arbitrarily long.
The only requirement is that the game completes on some condition, giving participating players a ranking afterward.

## Maps / Game Maps
Maps are pre-built Minecraft worlds that a minigame is played on.
They are also sometimes referred to as "game maps".

Maps are stored in an [AssetRepository]().