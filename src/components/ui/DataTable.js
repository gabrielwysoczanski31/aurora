import React from 'react';

const DataTable = ({ 
  columns, 
  data, 
  darkMode, 
  onRowClick, 
  pagination,
  currentPage,
  totalPages,
  onPageChange
}) => {
  return (
    <>
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
            {data.map((row, rowIndex) => (
              <tr 
                key={rowIndex} 
                className={`
                  ${darkMode ? 'border-b border-gray-700' : 'border-b'}
                  ${onRowClick ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700' : ''}
                `}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((column, colIndex) => (
                  <td 
                    key={colIndex} 
                    className={`py-2 ${column.align === 'right' ? 'text-right' : ''}`}
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
            Wyświetlanie {pagination.startItem}-{pagination.endItem} z {pagination.totalItems} wyników
          </p>
          <div className="flex space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button 
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-3 py-1 rounded ${
                  page === currentPage 
                    ? (darkMode ? 'bg-gray-700' : 'bg-gray-200') 
                    : (darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-100 hover:bg-gray-200')
                }`}
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