# Architectural Decisions

## Decision 001

SKCP will be designed as a Business Operating System (BOS) focused on solving the operational challenges of Shree Kundodari Cement Products.

## Decision 002

PostgreSQL will be the single source of truth for all business data.

## Decision 003

Inventory will increase through daily production and decrease through sales.

## Decision 004

The application will calculate pricing automatically using:

Final Amount =
(Product Price × Quantity)
− Discount
+ Transport Charges

## Decision 005

One Sales record can contain multiple products.

## Decision 006

Payments will be tracked against each Sale, enabling accurate pending balance calculations.

## Q&A
1 Approximately how many different products does SKCP manufacture?    - one cement solid block with 3 variants
2 Do products have different sizes, colors, or variants? Yes different sizes Solid Block 6"×8"×16" , Solid Block 4"×8"×16" , Solid Block 8"×8"×16"
3 Do you maintain stock, or are products manufactured only after an order is received? we maintain the stock.
4 How many customer orders does your father handle in an average week? 5
5 Is GST included in quotations and invoices? no
6 What is the single most time-consuming daily task? writing all the things in notebook on a daily basis
7 What is the biggest mistake that currently happens because the process is manual? - cant predict the yearly or monthly progress
If SKCP saves your father one hour every day, which task would you want that hour to come from? - How much remaining payment pending from customer after buying
If we could build one AI feature in the first release, what would you want it to be? pending Payment for the customer 
Does one customer place multiple orders over time? - didnt understand this , ask me in someotherway with same meaning
Can one customer have multiple pending payments at the same time? - Yes , currently they have and we can have this option available
Can one order contain multiple block sizes? - yes
Can a customer pay an order in installments? - yes we can keep this option but they will not pay 
Is delivery done by your own vehicle or does the customer arrange transport? - we dont have a delivery vehicle . But we will call the delivery vehicle person as we running this business from last 12 years
Do you manufacture blocks every day or only when stock becomes low?- on a evryday basis we will manufacture

How does your father currently decide the selling price?
For example:
Is the price fixed per block size? yes ex: 4" block --   4" block * 100 (quantity of price 37rs per block ) = 3700 rs INR
Does it change for different customers? 
Is there a discount for large quantities? - sometimes
Does transport cost get added separately? - yes added separately