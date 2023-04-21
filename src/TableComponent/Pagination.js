import React from "react";

const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
  const pageNumbers = [];

  // Calculate the total number of pages
  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  let displayPages = [];
  if (pageNumbers.length <= 4) {
    displayPages = pageNumbers;
  } else if (currentPage <= 2) {
    displayPages = [1, 2, 3, "...", pageNumbers.length];
  } else if (currentPage >= pageNumbers.length - 1) {
    displayPages = [
      1,
      "...",
      pageNumbers.length - 2,
      pageNumbers.length - 1,
      pageNumbers.length,
    ];
  } else {
    displayPages = [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      pageNumbers.length,
    ];
  }

  return (
    <nav>
      <ul className="pagination">
        <li className={`page-item${currentPage === 1 ? " disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
        </li>
        {displayPages.map((number, index) => (
          <li
            key={index}
            className={`page-item${currentPage === number ? " active" : ""}`}
          >
            {number === "..." ? (
              <span className="page-link dots">{number}</span>
            ) : (
              <button className="page-link" onClick={() => paginate(number)}>
                {number}
              </button>
            )}
          </li>
        ))}
        <li
          className={`page-item${
            currentPage === pageNumbers.length ? " disabled" : ""
          }`}
        >
          <button
            className="page-link"
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === pageNumbers.length}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
