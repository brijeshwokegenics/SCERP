// frontend/app/components/Pagination.js

'use client';

import React from 'react';

const Pagination = ({ page, pages, onPageChange }) => {
  const pageNumbers = [];

  // Generate page numbers
  for (let i = 1; i <= pages; i++) {
    pageNumbers.push(i);
  }

  if (pages === 1) return null; // No pagination needed

  return (
    <nav className="mt-4 flex justify-center">
      <ul className="inline-flex items-center -space-x-px">
        {/* Previous Button */}
        <li>
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className={`px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 ${
              page === 1 ? 'cursor-not-allowed opacity-50' : ''
            }`}
          >
            Previous
          </button>
        </li>
        {/* Page Numbers */}
        {pageNumbers.map((num) => (
          <li key={num}>
            <button
              onClick={() => onPageChange(num)}
              className={`px-3 py-2 leading-tight border border-gray-300 hover:bg-gray-100 hover:text-gray-700 ${
                page === num
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-500 bg-white'
              }`}
            >
              {num}
            </button>
          </li>
        ))}
        {/* Next Button */}
        <li>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === pages}
            className={`px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 ${
              page === pages ? 'cursor-not-allowed opacity-50' : ''
            }`}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
