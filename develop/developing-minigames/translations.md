---
outline: deep
---

# Using translations
This chapter explains how to turn a translation key into a message and show it to players.
It covers creating translated text inside a minigame, styling it, sending it to players, using the translation service directly, and how translations are loaded behind the scenes.

Translations are provided by the [kibu](https://github.com/LCLPYT/kibu) library and are **server sided**.
There is no client-side resource pack involved: the server loads the language files, resolves each player's selected language individually, and renders the final text for that player.
This means a single message can be shown to a group of players and every one of them sees it in their own language.

The typical flow is always the same:
create a `TranslatedText` from a key with `translate(...)`, optionally style it, then send it to one or more players.

## Creating a `TranslatedText`
Inside a minigame instance you create translated text with the `translate()` extension function:

```kotlin
translate("chest_refill")
```

The `key` is a reference for the actual text in the different languages.
The actual value is configured in the translation JSON files under `src/main/resources/lang/` of the minigame.
For example for english (US), translations are stored in `src/main/resources/lang/en_us.json`:
```json
{
  "name": "Killeporter",
  "chest_refill": "All Containers have been refilled!"
}
```

The `translate(key)` function returns a `TranslatedText` instance, which is **deferred**.
It does not hold a finished piece of text; it remembers the key, the arguments and the style, and only produces the actual text later, once it knows which player (and therefore which language) it is being rendered for.

### Arguments
Any arguments you pass after the key fill the `%s` placeholders in the language string, in order, using Java's `Formatter`.
For example, with the language entry `"switch_announcement": "You will be swapped in the next %s seconds!"`:
```kotlin
translate("switch_announcement", maxDelaySeconds)
```

An argument can be a plain value, a `FormatWrapper` (to style just that value, see [styling arguments](#styling-a-single-argument)), or a `LocalizedFormat` (for locale-correct number formatting, see [LocalizedFormat](#localizedformat)).

## Styling text
Style the whole message by chaining `withStyle(...)` or `withColor(...)` on the `TranslatedText`.
These methods use Minecraft's `Style` and `ChatFormatting`, and each one returns the same `TranslatedText` so they can be chained:
```kotlin
translate("chest_refill")
  .withStyle(ChatFormatting.AQUA)
```

The available overloads are:

| Method                                    | Effect                                          |
|-------------------------------------------|-------------------------------------------------|
| `withStyle(ChatFormatting)`               | Apply a single formatting (color, bold, ...).   |
| `withStyle(vararg ChatFormatting)`        | Apply several formattings at once.              |
| `withStyle(Style)`                        | Fill absent style parts from the given `Style`. |
| `withStyle(UnaryOperator<Style>)`         | Transform the current style.                    |
| `withColor(Int)` / `withColor(TextColor)` | Set the text color (packed int or `TextColor`). |

Passing several formattings applies all of them, for example a color together with bold:
```kotlin
translate("won_match")
  .withStyle(ChatFormatting.DARK_GREEN, ChatFormatting.BOLD)
```

### Styling a single argument
Sometimes you only want to highlight one substituted value, not the whole line.
Wrap that argument in a `FormatWrapper` so it carries its own style, independent of the surrounding text:
```kotlin
translate("switch_announcement", FormatWrapper.styled(maxDelaySeconds, ChatFormatting.YELLOW))
    .withStyle(ChatFormatting.GREEN)
    .sendTo(players())
```
Here the whole sentence is green, but the number is yellow.

`FormatWrapper.styled(...)` is a static factory that pairs an arbitrary value with a `Style`:
```java
FormatWrapper.styled(Object obj)                          // no style
FormatWrapper.styled(Object obj, ChatFormatting... formats)
FormatWrapper.styled(Object obj, Style style)
```
When kibu builds the final message, it recognizes `FormatWrapper` arguments and appends the wrapped value with its style, instead of running it through the plain formatter.

> **Note**: `FormatWrapper.styled` is often statically imported so you can write `styled(value, ...)` directly:
> ```kotlin
> import work.lclpnet.kibu.translate.text.FormatWrapper.styled
> ```

### LocalizedFormat
`LocalizedFormat` is used when a substituted value needs locale-correct formatting, such as a decimal number whose separator differs between languages.
It is a translatable argument that runs `String.format` with the recipient's locale:
```kotlin
val added = LocalizedFormat.format("%.2f", amount)

translate("fuel_added", styled(added, ChatFormatting.YELLOW))
    .withStyle(ChatFormatting.GREEN)
```
The number is formatted per player, so a value like `1.50` renders as `1,50` for a player whose language uses a comma as the decimal separator.

## Sending text to players
`TranslatedText` knows how to render and deliver itself.
Because it resolves per player, you can hand it a whole collection of players and each one receives the message in their own language.

### To a single player
```kotlin
translate("switch_message", other.scoreboardName)
    .withStyle(ChatFormatting.GREEN)
    .sendTo(player)
```
Pass `true` as the second argument to send it to the action bar (overlay) instead of the chat:
```kotlin
translate("switch_message", other.scoreboardName)
    .withStyle(ChatFormatting.GREEN)
    .sendTo(player, true)
```

### To many players
`sendTo` also accepts any `Iterable<ServerPlayer>`.
The minigame extensions give you the common collections:

| Collection                  | Recipients                         |
|-----------------------------|------------------------------------|
| `allPlayers()`              | Everyone on the server.            |
| `players()`                 | The participants of this minigame. |
| `PlayerLookup.level(world)` | Everyone in the given world.       |

```kotlin
translate("chest_refill").withStyle(ChatFormatting.AQUA).sendTo(allPlayers())

translate("switch_announcement", styled(secs, ChatFormatting.YELLOW))
    .withStyle(ChatFormatting.GREEN)
    .sendTo(players())
```

### Resolving without sending: `translateFor`
`sendTo` writes to chat or the action bar.
When you need the resolved text for something else (a title, an item name, a boss bar, a per-team broadcast), use `translateFor(player)`.
It resolves the text for that player's language and returns a `Component` you can pass anywhere:
```kotlin
Title.get(player).title(Component.empty(), prepareMsg.translateFor(player))

stack.set(DataComponents.ITEM_NAME, name.translateFor(player))
```

### Other rendering methods
`TranslatedText` exposes a few more resolution helpers:

| Method                               | Purpose                                                        |
|--------------------------------------|----------------------------------------------------------------|
| `translateFor(player)`               | Resolve to a `Component` for the player's language.            |
| `translateTo(language)`              | Resolve for an explicit language string (e.g. `"en_us"`).      |
| `acceptEach(players) { p, text -> }` | Resolve for each player and handle the result yourself.        |

`acceptEach` is handy when every player needs custom handling, for example showing the message as a title:
```kotlin
translate("go")
    .withStyle(ChatFormatting.GREEN)
    .acceptEach(players()) { player, text ->
        Title.get(player).title(Component.empty(), text, 5, 30, 5)
    }
```

## Using translations outside a minigame instance
The `translate()` extension is only available on `MiniGameInstance`.
Helper, data and phase classes that are not minigame instances use the kibu `Translations` service directly and call `translateText(...)` on it.

Obtain a `Translations` instance in one of two ways:

- Inside a class that already has the handle, read `gameHandle.translations` (or `gameHandle.getTranslations()` from Java).
- In a standalone helper, inject it through the constructor:

```kotlin
class ChallengeMessengerImpl(
    private val world: ServerLevel,
    private val translations: Translations,
    private val answerId: Identifier
) : ChallengeMessenger {

    fun announceSolution(answer: String) {
        translations.translateText("solution", styled(answer, ChatFormatting.YELLOW))
            .withStyle(ChatFormatting.GREEN)
            .sendTo(PlayerLookup.level(world))
    }
}
```

`translations.translateText(key, args)` returns the same deferred `TranslatedText` as the `translate()` extension (in fact the extension just delegates to it).
`Translations` also offers eager overloads when you already know the player or language:

| Call                               | Returns                                           |
|------------------------------------|---------------------------------------------------|
| `translateText(key, args)`         | `TranslatedText` (deferred, resolved per player). |
| `translateText(player, key, args)` | `RootText` already resolved for that player.      |
| `translate(player, key, args)`     | The raw resolved `String`.                        |

> **Note**: every `Translations` instance a minigame sees is already scoped to that minigame, whether you reach it through the `translate()` extension or through `gameHandle.translations`.
> Keys therefore stay relative in both cases.

## How translations are loaded
This section describes the internals.
You do not need it to use translations, but it explains why keys are relative and how a language file becomes a live translation.

### Language files
Each minigame module ships its own JSON language files under `src/main/resources/lang/`, one per locale:
```
src/minigames/killeporter/src/main/resources/
  fabric.mod.json
  lang/
    en_us.json
    de_de.json
```

The keys inside are written **relative**, without the game prefix:
```json
{
  "name": "Killeporter",
  "switch_message": "You where swapped with %s!",
  "switch_announcement": "You will be swapped in the next %s seconds!",
  "chest_refill": "All Containers have been refilled!"
}
```

### Automatic key prefixing
Every minigame has a title key derived from its identifier in `GameInfo.kt`:
```kotlin
val titleKey: String
    get() = "game.${id.namespace}.${id.path}"
```
For Killeporter (`ap2:killeporter`) this is `game.ap2.killeporter`.

The bare keys from the language file are combined with this prefix by two cooperating pieces:

- At **load time**, `PrefixTranslationLoader` rewrites every key it reads.
  `"switch_message"` becomes `game.ap2.killeporter.switch_message`, and the special key `"name"` (`BASE_KEY`) maps to the bare prefix `game.ap2.killeporter`, which is the game's display title.
- At **lookup time**, `GameScopedTranslator` prefixes the keys you pass in code the same way, so `translate("switch_message")` looks up `game.ap2.killeporter.switch_message`.

`GameScopedTranslator` also falls back to the raw key when no prefixed translation exists:
```kotlin
override fun translate(locale: String, key: String): String {
    val scoped = prefixed(key)

    if (parent.hasTranslation(locale, scoped)) {
        return parent.translate(locale, scoped)
    }

    return parent.translate(locale, key)
}
```
This is why a fully qualified shared key still works from inside a game.
`translate("ap2.score.blocks_away")` is not found under the game prefix, so it resolves through the fallback to the shared `ap2.*` translations.

### Discovery
On startup, `ArcadePartyFactory.createTranslationLoader()` builds one combined loader (a `MultiTranslationLoader`) from several sources:

- The library's own assets, discovered by kibu's `ModTranslations` from the mod's `assets/<id>/lang/` folder. These are the shared `ap2.*` keys.
- Vanilla `death.*` messages, provided by `VanillaTranslations`.
- Each minigame's `lang/` folder, loaded from the module resources and wrapped in a `PrefixTranslationLoader` with that game's title key.

The low-level loading and locale handling are done by the `translations4j` engine (`UrlArchiveTranslationLoader.ofJson` reads the JSON files), while kibu resolves each player's language server side through a `LanguagePreferenceProvider`.
The result is a single translation table where every minigame's keys live under their own prefix, and the `translate()` / `translations.translateText(...)` calls shown above resolve against it per player.
