---
outline: deep
---

# Team minigames
This chapter explains how to build minigames where players compete in teams instead of individually.
It covers the team game base classes, the `TeamManager` that assigns and tracks teams, and how teams are scored.

In a team minigame, participants are split into two or more teams.
Winning and scoring happen at the team level: a team wins as a unit, and every member of a winning team receives the win.

## Team game base classes
Most team minigames extend one of two abstract base classes instead of implementing `MiniGameInstance` directly.
They mirror the solo game hierarchy, but everything is keyed by `Team` instead of by an individual player.

| Concern                | Solo / FFA                                    | Team                                               |
|------------------------|-----------------------------------------------|----------------------------------------------------|
| Base class             | `MapGameInstance` / `EliminationGameInstance` | `TeamGameInstance` / `TeamEliminationGameInstance` |
| Data container         | `DataContainer<ServerPlayer, PlayerRef>`      | `DataContainer<Team, TeamRef>`                     |
| Result                 | `FFAGameResult`                               | `TeamGameResult`                                   |
| Scoring / winning unit | a single player                               | a whole team                                       |

### TeamGameInstance
`TeamGameInstance` is the base class for team games.
It extends `MapGameInstance`, so it still works with a [game map](/develop/basics/terminology.md#maps--game-maps), and additionally takes a `TeamManager` in its constructor.

Compared to a plain `MapGameInstance`, it wires up the team-aware variants of the win and participant systems for you:
- `winManager` is created with `useTeamWinManager(...)`, so it ranks teams and produces a `TeamGameResult`.
- `participantListener` is created with `useLastRemainingTeamListener(...)`, which marks a team as eliminated once its last participating member is removed, and ends the game once a single team is left.

The manager that owns the teams is available through the `teamManager` property.
It is passed into the constructor, so it must be created before the instance (see [the team manager](#the-team-manager) below).

Subclasses must provide the scoring model through an abstract `data` property:
```kotlin
protected abstract val data: DataContainer<Team, TeamRef>
```

You can convert a `Team` into a `TeamRef` (the subject reference used by the data container) with the `createReference(team)` helper.

Two lifecycle hooks may be overridden:
```kotlin
protected open fun participantRemoved(player: ServerPlayer) { }

protected open fun teamEliminated(team: Team) {
    winManager.checkForLastRemaining()
}
```
`participantRemoved` fires whenever a participating player leaves the game, and `teamEliminated` fires once a whole team is out.

#### Team spawns
Teleporting teams to their spawns is entirely optional and never happens on its own.
If you want it, you have to call `teleportTeamsToSpawns()` yourself, for example when the game starts:
```kotlin
teleportTeamsToSpawns()
```

By default, the spawn of a team is resolved from the map's [named spawns](/develop/basics/terminology.md#maps--game-maps).
Each team's spawn is looked up by its team id (`team.key.id`), so a map should define a named spawn for each team id you use (for example `red` and `blue`).
The single spawn for one team is available through `getSpawn(team)`.

This is only the default behaviour.
You may override `getSpawn(team)` to resolve spawns differently, or override `teleportTeamsToSpawns()` to replace the teleport logic altogether.

### TeamEliminationGameInstance
`TeamEliminationGameInstance` extends `TeamGameInstance` for last-team-standing games.
It supplies the `data` container for you (an `EliminationDataContainer`), so you don't have to override it.

You decide when and how teams are eliminated.
Two common approaches exist, and you can mix them:
- Eliminate individual players and let a team drop out once its last participating member is gone.
- Eliminate a whole team directly, on whatever game-specific condition you like.

Eliminating individual members is optional.
If your game never removes single players, teams can still be eliminated as a unit.

To instantly turn players who would die into spectators, register smooth death:
```kotlin
useSmoothDeath()
```

To eliminate players or teams, use the `eliminate` overloads:
```kotlin
eliminate(player)              // remove a single player; their team survives if others remain
eliminate(team)                // remove every member, then eliminate the team
eliminateAll(teams)            // eliminate several teams at the same moment
```
Eliminating the last remaining team ends the game automatically through the win manager.

### Using team infrastructure without a base class
Extending `TeamGameInstance` is convenient but not required.
The team win manager and the last-remaining listener are independent building blocks, so a game can implement `MiniGameInstance` directly and still use teams.

This is mainly useful for [minigames that don't use a map](/develop/developing-minigames/minigames-without-maps.md), since `TeamGameInstance` builds on the map-based game base.

Team Gathering does exactly this:
```kotlin
class TeamGatheringInstance(
    override val gameHandle: MiniGameHandle,
    override val level: ServerLevel,
    val teamManager: TeamManager,
    // ...
) : MiniGameInstance {

    val data = useDataContainer(teamManager, ::IntScoreDataContainer)
    override val winManager = useTeamWinManager(teamManager, map = null) { data }
    override val participantListener = useLastRemainingTeamListener(teamManager, winManager)
    // ...
}
```
Note that `useTeamWinManager` accepts `map = null`, since there is no map to derive spawns from here.

## The team manager
The `TeamManager` owns the teams of a single minigame.
It assigns players to teams, mirrors those teams onto the Minecraft scoreboard (as vanilla `PlayerTeam`s), tracks which teams are still in play, and colors player name tags.

There is no global team manager; each team minigame creates its own instance.
When you extend `TeamGameInstance`, the manager is already available through the `teamManager` property, but you still have to create it and assign the players yourself before constructing the instance.

### Creating a team manager
Create the manager from your `MiniGameHandle`, usually inside the [minigame factory](/develop/developing-minigames/create-a-minigame.md):
```kotlin
val teamManager = handle.createTeamManager()
```
`createTeamManager()` reads the `teamConfig` from the handle and, if none was configured, defaults to `TeamConfig.balanced(rankView)`.
The `TeamConfig` decides how players are distributed and may also force specific players onto specific teams through its `mapping`.

Creating the manager does not assign anyone to a team yet.
Partitioning the players into teams is a separate, manual step (see below).

### Assigning players to teams
Teams are identified by a `TeamKey`.
The built-in `DyeTeamKey` enum provides sixteen dye-colored keys, such as `DyeTeamKey.RED` and `DyeTeamKey.BLUE`.

The usual approach is to define the team keys you want, then split the participants across them with `partitionIntoTeams`:
```kotlin
val TEAM_RED: TeamKey = DyeTeamKey.RED
val TEAM_BLUE: TeamKey = DyeTeamKey.BLUE

// inside the factory
val teamManager = handle.createTeamManager()
teamManager.partitionIntoTeams(handle.participants, setOf(TEAM_RED, TEAM_BLUE))
```
`partitionIntoTeams` registers each team key, applies any forced mapping from the config, and distributes the remaining players using the configured partitioner.

If you need finer control, you can register a team and add players yourself:
```kotlin
val team = teamManager.registerTeam(DyeTeamKey.GREEN)
teamManager.joinTeam(player, team)
```

### Partitioners
The `TeamConfig` selects a `TeamPartitioner`, which decides how the remaining players are spread across teams:
- `UniformTeamPartitioner` distributes players randomly while keeping team sizes even.
- `BalancedTeamPartitioner` also keeps sizes even, but additionally balances teams by player rank so the average rank of each team is roughly equal.

> **Note**: `createTeamManager()` uses `TeamConfig.balanced(rankView)` by default, so teams are rank-balanced unless you configure otherwise.

### Querying teams
The manager exposes lookups for use throughout your game logic:
```kotlin
val team = teamManager.getTeam(player)          // the player's team, or null
teamManager.areTeamMates(playerA, playerB)      // whether two players share a team
teamManager.isParticipating(team)               // whether a team is still in play

val all = teamManager.teams                     // all registered teams
val alive = teamManager.participatingTeams      // teams that are not eliminated
```
A `Team` gives access to its members through `team.players`, and to only its still-participating members through `team.getParticipatingPlayers(participants)`.

### Team elimination
To eliminate a team, call:
```kotlin
teamManager.setTeamEliminated(team)
```
This marks the team as out and notifies the bound `TeamEliminatedListener`.
When you extend `TeamGameInstance`, the last-remaining listener is already bound for you, so elimination flows into `teamEliminated(team)` and ends the game once a single team is left.
In a `TeamEliminationGameInstance`, prefer the `eliminate(...)` helpers, which handle removing the members and marking the team eliminated in the right order.

#### Name tag colors
By default, name tags are not tinted with the team color, because Minecraft only supports a limited set of format colors.
If every team's rgb color has a matching format color, you can enable colored name tags:
```kotlin
teamManager.setUseColorCodes(true)
```

## Scoring and results
Team scores are held in a score `DataContainer<Team, TeamRef>`, the team-keyed counterpart of the per-player score container.
For example, a score-based team game uses an `IntScoreDataContainer` and adds points to a team's entry as the game progresses.
The win manager reads the ranked entries from this container to build a `TeamGameResult`, which expands each team's placement to all of its members.

> **Note**: this score data container is not the same as the configuration data container; it holds ranked game results, not configuration values.

See [Data containers](/develop/developing-minigames/data-containers.md) for the full list of container implementations and how to feed state into them.

## Per-team state
For per-team state that is not part of scoring (per-team counters and so on), use `TeamStorage`.
It is a lazy map from `Team` to a value of your choice, created once and queried by team:
```kotlin
val teamStates = TeamStorage.create(::TeamState)
val state = teamStates[team]
```

Statistics are recorded with `useTeamStats(...)`, which tracks separate stat sets at the team level and the individual member level.
See [Statistics](/develop/developing-minigames/stats.md#team-stats) for how to register and record them.

## Team model
A quick reference of the core types:
- `Team`: a logical team; exposes `players`, `playerCount`, `addPlayer` / `removePlayer`, and `getParticipatingPlayers(participants)`.
- `TeamKey`: identifies a team; provides its `id`, `color` (rgb), `teamColor`, and localized display name.
- `DyeTeamKey`: the built-in enum of sixteen dye-colored team keys (`RED`, `BLUE`, `GREEN`, ...).
- `TeamRef`: the subject reference for a team, used by data containers and results.
