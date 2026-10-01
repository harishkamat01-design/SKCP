import { useEffect, useMemo, useState } from "react";

const usePagination = (
    records = [],
    initialPageSize = 10
) => {
    const [currentPage, setCurrentPage] =
        useState(1);

    const [pageSize, setPageSize] =
        useState(initialPageSize);

    const totalRecords =
        records.length;

    const totalPages = Math.max(
        1,
        Math.ceil(
            totalRecords / pageSize
        )
    );

    useEffect(() => {
        setCurrentPage((previousPage) =>
            Math.min(
                previousPage,
                totalPages
            )
        );
    }, [totalPages]);

    const paginatedRecords = useMemo(() => {
        const startIndex =
            (currentPage - 1) *
            pageSize;

        const endIndex =
            startIndex + pageSize;

        return records.slice(
            startIndex,
            endIndex
        );
    }, [
        records,
        currentPage,
        pageSize,
    ]);

    const handlePageChange = (page) => {
        if (
            page < 1 ||
            page > totalPages
        ) {
            return;
        }

        setCurrentPage(page);
    };

    const handlePageSizeChange = (
        newPageSize
    ) => {
        setPageSize(newPageSize);
        setCurrentPage(1);
    };

    return {
        currentPage,
        pageSize,
        totalPages,
        totalRecords,
        paginatedRecords,
        handlePageChange,
        handlePageSizeChange,
    };
};

export default usePagination;