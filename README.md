# really terrible chess

really terrible chess </br>
:)

[building & running with docker](#building--running-with-docker-compose) |
[building from source](#building-from-source) | [running the executable](#running-the-executable)

## building & running with docker-compose
Requirements:
- **Docker** (https://www.docker.com/products/docker-desktop/)
- **Docker Compose** (https://docs.docker.com/compose/install/) </br></br>

Build & run the docker image
```shell
docker compose build && docker compose up
```

## building from source
Requirements:
- **Java 21** (https://www.oracle.com/java/technologies/downloads/#java21)
- **Node.js** (v22.15.0 or later) and **npm** (v11.3.0 or later) (https://nodejs.org/en/download)
- **PostgreSQL** (https://www.postgresql.org/download/)
```shell
./gradlew build
```

## running the executable
Run the generated ``rtc-server.jar`` file found in the ``build/libs`` directory.
```shell
java -jar build/libs/rtc-server-0.5.jar
```

Alternatively, run the Spring Boot application task.
```shell
./gradlew bootRun
```

