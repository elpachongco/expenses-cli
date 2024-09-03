#!/usr/bin/env python3
"""
Expenses Calculator

FILE FORMAT

- HEADER

DATE, ITEM NAME, AMOUNT, PRICE, CATEGORY

DATE - ISO8601 String or variants OR "UPCOMING"
ITEM NAME - String name
AMOUNT - Number followed by unit e.g. 8.5kg, 1.2L
PRICE - Financial number
CATEGORY - Category of item e.g. "BILLS". Can be grouped by "/" e.g. BILLS/UTILITY, BILLS/RENT,


OUTPUT

{

}

"""
import csv
import argparse
import json
from typing import Any, Dict
from rich import print

parser = argparse.ArgumentParser(prog="Expenses.csv processor", description="")
parser.add_argument("filename", type=str)


def main() -> None:
    args = parser.parse_args()
    filename: str = args.filename

    month: Dict[Any, Any] = {}
    day: Dict[Any, Any] = {}
    categories: Any = {}

    with open(filename) as csv_file:
        reader = csv.reader(csv_file)
        prev_date = None
        for count, row in enumerate(reader, start=1):
            # CSV Row can be empty
            if not row or count == 1 or len(row) != 5 or not row[3]:
                continue

            current_date = row[0] or prev_date
            if current_date != prev_date:
                prev_date = current_date
            current_month = (
                current_date[:7]
                if current_date and current_date != "UPCOMING"
                else "UNKNOWN"
            )

            price = float("".join(row[3].replace(",", "").split()))
            # print(price, current_date)

            day[current_date] = {
                "total": (
                    day[current_date]["total"] + price if current_date in day else price
                )
            }
            month[current_month] = {
                "total": (
                    month[current_month]["total"] + price
                    if current_month in month
                    else price
                )
            }
            category = row[4].strip().upper() or "UNKNOWN"
            categories[category] = categories[category] + price if category in categories else price

    data: Dict[Any, Any] = {
        "month": month,
        "day": day,
        "categories": categories
    }
    print(json.dumps(data, indent=4))


if __name__ == "__main__":
    main()
