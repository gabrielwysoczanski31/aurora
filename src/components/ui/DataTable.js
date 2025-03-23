import React from 'react';

const DataTable = ({ 
  columns, 
  data, 
  darkMode, 
  onRowClick, 
  pagination,
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false
}) => {
  // Render loading skeleton
  if (isLoading) {
    return (
      <div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className={darkMode ? 'border-b border-gray-700' : 'border-b'}>
                {columns.map((column, index) => (
                  <th 
                    key={index} 
                    className={`py-2 ${column.align === 'right' ? 'text-right' : 'text-left'}`}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Skeleton rows */}
              {[...Array(5)].map((_, rowIndex) => (
                <tr 
                  key={rowIndex} 
                  className={darkMode ? 'border-b border-gray-700' : 'border-b'}
                >
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className="py-2">
                      <div className={`h-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse`}></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // No data state
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto" role="region" aria-label="Data table">
        <table className="min-w-full" role="table">
          <thead>
            <tr className={darkMode ? 'border-b border-gray-700' : 'border-b'} role="row">
              {columns.map((column, index) => (
                <th 
                  key={index} 
                  className={`py-2 ${column.align === 'right' ? 'text-right' : 'text-left'}`}
                  role="columnheader"
                  scope="col"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr 
                key={rowIndex} 
                className={`
                  ${darkMode ? 'border-b border-gray-700' : 'border-b'}
                  ${onRowClick ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700' : ''}
                `}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                role="row"
                tabIndex={onRowClick ? 0 : undefined}
                onKeyPress={onRowClick ? (e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onRowClick(row);
                  }
                } : undefined}
              >
                {columns.map((column, colIndex) => (
                  <td 
                    key={colIndex} 
                    className={`py-2 ${column.align === 'right' ? 'text-right' : ''}`}
                    role="cell"
                  >
                    {column.cell 
                      ? column.cell(row[column.accessor], row) 
                      : row[column.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {pagination && (
        <div className="mt-4 flex justify-between items-center">
          <p className="text-gray-500">
            Showing {pagination.startItem}-{pagination.endItem} of {pagination.totalItems} results
          </p>
          <div className="flex space-x-1" role="navigation" aria-label="Pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button 
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-3 py-1 rounded ${
                  page === currentPage 
                    ? (darkMode ? 'bg-gray-700' : 'bg-gray-200') 
                    : (darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-100 hover:bg-gray-200')
                }`}
                aria-current={page === currentPage ? 'page' : undefined}
                aria-label={`Page ${page}`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default DataTable;