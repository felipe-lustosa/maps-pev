import React from 'react'
import {
  Column,
  Table,
  useReactTable,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table'
import { AiOutlineDoubleLeft, AiOutlineDoubleRight, AiOutlineLeft, AiOutlineRight } from 'react-icons/ai'
import { RiArrowDownSFill, RiArrowUpSFill } from 'react-icons/ri'


const GeneralTableNew = ({ tableData, columns, additionalTable, isViewOnly }) => {

  const [data, setData] = React.useState(() => [...tableData])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  })

  return (
    <div className='w-full shadow rounded overflow-hidden'>
      <div className='flex justify-between py-4 px-2'>
        {/* <div className='flex gap-4 items-center'>
          {!isViewOnly && <button onClick={() => {}} className='pl-2 pr-3 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded flex items-center gap-1' ><BsPlus color='white' size={24} />Cadastrar</button>}
          {Object.keys(rowSelection).length == 1 && <button className='pl-2 pr-3 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded flex items-center gap-1' onClick={() => {
            if (additionalTable) {
              setPageNavigation('edit')
              setSelectedAdditionalData(data[parseInt(Object.keys(rowSelection)[0])])
            } else {
              setEditForm(true)
              setSelectedData(data[parseInt(Object.keys(rowSelection)[0])])
            }
          }}><MdEdit color='white' size={24} />Editar</button>}
        </div> */}
      </div>
      {Object.keys(rowSelection).length > 0
        ? <div className='w-full bg-primary-100 px-4 py-1 flex items-center gap-4'>
          <p className='text-gray-700 text-sm'>
            {Object.keys(rowSelection).length + ' registros selecionados.'}
            <span className='text-primary-600 font-medium cursor-pointer' onClick={() => setRowSelection({})}> Desmarcar todos</span>
          </p>
          {/* <BsThreeDotsVertical size={20} /> */}
        </div> : null}
      <div className='overflow-auto'>
        <table className='border-y w-full overflow-auto'>
          <thead className='bg-gray-50'>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <th className='border-b px-4 py-4  text-start text-gray-500 font-medium' key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <>
                          <div
                            {...{
                              className: header.column.getCanSort()
                                ? 'cursor-pointer select-none flex items-center gap-1'
                                : '',
                              onClick: header.column.getToggleSortingHandler(),
                            }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {{
                              asc: <RiArrowUpSFill size={20} />,
                              desc: <RiArrowDownSFill size={20} />,
                              // desc: ' 🔽',
                            }[header.column.getIsSorted()] ?? null}
                          </div>
                          {/* {header.column.getCanFilter() ? (
                            <div>
                              <Filter column={header.column} table={table} />
                            </div>
                          ) : null} */}
                        </>
                      )}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody className='border-b'>
            {table.getRowModel().rows.map(row => {
              return (
                <tr className='hover:bg-gray-50 cursor-pointer' key={row.id}>
                  {row.getVisibleCells().map(cell => {
                    return (
                      <td className='px-4 py-4 border-y' key={cell.id} onClick={() => handleRowTableClick(cell.column.id, data[row.index])}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="grid grid-cols-12 gap-2 py-2 px-4 overflow-x-auto">
        <div className="flex items-center gap-1 col-span-4">
          <span>Página</span>
          <strong>
            {table.getState().pagination.pageIndex + 1} de{' '}
            {table.getPageCount()}
          </strong>
          <div className='hidden lg:flex items-center gap-1'>
            <span>| Ir para página:</span>
            <input
              max={table.getPageCount()}
              min={1}
              type="number"
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={e => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0
                if (page < table.getPageCount() && page >= 0) {
                  table.setPageIndex(page)
                }
              }}
              className="border p-1 rounded w-16"
            />
          </div>
        </div>
        <div className='col-span-4 justify-self-center self-center'>
          <button className="border rounded p-1" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()} >
            <AiOutlineDoubleLeft size={18} />
          </button>
          <button className="border rounded p-1" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}
          >
            <AiOutlineLeft size={18} />
          </button>
          <button className="border rounded p-1" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} >
            <AiOutlineRight size={18} />
          </button>
          <button className="border rounded p-1" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()} >
            <AiOutlineDoubleRight size={18} />
          </button>
        </div>
        <div className='col-span-4 justify-self-end flex items-center'>
          <select
            value={table.getState().pagination.pageSize}
            onChange={e => {
              table.setPageSize(Number(e.target.value))
            }}
          >
            {[10, 20, 30, 40, 50].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                Mostrar {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export default GeneralTableNew