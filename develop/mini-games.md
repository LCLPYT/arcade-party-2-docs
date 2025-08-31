---
outline: deep
---

# Mini Games
Mini games are modules containing game logic that should ideally take up to 5 minutes to play.

There is a total maximum play time of 15 minutes per mini game, after which a game ends in a draw.
This limit is mostly just for ensuring games don't continue indefinitely; regardless, developers should try to comply with the target of 5 minutes of play time per mini game.


## Structure
Each mini game has its own Gradle source set, located under `src/minigames/<mini game>`.

Mini game code should be independent of code of other mini games, as well as the [Arcade Party mode](./modes).
The only code dependency is on the `lib` module, as well as external mods and dependencies.

The Arcade Party mode locates available mini games using a custom [Fabric entrypoint](https://wiki.fabricmc.net/documentation:entrypoint) called `ap2:minigame`.
Entrypoints point to implementations of the `MiniGame` interface, containing information about the game and a factory method to create an instance of the mini game.
Thinks of the mini game class like a descriptor of a mini game.

Instances of a mini game must all implement the `MiniGameInstance` interface.
Mainly, the abstract `BaseGameInstance` class is used, which loads a random map from the map repository (documentation needed).


## Types of mini games

### FFA games
Each player faces every other player; there are no teams.
This is the generic target for all sorts of FFA games.

Mini game intances of this type extend the `FFAGameInstance` class.


### FFA Elimination games
This is a type of FFA game, but with an last player standing game logic.
Players may be "eliminated", which means that they are no longer participating but rather spectating.

Players are ranked the the reverse order they are eliminated.

The last player remaining wins the game.

If a player quits, they are considered eliminated.

Mini game instances of this type extend the `EliminationGameInstance` class.


### Team games
Players are grouped into two or more teams, depending on the game.
In contrast to FFA games, the placement / score of a team counts the same for every team member.

Mini game instances of this type extend the `TeamGameInstance` class.


### Team Elimination games
This is a variant of a team game.
Just like the regular elimination game type, but last team standing instead of last player standing.
The last remaining team is the winning team and the teams are ranked in reverse order they are eliminated.

A team is eliminated, when either:
- all team members are eliminated
- the game eliminated the whole team

Mini game instances of this type extend the `TeamEliminationGameInstance` class.

