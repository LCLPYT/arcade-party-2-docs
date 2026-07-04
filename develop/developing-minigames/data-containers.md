---
outline: deep
---

# Data Containers
Almost every minigame needs to answer the same question at the end: who won, and in which order did
everyone place? Data containers are the abstraction that answers it.

A data container tracks a set of *subjects* (the players or teams taking part) together with some state
per subject, such as an integer score, the order in which they finished, or whether they have been
eliminated. From that state, the container knows how to produce a ranking. The minigame feeds state into
its container during play, and at the end the [win manager](/develop/developing-minigames/minigame-logic.md)
reads the ranking back out to determine the winners and build the game results.

> **Note**: this score data container system is unrelated to the
> [configuration data container](/develop/misc/configuration-data-container.md). This page is about
> ranked game state, not about the configuration key-value store.

## The general idea
A data container is generic over two type parameters:

- `T`: the subject type. For free-for-all games this is `ServerPlayer`, for team games it is `Team`.
- `Ref : SubjectRef`: a lightweight, comparable reference to a subject. Instead of holding on to a live
  `ServerPlayer` (which may disconnect), containers key their state by a `SubjectRef`.

So a per-player container has the type `DataContainer<ServerPlayer, PlayerRef>`, and a per-team container
has the type `DataContainer<Team, TeamRef>`.

The flow looks like this:

1. The minigame creates a container that matches its win condition and exposes it as its `data` property.
2. During the game, the minigame updates the container (adds score, marks players eliminated, records the
   order players finished in, and so on).
3. When the game ends, the win manager ranks the container's entries, picks the winners, produces a
   `GenericGameResult`, and renders a detail text for each subject (for example `"12 points"`) that is
   shown on the result screen and stored with the statistics.

## Core concepts

### SubjectRef
A `SubjectRef` is a stable, comparable handle to a subject. It knows how to render itself for a viewer, so
that results and scoreboards can display it:

- `identifier`: a stable string id (a player uuid, or a team id).
- `getNameFor(viewer)`: the display name, translated for the viewing player.
- `getIconStackFor(registryManager, viewer)`: an item stack used as an icon (a player head, a wool block
  in the team color, and so on).

There are two built-in implementations:

- `PlayerRef`: references a player by `uuid` and `name`. Two `PlayerRef`s are equal when their uuids match.
- `TeamRef`: references a team by its `TeamKey`.

A subject is turned into a reference by a `SubjectRefFactory<T, Ref>`, which is just a function
`(subject) -> ref`. In practice you pass the `PlayerRef::create` method reference. To go the other way (a
reference back to a live subject) a `SubjectRefResolver<T, Ref>` is used, for example `PlayerRefResolver`,
which looks a player up by uuid.

### DataEntry
A `DataEntry<Ref>` is one subject's state inside the container:

- `subject`: the `SubjectRef` this entry belongs to.
- `toText(translations)`: renders the detail shown next to the subject in the results (for example
  `"12 points"`), or `null` when there is no detail to show.
- `scoreEquals(other)`: decides whether two entries are tied. This is what the ranking uses to group
  subjects onto the same rank.

You rarely create entries yourself; each container produces the entry type that fits it (for example an
`IntScoreDataContainer` produces `IntScoreDataEntry`s).

### The DataContainer interface
The key members of `DataContainer<T, Ref>` are:

- `add(subject)`: adds a subject. For order-tracking containers this appends the subject to the order (it
  is how a winner is recorded). For score containers it is equivalent to `identityIfAbsent`.
- `identityIfAbsent(subject)`: starts tracking a subject with its identity value if it is not tracked yet.
  For a score container that means "track this subject with a score of zero". For order-based containers
  such as `EliminationDataContainer` this is a no-op, because starting to track a subject would change the
  order.
- `getEntry(subject)` / `getEntry(ref)`: returns the entry for a subject, or `null` if it is not tracked.
- `streamOrderedEntries()`: streams the entries in ranked order (best first).
- `streamEntriesRanked()`: streams the entries grouped by rank (see below).
- `clear()`: removes all state.
- `copy()`: returns an independent copy of the container.
- `isEmpty`: whether the container has any entries.

The distinction between `add` and `identityIfAbsent` matters: use `add` when the act of adding a subject
is meaningful to the ordering (finishing a race, being eliminated); use `identityIfAbsent` only to make
sure a subject shows up in the results even if it never scored.

