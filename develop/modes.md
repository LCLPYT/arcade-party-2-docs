# Arcade Party "Modes"
An Arcade Party "mode" is the surrounding game logic beyond the scope of mini games.
It acts sort of like a "shell" arround the mini games.
The mode decides when to start a mini game and receives the mini game results after they are completed.

## Default mode
One example of an Arcade Party mode is the "default mode", which puts the players in a waiting lobby between mini games.
Each time a mini game is completed, players are granted points, depending on their placement:

| Minigame placement | Granted points |
|--------------------|----------------|
| Ranked #1          | + 3 points     |
| Ranked #2          | + 2 points     |
| Ranked #3          | + 1 points     |
| Ranked #4 or worse | no points      |

All mode-specific code should also be independent of code of other modes, as well as mini game code.
The only code dependency is on the `lib` module, as well as external mods and dependencies.
