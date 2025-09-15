
import React from 'react';
import { useTableSort } from '../hooks/useTableSort';
import { SortConfig, SortDirection } from '../types';

interface Column<T> {
  header: string;
  accessor: keyof T;
  render?: (item: T) => React.ReactNode;
}

interface SortableTableProps<T> {
  columns: Column<T>[];
  data: T[];
}

const SortableTableHeader = <T,>({ columnKey, label, sortConfig, onSort }: {
    columnKey: keyof T,
    label: string,
    sortConfig: SortConfig<T> | null,
    onSort: (key: keyof T) => void
}) => {
    const isSorted = sortConfig?.key === columnKey;
    const directionIcon = sortConfig?.direction === 'asc' ? '▲' : '▼';

    return (
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => onSort(columnKey)}>
            {label} {isSorted && <span className="ml-1">{directionIcon}</span>}
        </th>
    );
};

export const SortableTable = <T extends { id: number | string },>({ columns, data }: SortableTableProps<T>) => {
  const { items: sortedData, requestSort, sortConfig } = useTableSort(data);
  
  if (!data || data.length === 0) {
    return <p className="text-center text-gray-500 py-4">No data available.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <div className="align-middle inline-block min-w-full">
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((col) => (
                  <SortableTableHeader
                    key={String(col.accessor)}
                    columnKey={col.accessor}
                    label={col.header}
                    sortConfig={sortConfig}
                    onSort={requestSort}
                  />
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  {columns.map((col) => (
                    <td key={String(col.accessor)} className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {col.render ? col.render(item) : String(item[col.accessor] ?? '')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
