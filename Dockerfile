FROM amazoncorretto:21-alpine3.23

WORKDIR /usr/local/app

COPY ./src src
COPY ./gradle gradle
COPY ./gradlew ./build.gradle.kts ./settings.gradle.kts ./

EXPOSE 8080

RUN apk add nodejs npm

RUN adduser arrteecee -D

RUN chown -R arrteecee ./

USER arrteecee

RUN ./gradlew build

CMD ["./gradlew", "bootRun"]
