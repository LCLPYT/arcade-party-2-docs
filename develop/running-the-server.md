---
outline: deep
---

# Running the development server
This page describes how to run Arcade Party 2 in development mode, either from within
IntelliJ IDEA or headless from a terminal using Gradle.

If you haven't set up the project yet, complete the [project setup](/develop/project-setup.md) first.

## Prerequisites
- A cloned copy of the project (see [project setup](/develop/project-setup.md)).
- **Java 25** installed (or downloaded via the IntelliJ IDEA Java downloader).
- The Gradle wrapper (`gradlew`) that is bundled with the repository. You do **not** need a
  separate Gradle installation.

Arcade Party 2 is a server-side [Fabric](https://fabricmc.net/) mod and is built with
[Fabric Loom](https://github.com/FabricMC/fabric-loom). Loom provides a development server
that downloads a matching Minecraft server, loads the mod, and runs everything from the
project's `run/` directory.

## Accepting the EULA
On the very first run you have to accept the [Minecraft EULA](https://www.minecraft.net/en-us/eula).
If the server stops complaining about the EULA, open `run/eula.txt`, set:

```properties
eula=true
```

and run `./gradlew runServer` again.

## From IntelliJ IDEA
After the Gradle import finishes, IntelliJ picks up the bundled run configurations.

1. Select the **Minecraft Server** run configuration in the top-right of the IDE.
2. Press the run (or debug) button.

The server starts in the IDE console with its working directory set to `run/`. Running the
debug configuration lets you set breakpoints and hot-swap code while the server is running.

There is also a **Generate Resources** run configuration which runs the data/resource
generation. Use it when you change generated assets (the Gradle equivalent is
`./gradlew runGenResources`).

::: tip Missing or broken run configuration
If the run configuration is missing or shows a red error icon, re-sync the Gradle project and
reopen it. See [project setup](/develop/project-setup.md#missing-run-configuration-or-error-icon)
for the full troubleshooting steps.
:::

## Headless from the terminal (Gradle)
You can run the same development server without an IDE using the Gradle wrapper.

::: code-group
```bash [Linux / macOS]
./gradlew runServer
```

```bat [Windows]
gradlew.bat runServer
```
:::

Loom prepares the `run/` directory, downloads the development Minecraft server, builds the
mod, and launches the server with the mod loaded. The server runs in the **foreground**.
To stop it, type `stop` in the console or press `Ctrl+C`.

### Other useful tasks
```bash
./gradlew runGenResources   # run resource / data generation
./gradlew build             # build the mod jar into build/libs/
```

## Building only some minigames
When you are working on a single minigame, you can restrict the build to a subset to speed
up compilation. If you don't set anything, the full project is built (the default).

Selection is controlled by two settings, `ap2.games` and `ap2.modes`, each a comma separated
list of names.

From the terminal, pass them per run with `-P`:

::: code-group
```bash [Linux / macOS]
# run the server with only Task Rush
./gradlew runServer -Pap2.games=task_rush

# multiple minigames (and optionally narrow the mode)
./gradlew runServer -Pap2.games=task_rush,paintball -Pap2.modes=default
```

```bat [Windows]
gradlew.bat runServer -Pap2.games=task_rush
gradlew.bat runServer -Pap2.games=task_rush,paintball -Pap2.modes=default
```
:::

When running with IntelliJ IDEA or other IDEs, create a `dev.local.properties` file in the project root with your
selection:

```properties
ap2.games=task_rush
```

Then re-sync Gradle. 
The **Minecraft Server** run configuration now builds and loads only the selected minigames. 
Delete the file (or remove the key) and re-sync to restore the full project.

::: info
Using the `dev.local.properties` file will also disable any IDE features and will remove the files temporarily from the index for excluded games / modes.
:::

## Connecting
Once the server is up, connect from a Minecraft Java client of the matching version by
joining `localhost` (default port `25565`).

::: warning LCLPNetwork access
You may see an error in the console if you don't have access to the LCLPNetwork endpoints.
This is expected for external contributors and does not prevent local testing. To request
access, message a project member directly.
:::

## Offline mode
If you have no internet connection, you need to set the Minecraft server to offline mode.

Change the following property in `run/server.properties`:
```properties
online-mode=false
```

You can then join the server without a valid Minecraft session.
Keep in mind that authentication will not work in offline mode.
Thus, you also cannot be a server operator normally.
However, you can set the following java flag to make everyone an operator automatically:
`-Dap2.offline_all_operators=true`.
You can set it in the IntelliJ IDEA run configuration, for example.