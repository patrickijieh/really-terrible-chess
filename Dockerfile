FROM amazoncorretto:21-alpine3.23

WORKDIR /usr/local/app

COPY src ./src
COPY gradle ./gradle
COPY gradlew ./gradlew
COPY build.gradle.kts ./build.gradle.kts
COPY settings.gradle.kts ./settings.gradle.kts

EXPOSE 8080

RUN apk add nodejs npm

RUN node -v
RUN npm -v

RUN adduser arrteecee -D

RUN chown arrteecee .

USER arrteecee

RUN ./gradlew build

CMD ["./gradlew", "bootRun"]
