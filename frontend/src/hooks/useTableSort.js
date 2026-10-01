import { useMemo, useState } from "react";

const useTableSort = (
    records = [],
    defaultSortKey = null,
    defaultSortDirection = "asc"
) => {
    const [sortKey, setSortKey] =
        useState(defaultSortKey);

    const [sortDirection, setSortDirection] =
        useState(defaultSortDirection);

    const handleSort = (key) => {
        if (sortKey === key) {
            setSortDirection(
                (previousDirection) =>
                    previousDirection === "asc"
                        ? "desc"
                        : "asc"
            );
        } else {
            setSortKey(key);
            setSortDirection("asc");
        }
    };

    const sortedRecords = useMemo(() => {
        if (!sortKey) {
            return records;
        }

        return [...records].sort(
            (first, second) => {
                const firstValue =
                    first?.[sortKey];

                const secondValue =
                    second?.[sortKey];

                if (
                    firstValue === null ||
                    firstValue === undefined
                ) {
                    return 1;
                }

                if (
                    secondValue === null ||
                    secondValue === undefined
                ) {
                    return -1;
                }

                if (
                    typeof firstValue ===
                        "number" &&
                    typeof secondValue ===
                        "number"
                ) {
                    return (
                        (firstValue -
                            secondValue) *
                        (sortDirection === "asc"
                            ? 1
                            : -1)
                    );
                }

                return String(firstValue)
                    .localeCompare(
                        String(secondValue),
                        undefined,
                        {
                            numeric: true,
                            sensitivity:
                                "base",
                        }
                    ) *
                    (sortDirection === "asc"
                        ? 1
                        : -1);
            }
        );
    }, [
        records,
        sortKey,
        sortDirection,
    ]);

    return {
        sortKey,
        sortDirection,
        sortedRecords,
        handleSort,
    };
};

export default useTableSort;