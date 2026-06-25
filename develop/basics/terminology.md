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

Maps are stored in an [AssetRepository](#assetrepository).

## AssetRepository
An asset repository is an abstraction for storing and retrieving arbitrary assets in a file-system-like manner.
It is provided by the [mg-api](https://github.com/LCLPYT/mg-lobby) framework.
Assets may be retrieved or listed by an `AssetPath`.

The system is designed so that assets can be organized using a plain file system, with no extra config or registry.
Access to asset repositories is implemented for arbitrary URIs.
That means that assets may be retrieved using local file system URIs, as well as remote URIs over HTTP, for example.

Multiple asset repositories may also be composed in order to source assets from multiple locations.

In addition, caching is implemented for remote repositories, so that subsequent requests to the same assets are fast.

Asset repositories are used for the following features in arcade-party-2:
- minigame maps
- note block songs

In arcade-party-2, asset repository sources can be configured in `run/config/ap2/config.json`.
Sources appearing first are preferred, while later sources are used as fallbacks if the repositories before didn't contain the assets.
For local development, the config may be adjusted to look like this:
```json
{
  "songs_source": ["https://assets.lclpnet.work/release/songs/", "assets/songs"],
  "maps_source": ["https://assets.lclpnet.work/release/maps/", "assets/maps"]
}
```

The repository at `assets.lclpnet.work` is currently only available for some manually selected people.
If you want to get access, please directly contact LCLP.

> **Note:** In the future, the asset repository on lclpnet.work will be opened for anyone.
> It may be however, that not all maps will be available to the public.
> At least one map will be available for each minigame though.

For local development, create the directory `run/assets/maps` to add maps.
If you want to get your minigame merged, please be sure to include required assets for the minigame in order to get them upstreamed.