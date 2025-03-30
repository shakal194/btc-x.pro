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
      <div className='rounded-lg bg-gray-800 p-4'>
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
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant='shadow'
                color='secondary'
                className='flex items-center gap-2'
              >
                <ListBulletIcon className='h-4 w-4' />
                {rowsPerPageOptions.find(
                  (option) => option.key === rowsPerPage.toString(),
                )?.label || '20 строк'}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label='Количество строк на странице'
              onAction={(key) => setRowsPerPage(Number(key))}
              selectedKeys={new Set([rowsPerPage.toString()])}
              selectionMode='single'
            >
              {rowsPerPageOptions.map((option) => (
                <DropdownItem key={option.key}>{option.label}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          <Dropdown>
            <DropdownTrigger>
              <Button
                variant='shadow'
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
            maxTableHeight={400}
            color='success'
            sortDescriptor={sortDescriptor}
            onSortChange={setSortDescriptor}
            classNames={{
              base: 'bg-gray-700 border-0',
              table: 'min-w-full',
              thead: 'bg-gray-800',
              tbody: 'bg-gray-800',
              tr: 'border-0 transition-colors hover:bg-gray-700',
              th: 'bg-gray-800 text-gray-400 font-medium py-3',
              td: 'group-data-[selected=true]:bg-gray-700',
              sortIcon: 'text-gray-400',
              emptyWrapper: 'bg-gray-800 text-white',
              wrapper: 'bg-gray-800 rounded-lg border border-gray-800',
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
              item: 'bg-gray-700 text-white border-0 hover:bg-gray-600',
              cursor: 'bg-secondary text-white',
              next: 'bg-gray-700 text-white hover:bg-gray-600',
              prev: 'bg-gray-700 text-white hover:bg-gray-600',
            }}
          />
        </div>
      </div>
    </div>
  );
}