### Ranking and ties
`streamEntriesRanked()` produces the final placement. Subjects whose entries are `scoreEquals` to each
other share the same rank, and ranks are skipped after a tie. For example, if two subjects tie for first,
the ranks come out as `1, 1, 3, 4, ...`. Rank `1` is always the winner.

Score containers are ordered by an `Ordering`:

- `Ordering.DESCENDING` (the default): the highest score wins.
- `Ordering.ASCENDING`: the lowest score wins (useful for "fewest mistakes" or "closest to zero" games).

## Available containers
| Container | Subject state | Winner | Typical use |
| --- | --- | --- | --- |
| `IntScoreDataContainer` | integer score | highest (or lowest) score | most score-based games |
| `DoubleScoreDataContainer` | decimal score | highest (or lowest) score | scores that need fractions |
| `ScoreTimeDataContainer` | integer score + reach time | highest score, earliest first on ties | finales, deterministic ranking |
| `OrderedDataContainer` | insertion order | first added | "who finished first" races |
| `EliminationDataContainer` | elimination order | last added (last standing) | last-one-standing games |
| `SupremeDataContainer` | membership only | all members rank equal | forced winners |
| `CombinedDataContainer` | delegates to children | first child that has an entry | layered win conditions |

### IntScoreDataContainer
Gives every subject an integer score. Scores can be changed at any time while the game runs:

- `setScore(subject, score)`, `addScore(subject, add)`, `getScore(subject)`.
- Constructor options: an `Ordering` (default `DESCENDING`) and an optional `detailKey` (the translation
  key used to render the score, defaulting to `ap2.score.points`).
- Convenience queries: `bestScore`, `worstScore`, and `getBestSubjects(resolver)`.

By default every tracked subject starts at zero and higher scores rank higher.

### DoubleScoreDataContainer
Like `IntScoreDataContainer`, but scores are `Double`s. It takes an additional `format` string (default
`"%.2f"`) that controls how the score is rendered in the detail text.

### ScoreTimeDataContainer
An integer score container that also remembers the order in which scores were reached, using an
incrementing transaction counter. When two subjects have the same score, the one who reached it first is
ranked higher, so the final ranking is fully deterministic even on ties. This is what finales use, via the
`finaleCompatibleIntScoreContainer` helper (see below).

### OrderedDataContainer
Keeps the order in which subjects were added; the first subject added is the winner. Each `add` can carry
an optional `TranslatedText` detail that is shown next to the subject in the results. Use it for races
where placement is decided by finishing order.

### EliminationDataContainer
Built for last-one-standing games: the last subject added is the winner, because the order is reversed
internally. Use `add(subject)` as players drop out, or `addAll(subjects)` to eliminate several subjects at
the same moment and give them all the same rank. `identityIfAbsent` is intentionally a no-op here, so
tracking a subject never changes the order. The FFA and team elimination base classes manage this
container for you.

