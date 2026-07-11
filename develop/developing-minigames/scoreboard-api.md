---
outline: deep
---

# Scoreboard API
Some minigames show a sidebar with a title, a few lines of text and per-player scores.
Vanilla Minecraft can do this, but the raw scoreboard API is verbose, is not localized, and
leaves you to clean up objectives and teams yourself.

The `scoreboard` utility package wraps the vanilla scoreboard behind a `CustomScoreboardManager`. 
It handles per-language and per-player sidebars, number formatting, teams, and lifecycle cleanup for you.

The manager is available on the game handle:

```kotlin
val scoreboardManager = gameHandle.scoreboardManager
```

## The general idea
`CustomScoreboardManager` owns every team, objective and virtual objective it creates.
It registers a few hooks when the game starts:

- **On join**, every virtual objective (translated and dynamic ones) is added to the new player automatically.
- **On language change**, translated objectives rebuild themselves in the new language.
- **On quit**, players are removed from their team automatically.
- **On game end**, `unload()` removes all teams and objectives the manager created.

## Objectives
A Minecraft *objective* is a named container that stores an integer score for each *score holder* (a player name or an arbitrary string). 
An objective has a display name, a render type (`INTEGER` or `HEARTS`) and an optional number format. 
It is shown to players by assigning it to a `DisplaySlot`, for example the `SIDEBAR`, below the player name, or in the player list.

Create a raw vanilla objective with `createObjective`:

```kotlin
val objective = scoreboardManager.createObjective(
    "my_score",
    ObjectiveCriteria.DUMMY,
    Component.literal("Score"),
    ObjectiveCriteria.RenderType.INTEGER,
)

scoreboardManager.setDisplay(DisplaySlot.SIDEBAR, objective)
```

- `ObjectiveCriteria.DUMMY` means the score is only changed by code, never by vanilla Minecraft itself.
- The number format defaults to `StyledFormat.SIDEBAR_DEFAULT`.

> **Note**: creating an objective reuses the name. If an objective with the same name
> already exists, it is removed first, so you never get a duplicate name error.

`createObjective` gives you a plain vanilla objective. 
For a localized or per-player sidebar, use the translated and dynamic objectives described below.

## Teams
A Minecraft *team* is a named group of entities. 
Teams control nametag visibility, collision and the name color of their members.

```kotlin
val team = scoreboardManager.createTeam("red_team")

scoreboardManager.joinTeam(player, team)
scoreboardManager.joinTeam(players, team)  // an Iterable also works

scoreboardManager.leaveTeam(player, team)
scoreboardManager.removeTeam("red_team")
```

Like objectives, `createTeam` removes an existing team of the same name first.

> **Note**: vanilla teams only support a fixed set of name colors. `joinTeam` works around this 
> by applying the player's display name to their player list name manually, so arbitrary text colors are preserved.

You do not have to remove players on disconnect; the manager does that for you on quit. 
The `SimpleTeamManager` used by team minigames is built on exactly these calls. 
See [team minigames](/develop/developing-minigames/team-minigames.md).

## Translated objectives
A `TranslatedScoreboardObjective` renders one vanilla objective per language, so every player sees the sidebar in their own language. 
Titles and text update automatically when a player changes their language.

The common way to create one is the `setupTranslatedSidebarObjective` helper, which creates the objective, 
places it in the sidebar, styles it and adds a separator line at the top and bottom:

```kotlin
val objective = setupTranslatedSidebarObjective(
    gameHandle.scoreboardManager,
    "game.ap2.rapid_runner.distance",
)
```

The passed string is a translation key. 
See [using translations](/develop/developing-minigames/translations.md).

Once you have the objective you can manage its title, text and scores:

```kotlin
objective.setTitle("game.ap2.rapid_runner.distance")   // localized title
objective.setSlot(DisplaySlot.SIDEBAR)

objective.setScore(player.scoreboardName, 42)
objective.setDisplayName(player.scoreboardName, Component.literal("You"))
objective.setNumberFormat(player.scoreboardName, StyledFormat.PLAYER_LIST_DEFAULT)

objective.removeEntry(player.scoreboardName)
```

`setDisplayName` and `setNumberFormat` come in several overloads: 
a plain `Component`, a `TextTranslatable` (localized per player) and for `setNumberFormat` a `TranslatedNumberFormat` (a different format per language). 
There is also a `setDisplayName { holder -> ... }` form that computes the display text for every holder from its name.

## Dynamic objectives
A `DynamicScoreboardObjective` renders one vanilla objective per player. 
Use it when players must see *different* content, for example a personal round counter or rank.

The `setupDynamicSidebarObjective` helper mirrors the translated one:

```kotlin
val objective = setupDynamicSidebarObjective(
    gameHandle.scoreboardManager,
    gameHandle.gameInfo.titleKey,
)
```

Because content is per player, most setters have a per-player overload:

```kotlin
objective.setScore(player, "score", 42)
objective.setDisplayName(player, "score", Component.literal("You"))
objective.setNumberFormat(player, "score", BlankFormat.INSTANCE)
```

