# Design Improvements Learned Today

While implementing the **Supplier** entity, I learned several small but important improvements that make the code more robust, maintainable, and production-ready.

---

## 1. Default Status Value

### Implementation

```java
private String status = "ACTIVE";
```

### Why?

Although PostgreSQL already provides a default value (`DEFAULT 'ACTIVE'`), setting the default in Java ensures that:

- Newly created objects always have a valid status before reaching the database.
- The application does not rely solely on database defaults.
- Null values are avoided at the application layer.

### Lesson Learned

> Good software validates and initializes data as early as possible, not only at the database level.

---

## 2. Immutable Creation Timestamp

### Implementation

```java
@Column(nullable = false, updatable = false)
private LocalDateTime createdAt;
```

### Why?

The `created_at` field records when a supplier is first created.

Using:

```java
updatable = false
```

ensures that:

- The timestamp can only be set during creation.
- It cannot be accidentally modified during updates.
- The audit history remains accurate.

### Lesson Learned

> Creation timestamps should represent the original creation time and must remain immutable.

---

## 3. Descriptive Lifecycle Method Name

### Implementation

```java
@PrePersist
protected void onCreate() {
    ...
}
```

### Why?

The annotation `@PrePersist` controls when the method executes.

The method name itself is not important to Spring Boot.

However, using a descriptive name like `onCreate()` makes the code easier to understand than a generic name such as `prePersist()`.

### Lesson Learned

> Write method names that describe business intent rather than framework events.

---

## 4. Defensive Status Validation

### Implementation

```java
if (this.status == null || this.status.isBlank()) {
    this.status = "ACTIVE";
}
```

### Why?

Even though a default value is defined, this check protects against situations where:

- A developer explicitly sets the status to `null`.
- An empty string is received from an API.
- Future code accidentally clears the status.

This guarantees that every new supplier starts with a valid business status.

### Lesson Learned

> Never assume incoming data is valid—validate it before saving.

---

# Overall Learning

Today's implementation reinforced that writing production-ready software is not just about making the code work.

It is also about:

- Preventing future bugs
- Protecting business data
- Improving readability
- Following enterprise coding practices

Small design decisions today reduce maintenance effort and improve software quality over the long term.

---

## Recommendation

Going forward, I will add a **"Design Improvements Learned Today"** section to every day's **Learning Summary**.

Over time, this will become my personal collection of Software Engineering best practices—not just a record of completed tasks, but a knowledge base documenting *why* certain design decisions were made.
---

