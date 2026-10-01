import React from "react";

function Pagination({
    currentPage,
    totalPages,
    totalRecords,
    pageSize,
    onPageChange,
    onPageSizeChange,
}) {
    const startRecord =
        totalRecords === 0
            ? 0
            : (currentPage - 1) * pageSize + 1;

    const endRecord =
        Math.min(
            currentPage * pageSize,
            totalRecords
        );

    const pageNumbers = [];

    for (
        let page = 1;
        page <= totalPages;
        page++
    ) {
        pageNumbers.push(page);
    }

    return (
        <div className="pagination-container">

            <div className="pagination-info">
                Showing {startRecord}–{endRecord} of{" "}
                {totalRecords} records
            </div>

            <div className="pagination-controls">

                <button
                    type="button"
                    className="btn secondary"
                    onClick={() =>
                        onPageChange(currentPage - 1)
                    }
                    disabled={currentPage === 1}
                >
                    Previous
                </button>

                <span className="pagination-page-info">
                    Page {currentPage} of {totalPages}
                </span>

                <button
                    type="button"
                    className="btn secondary"
                    onClick={() =>
                        onPageChange(currentPage + 1)
                    }
                    disabled={
                        currentPage === totalPages
                    }
                >
                    Next
                </button>

                <select
                    value={pageSize}
                    onChange={(event) =>
                        onPageSizeChange(
                            Number(event.target.value)
                        )
                    }
                    className="pagination-page-size"
                >
                    <option value={10}>
                        10
                    </option>

                    <option value={25}>
                        25
                    </option>

                    <option value={50}>
                        50
                    </option>
                </select>

                <span className="pagination-page-size-label">
                    rows
                </span>

            </div>
        </div>
    );
}

export default Pagination;