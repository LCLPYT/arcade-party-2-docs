---
outline: deep
---

# Minigame factory
This chapter explains the minigame factory: the object that turns a `MiniGameHandle` into a running `MiniGameInstance`.
It covers the factory interface, when the factory runs, the ready-made factories you can reuse, and how to write your own.

A factory is responsible for the setup work that has to happen before the game instance can exist.
This usually means opening a random [map](/develop/basics/terminology.md#maps--game-maps), and optionally loading a map schema or creating a [team manager](/develop/developing-minigames/team-minigames.md#the-team-manager).
Once everything is ready, the factory constructs the instance and hands it all of its dependencies.

Every [minigame](/develop/basics/minigames.md) returns its factory from `MiniGame.createFactory()`.

## The factory interface
A factory implements the `MiniGameFactory` interface, a single-method (SAM) interface:
```kotlin
fun interface MiniGameFactory {
    suspend fun createInstance(handle: MiniGameHandle): MiniGameInstance
}
```

It receives a [`MiniGameHandle`](#the-handle) (the game's runtime context) and returns a `MiniGameInstance` (the live game).

The method is a `suspend` function because setup is asynchronous.
Opening a map loads a Minecraft world in the background, so the factory suspends until the world is ready and then resumes on the server thread.
This lets you write the setup as straight-line code even though the underlying map API is callback-based.

## When the factory runs
The factory sits between minigame discovery and the running game:

1. Minigames are discovered through the `ap2:minigame` [Fabric entrypoint](/develop/developing-minigames/create-a-minigame.md#create-a-fabric-entrypoint-with-fabric-mod-json).
2. The [arcade party mode](/develop/basics/terminology.md#arcade-party-mode) picks the next game and builds a `MiniGameHandle` for it.
3. It calls `miniGame.createFactory()` to obtain the factory.
4. It calls `factory.createInstance(handle)`, which suspends while the map opens (and the schema loads), then returns the instance.
5. The instance is wired up and `instance.start()` is called.

> **Note**: You never call `createInstance()` yourself. You only implement or choose a factory and return it from `createFactory()`; the mode invokes it at the right time.

## Provided factories
For the common cases you do not need to write a factory at all.
The `lib` module provides ready-made factories.
Each one opens a random map, and some do extra setup on top:

| Factory                         | Opens a map | Team manager | Map schema |
|---------------------------------|-------------|--------------|------------|
| `MapLevelGameFactory`           | yes         | no           | no         |
| `MapLevelTeamGameFactory`       | yes         | yes          | no         |
| `MapLevelSchemaGameFactory`     | yes         | no           | yes        |
| `MapLevelTeamSchemaGameFactory` | yes         | yes          | yes        |

You select one from `createFactory()` and pass it a reference to your instance constructor:
```kotlin
override fun createFactory() = MapLevelGameFactory(::SpleefInstance)
```

The `::YourInstance` reference is the constructor of your `MiniGameInstance`.
Which arguments the factory passes to it depends on the factory you chose:

- `MapLevelGameFactory(::YourInstance)`: passes `(handle, level, map)`. The most common case.
- `MapLevelTeamGameFactory(::YourInstance)`: passes `(handle, level, map, teamManager)`. Creates a [`TeamManager`](/develop/developing-minigames/team-minigames.md#the-team-manager) for you.
- `MapLevelSchemaGameFactory(YourSchema::class.java, ::YourInstance)`: passes `(handle, level, map, schema)`. Loads a typed map schema from the opened map.
- `MapLevelTeamSchemaGameFactory(YourSchema::class.java, ::YourInstance)`: passes `(handle, level, map, teamManager, schema)`. Both a team manager and a schema.

So your instance constructor's parameter list must match the factory.
For example, a schema game's instance constructor starts with `(gameHandle, level, map, schema, ...)`.
Otherwise, use a trailing lambda to explicitly create your minigame instance from the provided arguments.
That way, you can also pass additional arguments to your instance.

## Writing a custom factory
Reach for a custom factory when the standard map/schema flow is not enough, for example when setup needs extra I/O, custom map handling, or when the game uses no map at all.

Implement `MiniGameFactory` directly and do the setup inside `createInstance`:
```kotlin
class YourGameFactory : MiniGameFactory {

    override suspend fun createInstance(handle: MiniGameHandle): MiniGameInstance {
        val (level, map) = handle.openRandomMap()

        // additional setup, e.g. loading extra data, setting up the map

        return YourGameInstance(handle, level, map)
    }
}
```

Return it from your minigame class:
```kotlin
override fun createFactory() = YourGameFactory()
```

Some reusable suspend helpers are available on `MiniGameHandle`, and the provided factories are built on them:

- `handle.openRandomMap()` returns a `Pair<ServerLevel, GameMap>` once a random map for the game has been opened.
- `handle.loadSchema(level, schemaClass)` awaits the opened map's world data and loads a typed schema from it.

For a game that does not use maps, create a custom world instead of calling `openRandomMap()`; see [minigames without maps](/develop/developing-minigames/minigames-without-maps.md).

Several games ship their own factory this way (for example `PvpTournamentFactory`, `PaintballFactory`, and `DanceFloorFactory`), each doing game-specific setup before constructing the instance.

## The MiniGameHandle
The `MiniGameHandle` passed to the factory is the game's runtime context.
It exposes the services the game needs, such as the map and world facades, [hooks](/develop/developing-minigames/minigame-logic.md#hooks), the [scheduler](/develop/developing-minigames/minigame-logic.md#scheduler-tasks), translations, the participants, and the team, scoreboard, and boss-bar services, along with lifecycle methods like `complete(results)`.

The factory uses the handle to perform setup and then forwards it (and whatever it produced) to the instance, where the actual [game logic](/develop/developing-minigames/minigame-logic.md) lives.
