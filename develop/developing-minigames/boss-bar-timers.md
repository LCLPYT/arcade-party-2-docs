---
outline: deep
---

# Boss bar timers
Many minigames are built around a countdowns. 
A boss bar timer shows that countdown to every player as a boss bar at the top of the screen and runs a callback when the time runs out.

This chapter explains how to create and control boss bar timers with the
`createTimer` API, and how the timer works under the hood. 

A running timer renders as a titled boss bar with the progress draining from full to empty as time passes. 
The title is the subject you provide, followed by the remaining time. 
For example:

```
Survive 1min 30sec
```

## The general idea
Working with a boss bar timer involves three steps:

1. **Create** the timer with `createTimer`, passing a label and a duration. 
   This builds the boss bar, shows it to all online players, and starts the countdown immediately.
2. **React** to the timer finishing by registering a `whenDone` callback, which usually ends the round or the game.
3. **Clean up** if the timer needs to disappear before it finishes, by calling `stop()`. 
   When the game ends, timers are torn down automatically.

Everything else, like updating the bar each second, formatting the remaining time etc. is handled automatically.

## The quick way: `createTimer`
`createTimer` is an extension for `MiniGameInstance` or [`MiniGameHandle`](/develop/developing-minigames/minigame-factory.md#the-minigamehandle):

```kotlin
fun MiniGameInstance.createTimer(
    subject: Any,
    duration: Duration,
    color: BossEvent.BossBarColor = BossEvent.BossBarColor.RED,
): BossBarTimer
```

- `subject`: the label shown in front of the remaining time. Pass a `TranslatedText` from [`translate(...)`](/develop/developing-minigames/translations.md)
  so the label is localized per player. 
  A plain `String` works too. 
  The subject is rendered in bold aqua by default.
- `duration`: how long the countdown runs, as a `kotlin.time.Duration`. 
  Use the duration builders such as `90.seconds` or `2.minutes`. 
  The duration is converted to Minecraft ticks internally (20 ticks per second).
- `color`: the boss bar color, defaulting to `BossEvent.BossBarColor.RED`

A minimal timer looks like this:

```kotlin
val timer = createTimer(translate("time_left"), 90.seconds)
```

That single call builds the boss bar, adds every online player as a viewer and starts the countdown right away. 
It returns a `BossBarTimer` you can hold on to in order to react to completion, stop it early, or pause it.

> **Note**: `createTimer` adds all players that are online at the moment it is called. 
> Players who join afterward do not see the bar unless you add them yourself with `timer.addPlayers(...)`.

## Reacting when the timer ends
The timer does nothing on its own when it finishes. 
Register a callback with `whenDone` to run your end-of-time logic:

```kotlin
createTimer(subject, DURATION).whenDone(winManager::complete)
```

The callback runs once, at the moment the bar empties, right before the bar is hidden. 
You can register more than one callback, and they all run. 
A trailing lambda works just as well as a method reference:

```kotlin
createTimer(subject, DURATION).whenDone {
    gradePlayers()
    winManager.complete()
}
```

## Stopping and pausing
Hold on to the returned `BossBarTimer` to control it during the game.

`stop()` cancels the countdown and hides the boss bar immediately. 
Use it to remove the timer before it naturally finishes, for example when a round ends early:

```kotlin
private var ejectTimer = createTimer(translate("eject"), EJECT_MAX_TIME)

ejectTimer.stop()
```

`setPaused(true)` freezes the countdown without removing the bar. 
The title switches to a paused variant (`Answer paused`) until you call `setPaused(false)`.
`isPaused()` reports the current state.

> **Note**: you rarely need to call `stop()` at the end of a game. 
> The timer runs on the game's [scheduler](/develop/developing-minigames/minigame-logic.md#scheduler-tasks),
> which is stopped automatically the moment someone win.

## Choosing the appearance
The `color` parameter covers the common case. 
For finer control, build the timer yourself with `BossBarTimer.builder(...)` and start it manually. 
This is how you enable the countdown alert sound:

```kotlin
val timer = BossBarTimer.builder(translations, translations.translateText("answer"))
    .withAlertSound(true)
    .withColor(BossEvent.BossBarColor.RED)
    .withDurationTicks(durationTicks)
    .build()

timer.addPlayers(players)
timer.whenDone { onTimerOver() }
timer.start(gameHandle.bossBarProvider, scheduler)
```

The builder options are:

| Option                       | Default   | Effect                                                                 |
|------------------------------|-----------|------------------------------------------------------------------------|
| `withColor(color)`           | `GREEN`   | The boss bar color. `createTimer` overrides this default to `RED`.     |
| `withDurationTicks(ticks)`   | `600`     | Countdown length in ticks (600 ticks = 30 seconds).                    |
| `withAlertSound(enabled)`    | `false`   | Plays a note block pling to every viewer during the final 5 seconds.   |
| `withCycleColor(enabled)`    | `false`   | Rotates the bar through all boss bar colors, one step per second.      |
| `withIdentifier(id)`         | random    | A stable identifier for the bar. A random one is generated if unset.   |

Building the timer yourself is also what `createTimer` does internally.

> **Note**: there is currently no API to add or remove time from a running timer. 
> The remaining time is fixed at creation. 

## The `useTaskTimer` shortcut
Games that use a [task display](#) can simply use `useTaskTimer` to make the task display a timer:

```kotlin
useTaskTimer(DURATION).whenDone { 
    winManager.complete() 
}
```

## Driving an existing boss bar with `addTimer`
Sometimes you already have a boss bar (for example a task display) and only want its progress to drain over time.
You can add this timer behavior using the `addTimer` extension to any boss bar:

```kotlin
addTimer(taskBar, END_TIME).then {
    gradePlayers()
    winManager.complete()
}
```

It updates the given bar's progress from full to empty and returns an `Action`.
Register the on-finish callback with `.then { ... }`. 
Unlike `createTimer`, it does not change the title or color of the boss bar.

## How it works under the hood
The `BossBarTimer` class is from `mg-api`.
The `createTimer` extension from Arcade party configures a builder, adds every online player, and calls `start(bossBarProvider, scheduler)`.

`start()` creates a [`TranslatedBossBar`](/develop/developing-minigames/translations.md) from the `BossBarProvider`, sets it to full progress, 
and schedules itself on the game scheduler to run every tick.

From there the lifecycle is:

1. **Every tick** the remaining time decreases by one.
2. **Every 20 ticks (once per second)** the bar is refreshed: the title is rebuilt with the new remaining time, 
   the progress is set to `remainingTicks / durationTicks`, and the alert sound is played if enabled and 5 or fewer seconds remain.
3. **When the remaining time hits zero** the scheduled task cancels itself. 
   The `whenComplete` handler then hides the bar and runs every `whenDone` callback.

The time is chosen from three translation keys, all provided by `mg-api`, with the time being colored yellow:

| Key                              | Format           | Used when             |
|----------------------------------|------------------|-----------------------|
| `mg-api.countdown.title.minutes` | `%s %smin %ssec` | a minute or more left |
| `mg-api.countdown.title.seconds` | `%s %ssec`       | under a minute left   |
| `mg-api.countdown.title.paused`  | `%s paused`      | the timer is paused   |

## Reference

| Symbol                                          | Purpose                                                                   |
|-------------------------------------------------|---------------------------------------------------------------------------|
| `createTimer(subject, duration, color)`         | Build, show, and start a countdown boss bar. Returns `BossBarTimer`.      |
| `useTaskTimer(duration)`                        | `createTimer` using the game's task label as the subject.                 |
| `addTimer(bossBar, duration)`                   | Drain the progress of an existing `BossEvent`. Returns `Action`.          |
| `BossBarTimer.whenDone(action)`                 | Register a callback that runs when the timer finishes.                    |
| `BossBarTimer.stop()`                           | Cancel the countdown and hide the bar immediately.                        |
| `BossBarTimer.setPaused(paused)` / `isPaused()` | Freeze or resume the countdown.                                           |
| `BossBarTimer.addPlayers(players)`              | Add more viewers to a running timer.                                      |
| `BossBarTimer.builder(translations, subject)`   | Build a timer manually to access `withAlertSound`, `withCycleColor`, etc. |
