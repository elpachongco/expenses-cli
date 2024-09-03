# Expenses calculator

My personal expenses calculator

## How I use this calculator

1. Keep a file `expenses.csv` in my phone

2. Each transaction recorded in the csv file. 
- Some are aggregated, e.g. If I go to the grocery, I just record 'grocery' (not item per item)
> [!TIP]
> Markor is a nice FOSS Android text editor that supports .csv files

3. From time to time, upload the file to the webpage.

## Structure of expenses.csv

DATE, ITEM NAME, AMOUNT, PRICE, CATEGORY

- DATE - ISO8601 String or variants OR "UPCOMING"
- ITEM NAME - String name
- AMOUNT - Number followed by unit e.g. 8.5kg, 1.2L
- PRICE - Financial number
- CATEGORY - Category of item e.g. "BILLS". Can be grouped by "/" e.g. BILLS/UTILITY, BILLS/RENT,

> [!NOTE]  
> Date doesn't have to be filled in everytime. If a date is added to a row, all other rows that don't have date will use the date from the last row that have a date.


## Example file

```csv
DATE, ITEM NAME, AMOUNT, PRICE, CATEGORY
2024-09-03 12:01, TAXI, 1, 150, TRANSPORTATION
, MEAL, 1, 200, FOOD
, TAXI, 1, 150, TRANSPORTATION
2024-09-04 10:55, GROCERY, 2500, FOOD
```
