plugins {
    java
    id("org.springframework.boot") version "3.5.3"
    id("io.spring.dependency-management") version "1.1.7"
}

group = "com.pijieh"

version = "0.5"

java { toolchain { languageVersion = JavaLanguageVersion.of(21) } }

configurations { compileOnly { extendsFrom(configurations.annotationProcessor.get()) } }

repositories { mavenCentral() }

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-websocket")
    implementation("org.postgresql:postgresql:42.7.11")
    implementation("com.google.code.gson:gson:2.13.1")
    implementation("com.mchange:c3p0:0.14.1")
    implementation("org.xerial:sqlite-jdbc:3.50.3.0")
    implementation("org.springframework.security:spring-security-core")
    compileOnly("org.projectlombok:lombok")
    annotationProcessor("org.projectlombok:lombok")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

tasks.withType<Test> { useJUnitPlatform() }

tasks.register<Exec>("buildReactApp") {
    group = "Build"
    description = "Create static files from the React app."
    workingDir("./src/main/react/chess-app")
    commandLine("npm", "run", "build")
}

tasks.bootJar { dependsOn("buildReactApp") }
