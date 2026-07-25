# Decision Log

**Date:** 2026-07-24

---

# Decision 1

## Title

Business-First Architecture

### Decision

The SKCP system architecture will always be designed based on the real business workflow before considering UI, database, or implementation.

### Reason

Understanding the business first leads to simpler, more maintainable software.

---

# Decision 2

## Title

Three Core Business Domains

### Decision

The complete business will be organized into three primary domains:

- Raw Materials
- Production
- Sales

All future modules, entities, and features should belong to one of these domains.

### Reason

These three domains accurately represent the real factory operations.

---

# Decision 3

## Title

Preserve Founder Knowledge

### Decision

SKCP should capture and preserve the founder's years of business experience instead of relying only on manual knowledge.

### Reason

Business knowledge is an organizational asset and should become part of the software.

---

# Decision 4

## Title

Decision Support Vision

### Decision

SKCP should evolve beyond being a record-keeping application.

Long-term vision:

Information

↓

Reports

↓

Insights

↓

Recommendations

↓

Business Decisions

### Reason

The system should actively help improve business decisions.

---

# Decision 5

## Title

Documentation Philosophy

### Decision

Documentation will be completed during End Of Day (EOD) instead of interrupting the learning flow.

### Reason

Learning should remain natural and uninterrupted while ensuring that all important discoveries are documented before closing the day.

---

# Decision 6

## Title

Lessons Learned Documents

### Decision

Files named `99-*-Lessons-Learned.md` will only be created after substantial knowledge has been accumulated across multiple modules.

### Reason

Lessons Learned should represent earned experience rather than notes from a single day.

---

# Decision 7

## Title

Repository Refactoring

### Decision

Repository cleanup, folder restructuring, README improvements, and documentation consistency will be completed during a dedicated Repository Refactoring Day.

### Reason

Avoid unnecessary interruptions while actively learning and developing.

---

# Decision 8

## Title

Software Engineering Glossary

### Decision

The glossary will be updated only after concepts are fully understood and can be explained with SKCP examples.

### Reason

The glossary should become a practical learning reference rather than a collection of copied definitions.

---

# Decision 9

## Title

Factory Layout Mirrors Business Flow

### Decision

The software architecture should reflect the physical layout of the factory.

Factory Flow:

Raw Material Yard

↓

Mixers

↓

Production Area

↓

Curing Area

↓

Selling Area

↓

Loading Point

↓

Factory Gate

### Reason

The existing factory layout has evolved through years of operational experience. Designing software around this natural workflow makes the system intuitive and easier to use.

---

# Decision 10

## Title

Business Vocabulary Standardization

### Decision

The actual words used inside the factory will become the official business vocabulary of SKCP.

Examples include:

- Ettangi Kallu
- Reti
- Cement Cheela
- Mould
- Current Gone
- Dina
- Trip

These terms will be maintained in the Business Dictionary.

### Reason

Using the same language as the business improves communication between users, developers, testers, and future AI components.

---

# Decision 11

## Title

Customer Trust Before Business Growth

### Decision

Every software feature should strengthen customer trust before attempting to optimize business growth or automation.

Examples include:

- Deliver only fully cured products
- Provide realistic delivery commitments
- Maintain accurate payment records
- Preserve transparency with customers

### Reason

The long-term success of SKCP is built on customer trust rather than short-term sales.

---

# Decision 12

## Title

Software Should Evolve with the Business

### Decision

The architecture should remain flexible so that future business growth can be accommodated without major redesign.

Future expansion may include:

- Multiple products
- Multiple factories
- Additional machines
- AI-assisted decision support
- Customer Portal
- Supplier Portal

### Reason

Building for scalability today reduces redevelopment effort and protects the long-term investment in SKCP.

---

# End of Day Summary

Today's decisions established the business and architectural foundation of SKCP.

These decisions will guide future database design, backend development, frontend implementation, AI integration, and overall project evolution.

The focus remained on understanding and preserving the real business before writing software.