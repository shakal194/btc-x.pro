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
  Chip,
  ChipProps,
  SortDescriptor,
  Pagination,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@heroui/react';
import {
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/solid';
import FullScreenSpinner from '@/components/ui/Spinner';
import { ConfirmWithdrawalModal } from './ConfirmWithdrawalModal';
import { CancelWithdrawalModal } from './CancelWithdrawalModal';
import { getWalletId, getCurrencyId } from '@/lib/constants';
import { getAccessToken, createPayout } from '@/lib/coinsbuy';
import { COIN_CONFIG } from '@/lib/constants';

interface WithdrawalData {
  id: number;
  user_id: number;
  uuid: string | null;
  userEmail: string;
  coinTicker: string;
  network: string;
  address: string;
  amount: string;
  feeInUSDT: string;
  feeInCoin: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

interface WithdrawalsTableProps {
  withdrawals: WithdrawalData[];
  onConfirmWithdrawal?: (id: number) => Promise<void>;
  onCancelWithdrawal?: (id: number) => Promise<void>;
  onRefresh: () => void;
}

const statusColorMap: Record<string, ChipProps['color']> = {
  created: 'default',
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
  'feeInUSDT',
  'feeInCoin',
  'status',
  'created_at',
  'updated_at',
  'actions',
];

const ROWS_PER_PAGE_OPTIONS = [20, 50, 100, 200];

export default function WithdrawalsTable({
  withdrawals,
  onConfirmWithdrawal,
  onCancelWithdrawal,
  onRefresh,
}: WithdrawalsTableProps) {
  const [filterValue, setFilterValue] = useState('');
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'id',
    direction: 'descending',
  });
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [isRowsOpen, setIsRowsOpen] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] =
    useState<WithdrawalData | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const hasSearchFilter = Boolean(filterValue);

  const handleConfirm = useCallback(
    async (id: number) => {
      const withdrawal = withdrawals.find((w) => w.id === id);
      if (withdrawal) {
        setSelectedWithdrawal(withdrawal);
        setIsConfirmModalOpen(true);
      }
    },
    [withdrawals],
  );

  const handleConfirmWithdrawal = async () => {
    if (!selectedWithdrawal || !selectedWithdrawal.uuid) return;

    setIsLoading(selectedWithdrawal.id.toString());
    try {
      const token = await getAccessToken();
      const walletId = getWalletId(selectedWithdrawal.coinTicker);
      const currencyId = getCurrencyId(selectedWithdrawal.coinTicker);

      console.log('Payout params:', {
        amount: selectedWithdrawal.amount,
        address: selectedWithdrawal.address,
        coinTicker: selectedWithdrawal.coinTicker,
        walletId,
        currencyId,
        userId: selectedWithdrawal.user_id,
        uuid: selectedWithdrawal.uuid,
      });

      await createPayout(token, {
        amount: selectedWithdrawal.amount,
        feeInUSDT: selectedWithdrawal.feeInUSDT,
        feeInCoin: selectedWithdrawal.feeInCoin,
        address: selectedWithdrawal.address,
        coinTicker: selectedWithdrawal.coinTicker,
        walletId,
        currencyId,
        userId: selectedWithdrawal.user_id,
        uuid: selectedWithdrawal.uuid,
      });

      await onConfirmWithdrawal?.(selectedWithdrawal.id);
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error confirming withdrawal:', error);
    } finally {
      setIsLoading(null);
      setIsConfirmModalOpen(false);
      setSelectedWithdrawal(null);
    }
  };

  const handleCancel = useCallback(
    async (id: number) => {
      const withdrawal = withdrawals.find((w) => w.id === id);
      if (withdrawal) {
        setSelectedWithdrawal(withdrawal);
        setIsCancelModalOpen(true);
      }
    },
    [withdrawals],
  );

  const handleCancelWithdrawal = async () => {
    if (!selectedWithdrawal) return;

    setIsLoading(selectedWithdrawal.id.toString());
    try {
      await onCancelWithdrawal?.(selectedWithdrawal.id);
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error canceling withdrawal:', error);
    } finally {
      setIsLoading(null);
      setIsCancelModalOpen(false);
      setSelectedWithdrawal(null);
    }
  };

  const headerColumns = useMemo(() => {
    return [
      { name: 'ID', uid: 'id', sortable: true },
      { name: 'Email', uid: 'userEmail', sortable: true },
      { name: 'Coin', uid: 'coinTicker', sortable: true },
      { name: 'Network', uid: 'network', sortable: true },
      { name: 'Address', uid: 'address', sortable: true },
      { name: 'Amount', uid: 'amount', sortable: true },
      { name: 'Fee in USDT', uid: 'feeInUSDT', sortable: true },
      { name: 'Fee in Coin', uid: 'feeInCoin', sortable: true },
      { name: 'Status', uid: 'status', sortable: true },
      { name: 'Created', uid: 'created_at', sortable: true },
      { name: 'Updated', uid: 'updated_at', sortable: true },
      { name: 'Действия', uid: 'actions', sortable: false },
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
            .includes(filterValue.toLowerCase()) ||
          withdrawal.amount.toLowerCase().includes(filterValue.toLowerCase()) ||
          withdrawal.feeInUSDT
            .toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          withdrawal.feeInCoin
            .toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          withdrawal.created_at
            .toLocaleString()
            .toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          withdrawal.updated_at
            .toLocaleString()
            .toLowerCase()
            .includes(filterValue.toLowerCase())
        );
      });
    }

    filteredWithdrawals = filteredWithdrawals.filter(
      (withdrawal) => withdrawal.status === 'created',
    );

    return filteredWithdrawals;
  }, [withdrawals, filterValue, hasSearchFilter]);

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

  const renderCell = useCallback(
    (withdrawal: WithdrawalData, columnKey: string) => {
      const cellValue = withdrawal[columnKey as keyof WithdrawalData];

      switch (columnKey) {
        case 'actions':
          return (
            <div className='flex gap-2'>
              <Button
                size='sm'
                color='success'
                variant='flat'
                isLoading={isLoading === withdrawal.id.toString()}
                isDisabled={
                  withdrawal.status !== 'created' || isLoading !== null
                }
                onPress={() => handleConfirm(withdrawal.id)}
              >
                Выполнить
              </Button>
              <Button
                size='sm'
                color='danger'
                variant='flat'
                isLoading={isLoading === withdrawal.id.toString()}
                isDisabled={
                  withdrawal.status !== 'created' || isLoading !== null
                }
                onPress={() => handleCancel(withdrawal.id)}
              >
                Отменить
              </Button>
            </div>
          );
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
          return `${cellValue} ${withdrawal.coinTicker}`;
        case 'feeInUSDT':
          return `${cellValue} USDT`;
        case 'feeInCoin':
          const network = COIN_CONFIG[withdrawal.coinTicker]?.network;
          return `${cellValue} ${network}`;
        default:
          return String(cellValue);
      }
    },
    [isLoading, handleCancel, handleConfirm],
  );

  const { paginatedItems, pages } = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedItems = sortedItems.slice(start, end);

    return {
      paginatedItems,
      pages: Math.max(1, Math.ceil(sortedItems.length / rowsPerPage)),
    };
  }, [page, rowsPerPage, sortedItems]);

  return (
    <>
      {isLoading !== null && (
        <div className='fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900/50'>
          <FullScreenSpinner />
        </div>
      )}
      <div className='relative flex flex-col gap-4'>
        <div className='flex items-end justify-between gap-3'>
          <Input
            isClearable
            classNames={{
              base: 'w-full sm:max-w-[44%]',
              clearButton: 'text-default-700',
            }}
            placeholder='Поиск по email, адресу или монете...'
            startContent={
              <MagnifyingGlassIcon className='h-6 w-6 text-default-700' />
            }
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            onClear={() => setFilterValue('')}
          />
        </div>
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
            <TableHeader>
              {headerColumns.map((column) => (
                <TableColumn
                  key={column.uid}
                  align={column.uid === 'actions' ? 'center' : 'start'}
                  allowsSorting={column.sortable}
                  className='whitespace-nowrap bg-gray-800 px-4 py-2 text-sm text-white'
                >
                  {column.name}
                </TableColumn>
              ))}
            </TableHeader>
            <TableBody
              items={paginatedItems}
              emptyContent={isLoading ? ' ' : 'Нет данных'}
            >
              {(item) => (
                <TableRow key={item.id}>
                  {headerColumns.map((column) => (
                    <TableCell key={column.uid}>
                      {renderCell(item, column.uid)}
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
            <span className='text-sm'>
              Всего запросов на вывод: {sortedItems.length}
            </span>
            <div className='flex items-center gap-2'>
              <p className='text-sm text-white'>Строк на странице:</p>
              <Dropdown isOpen={isRowsOpen} onOpenChange={setIsRowsOpen}>
                <DropdownTrigger>
                  <Button
                    variant='ghost'
                    color='secondary'
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
                >
                  {ROWS_PER_PAGE_OPTIONS.map((count) => (
                    <DropdownItem key={count} textValue={count.toString()}>
                      {count}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>

      {selectedWithdrawal && (
        <>
          <ConfirmWithdrawalModal
            isOpen={isConfirmModalOpen}
            onClose={() => {
              setIsConfirmModalOpen(false);
              setSelectedWithdrawal(null);
            }}
            onConfirm={handleConfirmWithdrawal}
            withdrawal={{
              id: selectedWithdrawal.id,
              coinTicker: selectedWithdrawal.coinTicker,
              amount: selectedWithdrawal.amount,
            }}
          />
          <CancelWithdrawalModal
            isOpen={isCancelModalOpen}
            onClose={() => {
              setIsCancelModalOpen(false);
              setSelectedWithdrawal(null);
            }}
            onConfirm={handleCancelWithdrawal}
            withdrawal={{
              id: selectedWithdrawal.id,
              coinTicker: selectedWithdrawal.coinTicker,
              amount: selectedWithdrawal.amount,
            }}
          />
        </>
      )}
    </>
  );
}
