'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Chip,
  Selection,
  ChipProps,
  SortDescriptor,
  Pagination,
  Spinner,
} from '@heroui/react';
import { MagnifyingGlassIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';

interface WithdrawalData {
  id: number;
  userEmail: string;
  coinTicker: string;
  network: string;
  address: string;
  amount: string;
  fee: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

const statusColorMap: Record<string, ChipProps['color']> = {
  pending: 'warning',
  confirmed: 'success',
  canceled: 'danger',
};

const INITIAL_VISIBLE_COLUMNS = [
  'id',
  'userEmail',
  'coinTicker',
  'network',
  'address',
  'amount',
  'fee',
  'status',
  'created_at',
  'updated_at',
];

const ROWS_PER_PAGE_OPTIONS = [20, 50, 100, 200];

export default function WithdrawalsTable({
  withdrawals,
}: {
  withdrawals: WithdrawalData[];
}) {
  const [filterValue, setFilterValue] = useState('');
  const [statusFilter, setStatusFilter] = useState<Selection>(
    new Set(['created', 'pending', 'confirmed', 'canceled']),
  );
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'id',
    direction: 'descending',
  });
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [isColumnsOpen, setIsColumnsOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isRowsOpen, setIsRowsOpen] = useState(false);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    return [
      { name: 'ID', uid: 'id', sortable: true },
      { name: 'Email', uid: 'userEmail', sortable: true },
      { name: 'Coin', uid: 'coinTicker', sortable: true },
      { name: 'Network', uid: 'network', sortable: true },
      { name: 'Address', uid: 'address', sortable: true },
      { name: 'Amount', uid: 'amount', sortable: true },
      { name: 'Fee', uid: 'fee', sortable: true },
      { name: 'Status', uid: 'status', sortable: true },
      { name: 'Created', uid: 'created_at', sortable: true },
      { name: 'Updated', uid: 'updated_at', sortable: true },
    ];
  }, []);

  const filteredItems = useMemo(() => {
    let filteredWithdrawals = [...withdrawals];

    if (hasSearchFilter) {
      filteredWithdrawals = filteredWithdrawals.filter((withdrawal) => {
        return (
          withdrawal.userEmail
            .toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          withdrawal.address
            .toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          withdrawal.coinTicker
            .toLowerCase()
            .includes(filterValue.toLowerCase())
        );
      });
    }

    const selectedStatuses = Array.from(statusFilter);
    filteredWithdrawals = filteredWithdrawals.filter((withdrawal) =>
      selectedStatuses.includes(withdrawal.status),
    );

    return filteredWithdrawals;
  }, [withdrawals, filterValue, statusFilter, hasSearchFilter]);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a: WithdrawalData, b: WithdrawalData) => {
      const first = a[sortDescriptor.column as keyof WithdrawalData];
      const second = b[sortDescriptor.column as keyof WithdrawalData];

      if (first === null || second === null) {
        return 0;
      }

      if (typeof first === 'string' && typeof second === 'string') {
        return sortDescriptor.direction === 'ascending'
          ? first.localeCompare(second)
          : second.localeCompare(first);
      }

      if (first instanceof Date && second instanceof Date) {
        return sortDescriptor.direction === 'ascending'
          ? first.getTime() - second.getTime()
          : second.getTime() - first.getTime();
      }

      return sortDescriptor.direction === 'ascending'
        ? Number(first) - Number(second)
        : Number(second) - Number(first);
    });
  }, [filteredItems, sortDescriptor]);

  // Pagination
  const { paginatedItems, pages } = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedItems = sortedItems.slice(start, end);

    return {
      paginatedItems,
      pages: Math.max(1, Math.ceil(filteredItems.length / rowsPerPage)),
    };
  }, [page, rowsPerPage, sortedItems, filteredItems]);

  const renderCell = useCallback(
    (withdrawal: WithdrawalData, columnKey: string) => {
      const cellValue = withdrawal[columnKey as keyof WithdrawalData];

      switch (columnKey) {
        case 'status':
          const statusText =
            {
              created: 'Создан',
              pending: 'В обработке',
              confirmed: 'Подтвержден',
              canceled: 'Отменен',
            }[withdrawal.status] || withdrawal.status;

          return (
            <Chip
              color={statusColorMap[withdrawal.status]}
              size='sm'
              variant='flat'
            >
              {statusText}
            </Chip>
          );
        case 'created_at':
        case 'updated_at':
          return cellValue instanceof Date
            ? cellValue.toLocaleString()
            : String(cellValue);
        case 'amount':
        case 'fee':
          return `${Number(cellValue).toFixed(4)} ${withdrawal.coinTicker}`;
        default:
          return String(cellValue);
      }
    },
    [],
  );

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
    } else {
      setFilterValue('');
    }
  }, []);

  const selectAllStatuses = useCallback(() => {
    setStatusFilter(new Set(['created', 'pending', 'confirmed', 'canceled']));
  }, []);

  const deselectAllStatuses = useCallback(() => {
    setStatusFilter(new Set());
  }, []);

  const handleStatusSelectionChange = useCallback(
    (keys: Selection) => {
      const selectedKeys = Array.from(keys);

      if (selectedKeys.includes('select-all')) {
        selectAllStatuses();
        return;
      }

      if (selectedKeys.includes('clear-all')) {
        deselectAllStatuses();
        return;
      }

      setStatusFilter(new Set(selectedKeys));
    },
    [selectAllStatuses, deselectAllStatuses],
  );

  const topContent = useMemo(() => {
    return (
      <div className='flex flex-col gap-4'>
        <div className='flex items-end justify-between gap-3'>
          <Input
            className='w-full sm:max-w-[44%]'
            placeholder='Поиск по email, адресу или монете...'
            startContent={
              <MagnifyingGlassIcon className='h-6 w-6 text-default-300' />
            }
            endContent={
              filterValue && (
                <div
                  className='cursor-pointer text-default-600 hover:text-default-700'
                  onClick={() => setFilterValue('')}
                >
                  <XCircleIcon className='h-5 w-5' />
                </div>
              )
            }
            value={filterValue}
            onValueChange={onSearchChange}
          />
          <div className='flex gap-3'>
            <Dropdown isOpen={isStatusOpen} onOpenChange={setIsStatusOpen}>
              <DropdownTrigger>
                <Button
                  variant='ghost'
                  color='secondary'
                  endContent={
                    isStatusOpen ? (
                      <ChevronUpIcon className='h-4 w-4' />
                    ) : (
                      <ChevronDownIcon className='h-4 w-4' />
                    )
                  }
                >
                  Статус
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label='Status filter'
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode='multiple'
                onSelectionChange={handleStatusSelectionChange}
              >
                <DropdownItem
                  key='select-all'
                  onPress={selectAllStatuses}
                  color='success'
                  className='text-success'
                >
                  Выбрать все
                </DropdownItem>
                <DropdownItem
                  key='clear-all'
                  onPress={deselectAllStatuses}
                  color='danger'
                  className='text-danger'
                >
                  Очистить все
                </DropdownItem>
                <DropdownItem key='created'>Создан</DropdownItem>
                <DropdownItem key='pending'>В обработке</DropdownItem>
                <DropdownItem key='confirmed'>Подтвержден</DropdownItem>
                <DropdownItem key='canceled'>Отменен</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Dropdown isOpen={isColumnsOpen} onOpenChange={setIsColumnsOpen}>
              <DropdownTrigger>
                <Button
                  variant='ghost'
                  color='secondary'
                  endContent={
                    isColumnsOpen ? (
                      <ChevronUpIcon className='h-4 w-4' />
                    ) : (
                      <ChevronDownIcon className='h-4 w-4' />
                    )
                  }
                >
                  Столбцы
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label='Column selection'
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode='multiple'
                onSelectionChange={setVisibleColumns}
              >
                {headerColumns.map((column) => (
                  <DropdownItem key={column.uid}>{column.name}</DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    headerColumns,
    onSearchChange,
    isColumnsOpen,
    isStatusOpen,
    handleStatusSelectionChange,
    deselectAllStatuses,
    selectAllStatuses,
  ]);

  return (
    <div className='relative flex flex-col gap-4'>
      {topContent}
      <div className='overflow-x-auto'>
        <Table
          aria-label='Withdrawals table'
          isHeaderSticky
          isVirtualized={true}
          maxTableHeight={600}
          classNames={{
            wrapper: 'max-h-[600px]',
            td: 'text-default-600',
            tr: 'border-0 transition-colors hover:bg-gray-700',
          }}
          sortDescriptor={sortDescriptor}
          onSortChange={setSortDescriptor}
        >
          <TableHeader
            columns={headerColumns.filter((column) =>
              Array.from(visibleColumns).includes(column.uid),
            )}
          >
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === 'actions' ? 'center' : 'start'}
                allowsSorting={column.sortable}
                className='whitespace-nowrap bg-gray-800 px-4 py-2 text-sm text-white'
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={paginatedItems} emptyContent='Нет данных'>
            {(item) => (
              <TableRow key={item.id}>
                {Array.from(visibleColumns).map((columnKey) => (
                  <TableCell key={columnKey}>
                    {renderCell(item, columnKey.toString())}
                  </TableCell>
                ))}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className='flex w-full justify-center'>
        <Pagination
          total={pages}
          page={page}
          onChange={(newPage) => setPage(newPage)}
          showControls={true}
          classNames={{
            wrapper: 'gap-2 text-white',
            item: 'dark:bg-gray-700 text-white border-0 hover:bg-gray-600',
            cursor: 'dark:bg-secondary text-white',
            next: 'bg-gray-700 text-white hover:bg-gray-600',
            prev: 'bg-gray-700 text-white hover:bg-gray-600',
          }}
        />
      </div>

      <div className='flex flex-col justify-between space-y-4 text-gray-400 md:items-center'>
        <div className='flex w-full items-center justify-between'>
          <span className='text-sm'>Всего выводов: {filteredItems.length}</span>
          <div className='flex items-center gap-2'>
            <p className='text-sm text-white'>Строк на странице:</p>
            <Dropdown
              isOpen={isRowsOpen}
              onOpenChange={setIsRowsOpen}
              className='bg-gray-700'
            >
              <DropdownTrigger>
                <Button
                  variant='flat'
                  className='min-w-[70px] border-0 bg-gray-700 text-white'
                  endContent={
                    isRowsOpen ? (
                      <ChevronUpIcon className='h-4 w-4 text-gray-400' />
                    ) : (
                      <ChevronDownIcon className='h-4 w-4 text-gray-400' />
                    )
                  }
                >
                  {rowsPerPage}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                selectedKeys={new Set([rowsPerPage.toString()])}
                selectionMode='single'
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0];
                  setRowsPerPage(Number(value));
                  setPage(1);
                }}
                className='max-h-[30vh] border-0 bg-gray-700 text-sm'
                classNames={{
                  base: 'bg-gray-700 border-0 focus:outline-none rounded-lg',
                  list: 'bg-gray-700 text-white',
                }}
              >
                {ROWS_PER_PAGE_OPTIONS.map((count) => (
                  <DropdownItem
                    key={count}
                    textValue={count.toString()}
                    className='text-sm text-white hover:bg-gray-700 data-[selected=true]:bg-gray-700'
                  >
                    {count}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>
    </div>
  );
}
