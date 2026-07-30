# Architect Thinking

---

## Observation 1

Earlier, whenever I needed new information, I immediately thought:

"Add another column."

Now my thinking process has changed.

Before adding any column, I ask:

- Who owns this information?
- Can this information be calculated?
- Should this information be stored?

This simple habit prevents poor database design.

---

## Observation 2

A database should not be designed around tables.

It should be designed around business operations.

Business

↓

Business Rules

↓

Data Ownership

↓

Normalization

↓

Database

---

## Observation 3

Master Data and Transaction Data have different responsibilities.

Master Data defines the business.

Transaction Data records what happens in the business.

This understanding makes database design much simpler.

## Observation 4

A software architect does not start with tables or code.

The architect starts with:

Business

↓

Processes

↓

Ownership

↓

Data

↓

Technology



