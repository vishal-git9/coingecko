// src/components/Portfolio/WatchlistDataTable.tsx
"use client"

import React, { useMemo, useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  type SortingState,
  type ColumnFiltersState,
  type ColumnDef,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { Skeleton } from '../ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import {
  ArrowUpDown,
  MoreHorizontal,
  Edit3,
  Trash2,
  RefreshCw,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'

import { 
  updateHoldings, 
  removeCoinFromWatchlist, 
  setLastUpdated 
} from '../../store/slices/portfolioSlice'
import { useGetCoinsMarketDataQuery } from '../../store/slices/apiSlice'
import { AddTokenModal } from '../AddTokenModal/AddTokenModal'
import { SparklineChart } from './SparklineChart'
import { formatCurrency, formatPercentage } from '../../utils/formatters'
import type { AppDispatch, RootState } from '../../store'
import { useMobile } from '../../hooks/usemobile'
interface TokenData {
  id: string
  name: string
  symbol: string
  image: string
  price: number
  change24h: number
  holdings: number
  value: number
}

// Skeleton Loading Component
const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <TableBody>
      {[...Array(rows)].map((_, i) => (
        <TableRow key={i} className="border-gray-800">
          <TableCell className="px-6 py-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full bg-gray-700" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32 bg-gray-700" />
                <Skeleton className="h-3 w-16 bg-gray-700" />
              </div>
            </div>
          </TableCell>
          <TableCell className="px-6 py-4">
            <Skeleton className="h-4 w-20 bg-gray-700" />
          </TableCell>
          <TableCell className="px-6 py-4">
            <Skeleton className="h-6 w-16 rounded-full bg-gray-700" />
          </TableCell>
          <TableCell className="px-6 py-4">
            <Skeleton className="h-12 w-24 bg-gray-700" />
          </TableCell>
          <TableCell className="px-6 py-4">
            <Skeleton className="h-4 w-16 bg-gray-700" />
          </TableCell>
          <TableCell className="px-6 py-4">
            <Skeleton className="h-4 w-20 bg-gray-700" />
          </TableCell>
          <TableCell className="px-6 py-4">
            <Skeleton className="h-8 w-8 bg-gray-700" />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  )
}

// Pagination Component
interface DataTablePaginationProps<TData> {
  table: any
}

function DataTablePagination<TData>({ table }: DataTablePaginationProps<TData>) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
    <div className="text-sm text-gray-400 order-2 sm:order-1">
      {table.getFilteredRowModel().rows.length} row(s) total.
    </div>
    
    <div className="flex items-center space-x-2 lg:space-x-6 order-1 sm:order-2">
      {/* Rows per page - Hide on mobile */}
      <div className="hidden lg:flex items-center space-x-2">
        <p className="text-sm font-medium text-gray-300">Rows per page</p>
        <Select
          value={`${table.getState().pagination.pageSize}`}
          onValueChange={(value) => {
            table.setPageSize(Number(value))
          }}
        >
          <SelectTrigger className="h-8 w-[70px] bg-gray-800 border-gray-700 text-white">
            <SelectValue placeholder={table.getState().pagination.pageSize} />
          </SelectTrigger>
          <SelectContent side="top" className="bg-gray-800 border-gray-700">
            {[5, 10, 20, 30, 40, 50].map((pageSize) => (
              <SelectItem 
                key={pageSize} 
                value={`${pageSize}`}
                className="text-white hover:bg-gray-700"
              >
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center justify-center text-sm font-medium text-gray-300">
        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
      </div>
      
      <div className="flex items-center space-x-1 lg:space-x-2">
        <Button
          variant="outline"
          className="hidden lg:flex h-8 w-8 p-0 bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0 bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0 bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="hidden lg:flex h-8 w-8 p-0 bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>
  )
}

export const WatchlistTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { watchlist, holdings } = useSelector((state: RootState) => state.portfolio)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [tempHolding, setTempHolding] = React.useState<string>('')
  const [isAddTokenModalOpen, setIsAddTokenModalOpen] = useState<boolean>(false)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const isMobile = useMobile()

  const { data: coinsData, isLoading, refetch } = useGetCoinsMarketDataQuery(watchlist, {
    skip: watchlist.length === 0,
  })

  const data: TokenData[] = useMemo(() => {
    if (!coinsData) return []
    
    return coinsData.map(coin => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      image: coin.image,
      price: coin.current_price,
      change24h: coin.price_change_percentage_24h,
      holdings: holdings[coin.id] || 0,
      value: coin.current_price * (holdings[coin.id] || 0),
    }))
  }, [coinsData, holdings])

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleEditHolding = (tokenId: string, currentHolding: number): void => {
    setEditingId(tokenId)
    setTempHolding(currentHolding.toString())
    setOpenMenuId(null)
  }

  const handleSaveHolding = (tokenId: string): void => {
    const numericValue = parseFloat(tempHolding)
    if (!isNaN(numericValue) && numericValue >= 0) {
      dispatch(updateHoldings({ coinId: tokenId, amount: numericValue }))
    }
    setEditingId(null)
    setTempHolding('')
  }

  const handleCancelEdit = (): void => {
    setEditingId(null)
    setTempHolding('')
  }

  const handleKeyPress = (e: React.KeyboardEvent, tokenId: string): void => {
    if (e.key === 'Enter') {
      handleSaveHolding(tokenId)
    } else if (e.key === 'Escape') {
      handleCancelEdit()
    }
  }

  const handleRefresh = async (): Promise<void> => {
    try {
      // Update timestamp immediately when refresh is triggered
      dispatch(setLastUpdated(Date.now()))
      
      // Trigger the API refetch
      await refetch()
    } catch (error) {
      console.error('Failed to refresh prices:', error)
    }
  }

  const handleRemoveCoin = (coinId: string): void => {
    dispatch(removeCoinFromWatchlist(coinId))
    setOpenMenuId(null)
  }

  const toggleMenu = (coinId: string): void => {
    setOpenMenuId(openMenuId === coinId ? null : coinId)
  }

  const columns: ColumnDef<TokenData>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-8 px-2 text-left hover:bg-gray-800 text-gray-400"
          >
            Token
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const token = row.original
        return (
          <div className="flex items-center gap-3 px-2">
            <img 
              src={token.image} 
              alt={token.name}
              className="w-10 h-10 rounded-full"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = '/placeholder-token.png'
              }}
            />
            <div>
              <p className="font-medium text-white">{token.name}</p>
              <p className="text-sm text-gray-400">({token.symbol.toUpperCase()})</p>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'price',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-8 px-2 hover:bg-gray-800 text-gray-400"
          >
            Price
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        return (
          <div className="px-2 font-medium text-white">
            {formatCurrency(row.original.price)}
          </div>
        )
      },
    },
    {
      accessorKey: 'change24h',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-8 px-2 hover:bg-gray-800 text-gray-400"
          >
            24h %
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const change = row.original.change24h
        return (
          <Badge 
            variant={change >= 0 ? 'default' : 'destructive'}
            className={`px-2 ${
              change >= 0 
                ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
                : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
            }`}
          >
            {formatPercentage(change)}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'sparkline',
      header: 'Sparkline (7d)',
      cell: ({ row }) => {
        const isPositive = row.original.change24h >= 0
        return (
          <div className="w-24 h-12 px-2">
            <SparklineChart 
              data={[]} 
              isPositive={isPositive}
              color={isPositive ? '#10B981' : '#EF4444'}
            />
          </div>
        )
      },
    },
    {
      accessorKey: 'holdings',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-8 px-2 hover:bg-gray-800 text-gray-400"
          >
            Holdings
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const token = row.original
        const holding = token.holdings

        if (editingId === token.id) {
          return (
            <div className="flex items-center gap-2 px-2">
              <Input
                type="number"
                value={tempHolding}
                onChange={(e) => setTempHolding(e.target.value)}
                onKeyDown={(e) => handleKeyPress(e, token.id)}
                className="w-24 h-8 bg-gray-800 border-gray-700 text-white"
                step="any"
                min="0"
                placeholder="0.0000"
                autoFocus
              />
              <Button
                onClick={() => handleSaveHolding(token.id)}
                size="sm"
                className="h-8 bg-green-500 hover:bg-green-600"
              >
                Save
              </Button>
            </div>
          )
        }

        return (
          <Button
            variant="ghost"
            onClick={() => handleEditHolding(token.id, holding)}
            className="h-8 px-2 text-white hover:text-green-400 hover:bg-gray-800"
          >
            {holding.toFixed(4)}
          </Button>
        )
      },
    },
    {
      accessorKey: 'value',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-8 px-2 hover:bg-gray-800 text-gray-400"
          >
            Value
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        return (
          <div className="px-2 font-medium text-white">
            {formatCurrency(row.original.value)}
          </div>
        )
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const token = row.original

        return (
          <div className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-800">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                <DropdownMenuItem
                  onClick={() => handleEditHolding(token.id, token.holdings)}
                  className="text-gray-300 hover:text-white hover:bg-gray-700 cursor-pointer"
                >
                  <Edit3 className="mr-2 h-4 w-4" />
                  Edit Holdings
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleRemoveCoin(token.id)}
                  className="text-red-400 hover:text-red-300 hover:bg-gray-700 cursor-pointer"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
  })

  if (watchlist.length === 0) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <span className="text-green-400">
            <img src={"/star.svg"} alt="Start" />
            </span> Watchlist
          </h2>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleRefresh}
              disabled={true}
              variant="outline"
              size="sm"
              className="bg-gray-800 border-gray-700 text-gray-400 hover:text-white hover:bg-gray-700"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              {isMobile ? '' : 'Refresh Prices'}
              
            </Button>
            <Button
              onClick={() => setIsAddTokenModalOpen(true)}
              className="bg-[#A9E851] hover:bg-green-600 text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Token
            </Button>
          </div>
        </div>

        {/* Empty State */}
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-300 mb-2">No tokens in watchlist</h3>
            <p className="text-gray-500">Add some tokens to get started with tracking your portfolio.</p>
          </div>
        </div>

        {/* Modal */}
        <AddTokenModal
          isOpen={isAddTokenModalOpen}
          onClose={() => setIsAddTokenModalOpen(false)}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <span className="text-green-400">
          <img src={"/star.svg"} alt="Start" />
            </span> Watchlist
        </h2>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleRefresh}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="bg-gray-800 border-gray-700 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            { isMobile ? '' : isLoading ? 'Refreshing...' : 'Refresh Prices'}
          </Button>
          <Button
            onClick={() => setIsAddTokenModalOpen(true)}
            className="bg-[#A9E851] hover:bg-green-600 text-black transition-colors"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Token
          </Button>
        </div>
      </div>

      {/* Table Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Filter tokens..."
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('name')?.setFilterValue(event.target.value)
            }
            className="max-w-sm bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-gray-800 bg-gray-900 overflow-hidden">
        <div className="max-h-[600px] overflow-auto scrollbar-primary">
          <Table>
            <TableHeader className="sticky top-0 bg-gray-900 z-10 border-b border-gray-800">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-gray-800 hover:bg-gray-800/50">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="text-gray-400 bg-gray-900">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            
            {/* Table Body */}
            {isLoading ? (
              <TableSkeleton rows={5} />
            ) : (
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      className="border-gray-800 hover:bg-gray-800/30 transition-colors"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center text-gray-400">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            )}
          </Table>
        </div>
      </div>

      <DataTablePagination table={table} />

      <AddTokenModal
        isOpen={isAddTokenModalOpen}
        onClose={() => setIsAddTokenModalOpen(false)}
      />
    </div>
  )
}