The overloads without a `player` set the value for everyone. 
Two properties control the defaults for new entries:

```kotlin
objective.defaultDisplay = { _, holder -> 
    Component.literal(holder).withStyle(GREEN) 
}

objective.defaultNumberFormat = StyledFormat.PLAYER_LIST_DEFAULT
```

For lines whose text differs per player, use `createDynamicText`, which returns a `DynamicScoreHandle` (see below):

```kotlin
val roundHandle = objective.createDynamicText(
    gameHandle.translations.translateText("round").withStyle(GREEN),
    ScoreboardLayout.TOP,
)

roundHandle.setNumberFormat(
    player, 
    FixedFormat(Component.literal("$round/$rounds"))
)
```

## Scores, display text and layout
Every line in a custom sidebar is a *score entry*: 
a holder, an integer score, an optional display text and an optional number format (`CustomScoreboardEntry(display, numberFormat, score)`).

- The **score** decides the vertical order of the lines. Higher scores appear further up.
- The **display text** overrides what is shown for the holder. Without it, the holder's raw name is shown.
- The **number format** decides how the score value on the right is rendered.

You rarely pick score values by hand to determine the order of entries. 
Both translated and dynamic objectives implement `InformativeScoreboard`, which provides `createText` and `createNewline` 
together with the `ScoreboardLayout.TOP` and `ScoreboardLayout.BOTTOM` anchors. 
`TOP` stacks lines downward from the top and `BOTTOM` stacks upward from the bottom:

```kotlin
objective.createText(
    translations.translateText("round").withStyle(GREEN), 
    ScoreboardLayout.TOP
)

objective.createNewline(ScoreboardLayout.TOP)

val separator = Component.literal(ApConstants.SCOREBOARD_SEPARATOR_SM)
    .withStyle(DARK_GREEN, STRIKETHROUGH)
    
objective.createText(separator, ScoreboardLayout.BOTTOM)
```

The `createText()` function returns a `ScoreHandle` you can keep to update a single line later:

```kotlin
val handle = objective.createText(text, ScoreboardLayout.TOP)

handle.setScore(10)
handle.setDisplay(Component.literal("Round 2"))
handle.setNumberFormat(BlankFormat.INSTANCE)
```

For per-player lines on a dynamic objective, `createDynamicText` returns a `DynamicScoreHandle`, whose methods take the target `player`:

```kotlin
handle.setScore(player, 10)
handle.setDisplay(player, Component.literal("Round 2"))
handle.setNumberFormat(player, FixedFormat(Component.literal("$round/$rounds")))
```

## Number formats
The number format controls the value shown on the right of a score line. 
These vanilla `NumberFormat` types cover the common cases:

| Format                              | Effect                                                    |
|-------------------------------------|-----------------------------------------------------------|
| `StyledFormat.SIDEBAR_DEFAULT`      | Default sidebar number styling.                           |
| `StyledFormat.PLAYER_LIST_DEFAULT`  | Player list number styling.                               |
| `BlankFormat.INSTANCE`              | Hides the number entirely (used for text-only lines).     |
| `FixedFormat(component)`            | Shows fixed text instead of the score, e.g. `"3/5"`.      |

`FixedFormat` is handy for showing a value that is not really a score:

```kotlin
handle.setNumberFormat(
    FixedFormat(Component.literal("$round/$ROUNDS").withStyle(YELLOW))
)
```

For a translated objective you can vary the format per language with a `TranslatedNumberFormat`, 
a functional interface that maps a language to a `NumberFormat`:

```kotlin
objective.setNumberFormat(holder, TranslatedNumberFormat { language -> 
    formatFor(language) 
})

// wrap a single format that is the same for all languages:
objective.setNumberFormat(
    holder, 
    TranslatedNumberFormat.constant(BlankFormat.INSTANCE)
)
```

## Reference

| Symbol                                           | Purpose                                                                 |
|--------------------------------------------------|-------------------------------------------------------------------------|
| `CustomScoreboardManager`                        | Entry point. Creates objectives and teams and cleans them up on unload. |
| `createObjective(...)`                           | Create a raw vanilla objective.                                         |
| `createTeam / joinTeam / leaveTeam / removeTeam` | Create teams and manage membership.                                     |
| `TranslatedScoreboardObjective`                  | One objective per language. Localized sidebar.                          |
| `DynamicScoreboardObjective`                     | One objective per player. Per-player sidebar content.                   |
| `setupTranslatedSidebarObjective(...)`           | Helper that builds a ready-to-use localized sidebar.                    |
| `setupDynamicSidebarObjective(...)`              | Helper that builds a ready-to-use per-player sidebar.                   |
| `ScoreHandle` / `DynamicScoreHandle`             | Update a single line's score, display text and number format.           |
| `ScoreboardLayout.TOP` / `.BOTTOM`               | Anchors for automatic line ordering.                                    |
| `TranslatedNumberFormat`                         | Map a language to a `NumberFormat` for localized number formatting.     |
