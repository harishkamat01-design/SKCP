# Questions I Should Always Ask

---

Before creating any database table:

- What business object am I modelling?
- What is its responsibility?
- What information does it own?

---

Before adding any column:

- Who owns this information?
- Can it be calculated?
- Will storing it create duplicate data?

---

Before creating a relationship:

- Is this One-to-One?
- One-to-Many?
- Many-to-Many?

---

Before storing any value:

Ask:

Can I calculate it instead?

If yes,

Don't store it.

Calculate it.

---

Every software decision should start with business, not technology.

---

Before creating a table:

- Who owns this data?
- What business event creates it?
- What process changes it?
- What information should not be stored here?
- Can this be calculated instead of stored?
- Will this scale in the future?

---