### SupremeDataContainer
A flat set of subjects with no score; every member ranks equal and at the top. The win manager uses it
internally to hold forced winners (see [How results are produced](#how-results-are-produced)); you will
rarely instantiate it directly.

### CombinedDataContainer
Chains several child containers. For a given subject, the first child that has an entry for it wins, and
the overall ranking is the children concatenated in order (with each subject appearing only once). This
lets you layer win conditions. The classic pattern is an `OrderedDataContainer` of the players who reached
the goal, on top of an `IntScoreDataContainer` that ranks everyone else by how far they got.

## Using a container in a minigame

### Declaring the `data` property
The FFA and team base classes require you to provide a container:

- `FFAGameInstance` requires `override val data: DataContainer<ServerPlayer, PlayerRef>`.
- `TeamGameInstance` requires `override val data: DataContainer<Team, TeamRef>`.
- `EliminationGameInstance` and `TeamEliminationGameInstance` already supply an `EliminationDataContainer`,
  so you do not override `data` for those.

### The `useDataContainer` helper
Rather than constructing a container by hand, use the `useDataContainer` helper. 
It wires up the correct reference factory and pre-registers every current
player (via `identityIfAbsent`) so that everyone appears in the results, even if they never score:

```kotlin
override val data = useDataContainer(::IntScoreDataContainer)
```

There is a team overload that takes the `TeamManager` and registers every team:

```kotlin
val data = useDataContainer(teamManager, ::IntScoreDataContainer)
```

For score-based games that should also work as a finale, use `finaleCompatibleIntScoreContainer`, which
picks a `ScoreTimeDataContainer` in finales and a plain `IntScoreDataContainer` otherwise:

```kotlin
override val data = useDataContainer(::finaleCompatibleIntScoreContainer)
```

### Example: a score-based FFA game
Declare the container, add score as players earn points, and complete the game when the win condition is
met. Players are ranked by their score automatically.

```kotlin
class ExampleInstance(
    gameHandle: MiniGameHandle, 
    level: ServerLevel, 
    map: GameMap,
) : FFAGameInstance(gameHandle, level, map) {

    override val data = useDataContainer(::IntScoreDataContainer)

    private fun onPlayerScored(player: ServerPlayer) {
        data.addScore(player, 1)
    }

    override fun go() {
        // once the win condition is reached:
        winManager.complete()
    }
}
```

### Example: layered finishers plus score
A race where reaching the goal ranks you above everyone who did not, and the rest are ranked by a score
(here, lowest wins), with a custom detail translation key:

```kotlin
private val completed = OrderedDataContainer(PlayerRef::create)
private val score = IntScoreDataContainer(PlayerRef::create, Ordering.ASCENDING, "ap2.score.blocks_away")

override val data = useDataContainer { CombinedDataContainer(listOf(completed, score)) }
```

When a player reaches the goal, add them to `completed`; otherwise keep updating their `score`. The
combined container ranks all finishers (in finishing order) ahead of the remaining players.

### Example: a team score
Team games work the same way, keyed by `Team` and `TeamRef`:

```kotlin
val data = useDataContainer(teamManager, ::IntScoreDataContainer)
```

Add points to a team's entry with `data.addScore(team, n)` as the game progresses. See
[Team minigames](/develop/developing-minigames/team-minigames.md) for the full team game flow.

### Score listeners and statistics
The score containers expose a `ScoreListenerView`: you can `register` a listener that is notified whenever
a subject's score changes, and `dispatchScoreEvents(subjects)` to make sure every subject is tracked.
This is the mechanism the statistics helpers (such as `useFFAStats`) use to mirror the primary score into
a stat set. Most games do not register listeners directly and simply rely on those helpers.

### Detail text and translations
The text shown next to each subject in the results comes from the entry's `toText`, which resolves a
translation key. Score containers default to `ap2.score.points`; pass a `detailKey` to the constructor to
use a different key (for example `ap2.score.blocks_away`). See
[Using translations](/develop/developing-minigames/translations.md) for how these keys are defined.

## How results are produced
You do not rank the container yourself; the win manager does it when the game ends. It:

1. Builds a `CombinedDataContainer` of the forced winners (a `SupremeDataContainer`) followed by a copy of
   your `data` container, so that any forced winners rank first.
2. Calls the game's winners factory to build a `GenericGameResult`: `FFAGameResult` for FFA games, or
   `TeamGameResult` for team games. These read `streamEntriesRanked()` to fill in `winningSubjects` and
   `subjectResults`; `TeamGameResult` additionally expands each team's placement to all of its members.
3. Renders each entry's `toText` into the per-subject detail text stored with the statistics.

Forcing an outcome routes through the same containers: `winManager.forceWin(...)` fills the
`SupremeDataContainer` with the chosen winners, and `winManager.draw()` clears the `data` container so that
nobody is ranked above anyone else. See the
[win manager section](/develop/developing-minigames/minigame-logic.md) for the surrounding game-over flow.

## Choosing a container
| Win condition | Container |
| --- | --- |
| Highest score wins | `IntScoreDataContainer` (or `DoubleScoreDataContainer` for fractions) |
| Lowest score wins | `IntScoreDataContainer` with `Ordering.ASCENDING` |
| Score-based, also usable as a finale | `finaleCompatibleIntScoreContainer` |
| First to finish wins | `OrderedDataContainer` |
| Last one standing | `EliminationDataContainer` (supplied by the elimination base classes) |
| Reaching a goal beats a score fallback | `CombinedDataContainer` of `OrderedDataContainer` + a score container |

If none of the built-in containers express your win condition, you can write your own by extending
`BaseDataContainer<T, Ref>` and implementing its abstract methods. Reuse an existing `DataEntry` type
where you can, so the results and detail text render consistently.
