# 🚀 SKCP Backend Daily Build & Run Guide

## Purpose

These commands are used every day while developing the Spring Boot backend.

---

# Step 1 – Go to Backend Folder

```bash
cd backend
```

---

# Step 2 – Clean Previous Build

Deletes old compiled files.

```bash
mvn clean
```

Expected Output

```text
BUILD SUCCESS
```

---

# Step 3 – Compile Source Code

Checks Java source code for compilation errors.

```bash
mvn compile
```

Expected Output

```text
BUILD SUCCESS
```

---

# Step 4 – Package the Application

Creates the executable Spring Boot JAR.

```bash
mvn package
```

Expected Output

```text
BUILD SUCCESS
```

Generated File

```text
backend/
└── target/
    └── backend-0.0.1-SNAPSHOT.jar
```

---

# Step 5 – Start Spring Boot

Run the backend application.

```bash
mvn spring-boot:run
```

Expected Output

```text
Started BackendApplication
```

Backend URL

```text
http://localhost:8080
```

---

# Step 6 – Verify Backend

## Browser

Open

```text
http://localhost:8080
```

Expected

```text
SKCP Backend is Running...
```

---

## Actuator Health Endpoint

Open

```text
http://localhost:8080/actuator/health
```

Expected

```json
{
  "status":"UP"
}
```

---

# Step 7 – Stop Server

Press

```text
Ctrl + C
```

---

# Maven Commands Reference

| Command | Purpose |
|----------|---------|
| `mvn clean` | Remove old compiled files |
| `mvn compile` | Compile Java source |
| `mvn package` | Generate executable JAR |
| `mvn spring-boot:run` | Start Spring Boot |
| `Ctrl + C` | Stop Spring Boot |

---

# Daily Development Workflow

```text
Write Code
     │
     ▼
mvn compile
     │
     ▼
Fix Errors
     │
     ▼
mvn package
     │
     ▼
mvn spring-boot:run
     │
     ▼
Test Browser/Postman
     │
     ▼
Modify Code
     │
     └───────────────┐
                     ▼
               Repeat Cycle
```

---

# Maven Lifecycle

```text
clean
   │
   ▼
compile
   │
   ▼
test
   │
   ▼
package
   │
   ▼
install
   │
   ▼
deploy
```

Current SKCP Workflow

```text
clean
compile
package
spring-boot:run
```

---

# Target Folder Structure

```text
backend/
├── src/
├── pom.xml
├── mvnw
└── target/
    ├── classes/
    ├── test-classes/
    ├── surefire-reports/
    ├── backend-0.0.1-SNAPSHOT.jar
    └── backend-0.0.1-SNAPSHOT.jar.original
```

---

# Daily Developer Checklist

```text
□ Open VS Code

□ cd backend

□ mvn clean

□ mvn compile

□ mvn package

□ mvn spring-boot:run

□ Test APIs in Browser/Postman

□ Ctrl + C (Stop Server)

□ git status

□ git add .

□ git commit -m "message"

□ git push
```

---

# Knowledge Notes

- **mvn clean**
  - Deletes the previous build (`target/` folder).

- **mvn compile**
  - Compiles Java code.
  - Detects syntax and compilation errors.

- **mvn package**
  - Creates an executable Spring Boot JAR.

- **mvn spring-boot:run**
  - Starts the embedded Tomcat server.

- **target/**
  - Generated automatically by Maven.
  - Never commit this folder to Git.

---

## Module Progress

```
Module 0 ✔ Project Setup

Module 1 ✔ Business Analysis

Module 2 ✔ Software Architecture

Module 3 ✔ Database Design

Module 4 ✔ Spring Boot Backend Initialized

Current Phase:
➡ Module 4 – Backend Development
➡ Customer Module
```
