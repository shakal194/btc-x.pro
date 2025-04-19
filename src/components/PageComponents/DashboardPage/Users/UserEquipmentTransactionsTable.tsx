'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Pagination,
  Breadcrumbs,
  BreadcrumbItem,
  Chip,
  SortDescriptor,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from '@heroui/react';
import { fetchUserEquipmentTransactions } from '@/lib/data';
import { useRouter } from 'next/navigation';
import { FunnelIcon, ListBulletIcon } from '@heroicons/react/24/outline';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

interface EquipmentTransaction {
  id: number;
  transactionDate: Date;
  uuid: string | null;
  shareCount: number;
  balanceShareCount: number;
  pricePerShare: string;
  isPurchase: boolean;
  equipmentName: string;
  equipmentHashrate: number;
  equipmentHashrateUnit: string;
}

type TransactionType = 'all' | 'purchase' | 'sale';

const rowsPerPageOptions = [
  { key: '20', label: '20 строк' },
  { key: '50', label: '50 строк' },
  { key: '100', label: '100 строк' },
  { key: '200', label: '200 строк' },
];

export default function UserEquipmentTransactionsTable({
  userId,
  userEmail,
}: {
  userId: number;
  userEmail: string;
}) {
  const [transactions, setTransactions] = useState<EquipmentTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [transactionType, setTransactionType] =
    useState<TransactionType>('all');
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'transactionDate',
    direction: 'descending',
  });
  const [isRowsOpen, setIsRowsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const data = await fetchUserEquipmentTransactions(userId);
        setTransactions(data);
      } catch (error) {
        console.error('Error fetching equipment transactions:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [userId]);

  // Reset to first page when changing rows per page
  useEffect(() => {
    setPage(1);
  }, [rowsPerPage]);

  const filteredTransactions = transactions.filter((transaction) => {
    if (transactionType === 'all') return true;
    return transactionType === 'purchase'
      ? transaction.isPurchase
      : !transaction.isPurchase;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    const { column, direction } = sortDescriptor;
    const multiplier = direction === 'ascending' ? 1 : -1;

    switch (column) {
      case 'id':
        return (a.id - b.id) * multiplier;
      case 'transactionDate':
        return (
          (new Date(a.transactionDate).getTime() -
            new Date(b.transactionDate).getTime()) *
          multiplier
        );
      case 'shareCount':
        return (a.shareCount - b.shareCount) * multiplier;
      case 'balanceShareCount':
        return (a.balanceShareCount - b.balanceShareCount) * multiplier;
      case 'pricePerShare':
        return (Number(a.pricePerShare) - Number(b.pricePerShare)) * multiplier;
      case 'equipmentName':
        return a.equipmentName.localeCompare(b.equipmentName) * multiplier;
      case 'isPurchase':
        return (Number(a.isPurchase) - Number(b.isPurchase)) * multiplier;
      case 'total':
        return (
          (Number(a.shareCount) * Number(a.pricePerShare) -
            Number(b.shareCount) * Number(b.pricePerShare)) *
          multiplier
        );
      default:
        return 0;
    }
  });

  const pages = Math.max(1, Math.ceil(sortedTransactions.length / rowsPerPage));
  const paginatedTransactions = sortedTransactions.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  return (
    <div className='min-h-screen w-full space-y-4 bg-black/90 p-4'>
      <div className='space-y-4 rounded-lg p-4'>
        <Breadcrumbs>
          <BreadcrumbItem href='/dashboard/users' className='text-gray-300'>
            Пользователи
          </BreadcrumbItem>
          <BreadcrumbItem
            onClick={() => router.back()}
            className='cursor-pointer text-gray-300'
          >
            {userEmail}
          </BreadcrumbItem>
          <BreadcrumbItem isCurrent className='text-gray-200'>
            История покупок и продаж оборудования
          </BreadcrumbItem>
        </Breadcrumbs>

        <div className='mt-4 flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-white'>
              История покупок и продаж оборудования
            </h1>
          </div>
          <div className='flex gap-4'>
            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant='ghost'
                  color='secondary'
                  className='flex items-center gap-2'
                >
                  <FunnelIcon className='h-4 w-4' />
                  {transactionType === 'all'
                    ? 'Все транзакции'
                    : transactionType === 'purchase'
                      ? 'Только покупки'
                      : 'Только продажи'}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label='Фильтр транзакций'
                onAction={(key) => setTransactionType(key as TransactionType)}
                selectedKeys={new Set([transactionType])}
                selectionMode='single'
              >
                <DropdownItem key='all'>Все транзакции</DropdownItem>
                <DropdownItem key='purchase'>Только покупки</DropdownItem>
                <DropdownItem key='sale'>Только продажи</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>

        <div className='relative mt-4 overflow-x-auto rounded-lg bg-gray-900'>
          {isLoading && (
            <div className='absolute inset-0 z-50 flex items-center justify-center bg-gray-900/50'>
              <Spinner size='lg' color='secondary' />
            </div>
          )}

          <Table
            aria-label='Equipment transactions table'
            isHeaderSticky
            isVirtualized={true}
            maxTableHeight={600}
            color='success'
            sortDescriptor={sortDescriptor}
            onSortChange={setSortDescriptor}
            classNames={{
              wrapper: 'max-h-[600px]',
              td: 'text-default-600',
              tr: 'border-0 transition-colors hover:bg-gray-700',
            }}
          >
            <TableHeader>
              <TableColumn
                key='id'
                allowsSorting
                className='whitespace-nowrap bg-gray-800 px-4 py-2 text-sm text-white'
              >
                ID
              </TableColumn>
              <TableColumn
                key='transactionDate'
                allowsSorting
                className='whitespace-nowrap bg-gray-800 px-4 py-2 text-sm text-white'
              >
                Дата
              </TableColumn>
              <TableColumn
                key='isPurchase'
                allowsSorting
                className='whitespace-nowrap bg-gray-800 px-4 py-2 text-sm text-white'
              >
                Тип
              </TableColumn>
              <TableColumn
                key='equipmentName'
                allowsSorting
                className='whitespace-nowrap bg-gray-800 px-4 py-2 text-sm text-white'
              >
                Оборудование
              </TableColumn>
              <TableColumn
                key='shareCount'
                allowsSorting
                className='whitespace-nowrap bg-gray-800 px-4 py-2 text-sm text-white'
              >
                Кол-во долей
              </TableColumn>
              <TableColumn
                key='balanceShareCount'
                allowsSorting
                className='whitespace-nowrap bg-gray-800 px-4 py-2 text-sm text-white'
              >
                Баланс долей
              </TableColumn>
              <TableColumn
                key='pricePerShare'
                allowsSorting
                className='whitespace-nowrap bg-gray-800 px-4 py-2 text-sm text-white'
              >
                Цена за долю
              </TableColumn>
              <TableColumn
                key='total'
                allowsSorting
                className='whitespace-nowrap bg-gray-800 px-4 py-2 text-sm text-white'
              >
                Сумма
              </TableColumn>
            </TableHeader>
            <TableBody
              items={paginatedTransactions}
              emptyContent={isLoading ? ' ' : 'Нет данных'}
              className='text-white'
            >
              {(transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className='whitespace-pre-wrap px-4 py-2 text-sm text-white'>
                    {transaction.id}
                  </TableCell>
                  <TableCell className='whitespace-pre-wrap px-4 py-2 text-sm text-white'>
                    {new Date(transaction.transactionDate).toLocaleString()}
                  </TableCell>
                  <TableCell className='whitespace-pre-wrap px-4 py-2 text-sm text-white'>
                    <Chip
                      color={transaction.isPurchase ? 'success' : 'danger'}
                      variant='solid'
                      size='sm'
                    >
                      {transaction.isPurchase ? 'Покупка' : 'Продажа'}
                    </Chip>
                  </TableCell>
                  <TableCell className='whitespace-pre-wrap px-4 py-2 text-sm text-white'>
                    {transaction.equipmentName} ({transaction.equipmentHashrate}{' '}
                    {transaction.equipmentHashrateUnit})
                  </TableCell>
                  <TableCell className='whitespace-pre-wrap px-4 py-2 text-sm text-white'>
                    {transaction.shareCount}
                  </TableCell>
                  <TableCell className='whitespace-pre-wrap px-4 py-2 text-sm text-white'>
                    {transaction.balanceShareCount}
                  </TableCell>
                  <TableCell className='whitespace-pre-wrap px-4 py-2 text-sm text-white'>
                    ${transaction.pricePerShare}
                  </TableCell>
                  <TableCell className='whitespace-pre-wrap px-4 py-2 text-sm text-white'>
                    $
                    {(
                      Number(transaction.shareCount) *
                      Number(transaction.pricePerShare)
                    ).toFixed(2)}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className='flex w-full justify-center'>
          <Pagination
            total={pages}
            page={page}
            onChange={setPage}
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
              Всего операций: {transactions.length}
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
                  {rowsPerPageOptions.map((count) => (
                    <DropdownItem key={count.key} textValue={count.key}>
                      {count.label}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
