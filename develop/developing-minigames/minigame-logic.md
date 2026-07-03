---
outline: deep
---

# Minigame logic
This chapter is about common elements used in minigame instance classes, used to implement the game flow and the minigame logic.

The most common elements are:
1. Hooks (aka events / callbacks)
2. Scheduled Tasks (delayed or repeated task execution)
3. Protector System (default configuration on what player can do in minigames)

## Hooks
Hooks make up the event-system of the kibu library.
They provide the ability to subscribe to certain in-game events and react to them.
The system is functionally inspired by the lightweight [Fabric event system](https://docs.fabricmc.net/develop/events), with the difference that hooks may be unregistered again after being registered.

The majority of available hooks are singletons you can subscribe to.
Usually all minigame-driven hook registrations happen via a kibu `HookRegistrar` that tracks registrations, in order to automatically free them later.
Minigames should use the hook registrar provided by their `MiniGameHandle`, available through the `hooks` extension property on minigame instance classes.

An example hook registration looks like this:
```kotlin
PlayerInteractionHooks.USE_ITEM.registerWith(hooks) { player, level, hand -> 
    // do some logic here...
    InteractionResult.PASS
}
```
This hook will fire every time a player right-clicks an item.
Depending on the hook, you can sometimes also adjust the vanilla behavior.
For example in this case, if `InteractionResult.FAIL` was to be returned, the default interaction with the item would be cancelled.

## Scheduler Tasks
Tick schedulers provide the possibility to execute tasks delayed or repeating in fixed periods.
They are provided by the kibu library and operate at the Minecraft server tick rate of 20 ticks/sec (1 tick = 0.05s) as the smallest possible time frame. 

Similar to hooks, scheduler task creation in the minigame context is handled by a dedicated `TaskScheduler` tracking created tasks.
Once the minigame ends, all tasks created by it will be destroyed automatically.

There are two scheduler instances available via the `MiniGameHandle`: 
1. the **default scheduler** 
2. the **root scheduler**

Most of the time, you'll likely want to use the default scheduler.
This scheduler will be destroyed once `winManager.complete()` is called.
I.e. once the minigame enters the game-over state, all tasks of the default scheduler are stopped.
The default scheduler instance is also available via the `scheduler` extension property on minigame instance classes.
In contrast, the root scheduler remains active throughout the whole lifespan of a minigame; it is only destroyed once the minigame itself is destroyed.

### Creating delayed tasks
To defer execution of code by some duration, you can use the `runAfter()` extension function within minigame instance classes:
```kotlin
runAfter(5.seconds) {
    // logic goes here
}
```

The default Kotlin duration extensions on ints and doubles may be used to express the duration.
Available duration units include:
- `<Int | Double>.seconds`
- `<Int | Double>.minutes`
- `<Int | Double>.hours`
- `<Int | Double>.ticks`

The `ticks` extension is added by the Arcade Party lib and allows you to express durations in Minecraft game ticks (1 tick = 0.05s).

#### Delayed tasks outside of minigame instances
If you are not within a minigame instance class, you'll have to use the direct method:
```kotlin
scheduler.timeout(ticks) { ->
    // logic goes here
}
```
This method always requires ticks as duration.

#### Cancelling delayed tasks
Both calls return a `TaskHandle`, which can be used to cancel the task prematurely:
```kotlin
val task = runAfter(10.ticks) { ... }

task.cancel()
```

### Creating periodic tasks
To execute logic in periodic intervals, you can use the `runEvery()` extension function within minigame instance classes:
```kotlin
runEvery(10.seconds) {
    // executes every 10 seconds, starting immediately
} 
```

You may also use `deferEvery()` to wait an initial period before executing the task first:
```kotlin
deferEvery(10.seconds) {
    // executes every 10 seconds, starting after 10 seconds
}
```

You can also define a custom initial delay:
```kotlin
runEvery(10.seconds, after = 5.seconds) {
    // executes every 10s, starting after 5s
}
```

If you want to execute some code every tick, you can also use:
```kotlin
runEveryTick {
    // logic here
}
```
This is identical to `runEvery(1.ticks) { ... }`.

#### Completing periodic tasks
You may want to cancel the task from the task itself on some condition in order to stop the task.
Just call `cancel()` within the trailing lambda, which has a `RunningTask` instance as context receiver:
```kotlin
var i = 0

runEvery(2.seconds) {
    i++
    if (i >= 5) cancel()
}
```

#### Cancelling periodic tasks
You may also cancel the task externally, via the returned `TaskHandle`:
```kotlin
val task = runEvery(5.seconds) { ... }

task.cancel()
```

#### Periodic tasks outside a minigame instance
If you are not within a minigame instance class, you need to call the scheduler methods directly:
```kotlin
scheduler.interval(20, 0) { ->
    // logic executed every second (=20 ticks), immediately (=0 ticks initial delay)
}
```
The period and initial delay must be specified in Minecraft server ticks.
The initial delay is optional and defaults to zero.

You can also do the same internal cancellation logic, by explicitly using the `RunningTask` parameter:
```kotlin
scheduler.interval(40) { task ->
    ...
    if (someCondition) task.cancel()
}
```

### Running logic on task completion
You can define a callback that should execute once a task has finished normally:
```kotlin
val task = runEvery(2.seconds) {
    if (someCondition) cancel()
}

task.whenComplete {
    // some logic on complete
}
```

However, this will not be called if the task is canceled externally via the `TaskHandle`.

## Protector System
The protector system is active by default on every minigame.
It is a configurable layer that determines what players can do and can't do.

Some examples of aspects controlled by the protector include:
- entity damage / player pvp
- block placement
- block breaking
- opening containers (chests, furnaces ...)
- modifying inventory
- picking up / dropping items

By default, everything is disallowed.
Players are essentially in a "read-only" state within the world.
Minigames must explicitly allow specific aspects.
This approach ensures players may not perform unintended actions.

The protector system consists out of the following parts:
- protection types: `ProtectionTypes.BREAK_BLOCKS`, `ProtectionTypes.PLACE_BLOCKS` ...
- protection config: defines which protection types are allowed in which scope
- protector implementation: enforces the protection config using [hooks](#hooks) (handled by mg-api automatically)

In Arcade Party, you mostly just modify the protection config for certain protection types.
The concrete protector implementation is abstracted away.

### Modifying the minigame protection config
All changes to the protection config are applied using the `useProtector` extension function on minigame instance classes.
The `useProtector` function takes a function with a `MutableProtectionConfig` context receiver as argument.
That means that `this` will be the protection config you are modifying within the trailing lambda.

For example, if you want to allow block placement, you would call the following:
```kotlin
useProtector {
    ProtectionTypes.PLACE_BLOCKS.allow(this)
}
```

Calling `useProtector` will reset any previous protection configuration, so repeated calls won't be merged.
Only the last call affects the resulting config.

### Protection scopes
You can individually allow or disallow protection types globally, or in certain scopes.
If you don't define a scope, the protection type will be configured in the global scope.

Each protection type has its own scope parameters, but all scopes return a boolean whether the context is within that scope:
```
(...context parameters) -> is within scope?
```

For example, if you want to configure players to only be able to break dirt, but not any other blocks, you would define the following protection rule:
```kotlin
useProtector {
    ProtectionTypes.BREAK_BLOCKS.allow(this) { entity, pos -> 
        entity is ServerPlayer && entity.level().getBlockState(pos).isOf(Blocks.DIRT)
    }
}
```

The same applies to `<ProtectionType>.disallow()`.

### Allowing everything
You can disable all protection rules at once using:
```kotlin
useProtector {
    allowAll()
}
```

Sometimes, you still want to restrict some protection rules again.
For example, if players should be able to do everything except attacking other players, you may disallow that specifically using the following protection rule:
```kotlin
useProtector {
    allowAll()
    
    ProtectionTypes.ALLOW_DAMAGE.disallow(this) { victim, source ->
        victim is ServerPlayer && source.entity is ServerPlayer
    }
}
```

### Protection config outside of minigame instances
If you want to configure the protection config for minigames outside the minigame instance class, you need to call the `protect` function on your `MiniGameHandle` directly:
```kotlin
gameHandle.protect { config ->
    ProtectionTypes.PLACE_BLOCKS.allow(config)
}
```

Please note that the lambda has no context receiver like `useProtector` has.
This means, that the `this` context needs to be qualified using the `config` argument instead.

Similar to `useProtector`, calling `gameHandle.protect()` will reset any previous protection configuration, so repeated calls to `protect` won't be merged.
Only the last call determines the resulting protection config.