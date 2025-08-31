---
outline: deep
---

# Development Project Setup
First of, it is recommended to develop under Linux / macOS. 
Windows can also be used, but some tools may not work properly.

Arcade Party 2 is a server-side mod that runs via the [Fabric mod loader](https://fabricmc.net/).
Every tutorial about modding with Fabric is also applicable to Arcade Party 2, but remember that no client-side libraries are available.
If you want to read about modding with Fabric you can read the [Fabric Wiki](https://wiki.fabricmc.net/tutorial:start#creating_your_first_mod) and the [Fabric Documentation](https://docs.fabricmc.net/develop/).

## Prerequisites
- [IntelliJ IDEA](https://www.jetbrains.com/idea/) - to develop Kotlin and Java. The community edition, which is open source and free, suffices. Other editors may also be used, but IntelliJ is strongly recommended.
- [Python 3](https://www.python.org/) - to execute tools
- [Node.js](https://nodejs.org) - to execute tools, optional
- [Docker](https://www.docker.com/) - if you want to run production images as contains

## Git setup
1. Create a fork of the project on GitHub

2. Clone your fork to your machine (execute in `~/src` or similar):

```bash
git clone git@github.com:<your GitHub user>/arcade-party-2.git
```

3. Open the project directory (`~/src/arcade-party-2` or similar) in IntelliJ.

## IntelliJ Setup
Upon opening the project in IntelliJ for the first time, wait for the Gradle import to finish.

Next, make sure that you use Java 21 as SDK inside `File > Project Structure > Project Settings > Project`.
If you don't have Java 21 installed yet, IntelliJ can download it for you.
When asked about the vendor, pretty much any vendor is fine, but Eclipse Temurin is a solid choice.

### Minecraft Development Plugin
There is an awesome plugin for IntelliJ that helps a lot with developing Minecraft.
It is called [Minecraft Development](https://plugins.jetbrains.com/plugin/8327-minecraft-development) and can be installed within IntelliJ under `Settings > Plugins > Marketplace`.

Once you installed the plugin, restart the IDE and reopen the project.

## Starting a dev server
If everything went well, you can now start the "Minecraft Server" run configuration in the upper right of IntelliJ IDEA.

Please keep in mind, that an error may occur in the console if you don't have the necessary access to the LCLPNetwork endpoints.
To request access, message a project member directly.

### Missing run configuration or error icon
When the configuration is missing or has a red error indicator, try to sync the project in the Gradle tab on the right of the IDE and reopen the project.

If that didn't help, close the project completely, remove the `.idea/` folder using the command line:
```bash
rm -rf .idea/
```
Then, reopen the project, wait for the Gradle sync to complete and reopen the project one last time.
That should fix the run configuration most of the time.
