---
outline: deep
---

# Running with Docker
Arcade Party 2 ships as a container image, so you can run a production-like server with
[Docker](https://docs.docker.com/) or [Podman](https://podman.io/) without setting up a
development environment.

A prebuilt image is published from CI to the GitHub Container Registry at
`ghcr.io/lclpyt/arcade-party-2`. You can either use this prebuilt image or build one yourself
from the repository.

## Using the prebuilt image
Pull the latest image:

```bash
docker pull ghcr.io/lclpyt/arcade-party-2:latest
```

Before starting, you must agree to the [Minecraft EULA](https://www.minecraft.net/en-us/eula)
by setting the `EULA` environment variable to `true`.

A minimal run looks like this:

```bash
docker run -d --name arcade-party-2 \
  -e EULA=true \
  -e MAX_MEMORY=6G \
  -p 25565:25565 \
  -p 24454:24454/udp \
  -v ap2-data:/data \
  ghcr.io/lclpyt/arcade-party-2:latest
```

The container runs as user `minecraft` (`1000:1000`) by default.

### Environment variables
| Variable     | Required | Default | Description                                           |
|--------------|----------|---------|-------------------------------------------------------|
| `EULA`       | yes      | `false` | Must be `true` to accept the Minecraft EULA.          |
| `MAX_MEMORY` | no       | `2G`    | Maximum JVM heap size (`-Xmx`), e.g. `4G`, `6G`.      |

### Ports
| Port        | Protocol | Description                          |
|-------------|----------|--------------------------------------|
| `25565`     | tcp      | Minecraft server.                    |
| `24454`     | udp      | In-game voice chat (optional).       |

### Volumes
| Path    | Description                                  |
|---------|----------------------------------------------|
| `/data` | Server data (world, configs, logs); read/write. |

Using a named volume (`-v ap2-data:/data` above) is the simplest option. If you prefer a bind
mount to a host directory, read the ownership notes below.

## Bind-mount file ownership
When you bind mount the `/data` volume to a host directory, file ownership matters because the
container writes files as uid/gid `1000:1000`.

- **Docker (rootful / default):** run the container as your host user so files are owned by you.
  If your host user is already uid `1000`, no change is needed. Otherwise add
  `-u "$(id -u):$(id -g)"` to `docker run` (or set `user: <uid>:<gid>` in `docker-compose.yml`).
- **Docker rootless:** your host user is mapped to root inside the container, so run as root
  with `-u "0:0"` (or `user: 0:0` in compose). Otherwise files end up owned by one of your
  subuids.
- **Podman:** use `--userns=keep-id` together with `-u "$(id -u):$(id -g)"` to run as your
  host uid/gid while keeping the host mapping. Alternatively run as root like Docker rootless.

## Building from the repository
The repository contains a `docker-compose.yml` and a `docker/Dockerfile` that build the image
from source (tagged locally as `arcade-party-2`), instead of pulling the prebuilt `ghcr.io`
image.

First, accept the EULA by writing it into a `.env` file:

```bash
echo "EULA=true" >> .env
```

Then build and start the server:

```bash
docker compose up
```

Other useful commands:

```bash
docker compose build   # rebuild the server image
docker compose rm      # remove the container
```

The compose file exposes the same ports (`25565/tcp`, `24454/udp`) and stores data in a named
`data` volume, with `MAX_MEMORY` set to `6G`.
