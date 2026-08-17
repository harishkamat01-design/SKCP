# 📄 Backend Development Guide
## When Should I Build the Project?

**Date:** 03-08-2026

---

# Question

Why do we run **Step 4 – Build** every time?

cd backend

mvn clean

mvn compile

mvn package

mvn spring-boot:run
---

# Answer

**Short Answer:**

❌ No, we do **NOT** need to build the project every time.

The build process depends on **what has changed**.

---

# During Normal Development

While writing backend code (Controller, Service, Repository, Entity), the recommended workflow is:

```text
Edit Code
      ↓
Save File (Ctrl + S)
      ↓
Spring Boot DevTools detects changes
      ↓
Application Restarts Automatically
      ↓
Test in Postman
```

No build is required.

---

# Since DevTools is Enabled

Our project already includes Spring Boot DevTools.

That means:

- Save Java file
- Wait a few seconds
- Spring Boot restarts automatically
- Test immediately in Postman

No Maven commands required.

---

# When Should I Use Each Maven Command?

## 1. mvn clean

Purpose

Deletes old compiled files.

Use when:

- Starting a fresh build
- Cleaning previous artifacts

Command

```bash
mvn clean
```

---

## 2. mvn compile

Purpose

Checks whether Java code compiles successfully.

Use when:

- Large code changes
- Unsure whether project compiles

Command

```bash
mvn compile
```

---

## 3. mvn package

Purpose

Creates an executable Spring Boot JAR.

Use when:

- Module completed
- End of the day
- Before deployment
- Before Git commit (optional)

Command

```bash
mvn clean package
```

Output

```
target/
backend-0.0.1-SNAPSHOT.jar
```

---

## 4. mvn spring-boot:run

Purpose

Starts the Spring Boot application.

Use when:

- Beginning development
- After stopping the application

Command

```bash
mvn spring-boot:run
```

---

# Recommended Daily Workflow

## Morning

```bash
cd backend

mvn spring-boot:run
```

---

## During Development

```text
Write Code
     ↓
Save File
     ↓
DevTools Restarts
     ↓
Test in Postman
```

Repeat throughout the day.

---

## If DevTools Does NOT Restart

Stop application

```
Ctrl + C
```

Restart

```bash
mvn spring-boot:run
```

---

## End of the Day

Create a fresh executable build.

```bash
mvn clean package
```

---

# SKCP Backend Development Workflow

```text
Start Development
        │
        ▼
mvn spring-boot:run
        │
        ▼
Write Java Code
        │
        ▼
Ctrl + S
        │
        ▼
DevTools Auto Restart
        │
        ▼
Test in Postman
        │
        ▼
Repeat
        │
        ▼
End of Day
        │
        ▼
mvn clean package
```

---

# Best Practice for SKCP

| Activity | Command Required |
|----------|------------------|
| Edit Controller | ❌ No |
| Edit Service | ❌ No |
| Edit Repository | ❌ No |
| Edit Entity | ❌ No (DevTools restart is enough) |
| Start Application | ✅ `mvn spring-boot:run` |
| Create Executable JAR | ✅ `mvn clean package` |
| Deployment | ✅ `mvn clean package` |

---

# Learning Outcome

Today I learned that **building the project is not required after every code change**.

With Spring Boot DevTools enabled:

- Save the code
- DevTools automatically restarts the application
- Continue testing in Postman

This significantly speeds up backend development.