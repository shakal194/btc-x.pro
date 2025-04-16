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
import { fetchUserDeposits } from '@/lib/data';
import { useRouter } from 'next/navigation';
import { FunnelIcon, ListBulletIcon } from '@heroicons/react/24/outline';

type DepositStatus =
  | 'all'
  | 'confirmed'
  | 'unconfirmed'
  | 'created'
  | 'failed'
  | 'blocked'
  | 'canceled';

interface Deposit {
  id: number;
  depositId: number;
  coinTicker: string;
  amount: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

const rowsPerPageOptions = [
  { key: '20', label: '20 строк' },
  { key: '50', label: '50 строк' },
  { key: '100', label: '100 строк' },
  { key: '200', label: '200 строк' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'success';
    case 'unconfirmed':
      return 'warning';
    case 'failed':
    case 'blocked':
    case 'canceled':
      return 'danger';
    case 'created':
      return 'default';
    default:
      return 'default';
  }
};

const getStatusText = (status: string): string => {
  switch (status) {
    case 'confirmed':
      return 'Подтвержден';
    case 'unconfirmed':
      return 'Неподтвержден';
    case 'created':
      return 'Создан';
    case 'failed':
      return 'Ошибка';
    case 'blocked':
      return 'Заблокирован';
    case 'canceled':
      return 'Отменен';
    default:
      return 'Неизвестно';
  }
};

const getStatusFromNumber = (status: string): string => {
  console.log('Converting status:', status);
  switch (status.toLowerCase()) {
    case 'canceled':
      return 'canceled';
    case 'blocked':
      return 'blocked';
    case 'failed':
      return 'failed';
    case 'created':
      return 'created';
    case 'unconfirmed':
      return 'unconfirmed';
    case 'confirmed':
      return 'confirmed';
    default:
      console.log('Unknown status:', status);
      return 'unknown';
  }
};

export default function UserDepositsTable({
  userId,
  userEmail,
}: {
  userId: number;
  userEmail: string;
}) {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [depositStatus, setDepositStatus] = useState<DepositStatus>('all');
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'created_at',
    direction: 'descending',
  });
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const data = await fetchUserDeposits(userId);
        console.log('Raw data from server:', data);
        const transformedData = data.map((deposit) => {
          const status = getStatusFromNumber(deposit.status);
          console.log('Transforming status:', {
            original: deposit.status,
            transformed: status,
          });
          return {
            ...deposit,
            status: status,
          };
        });
        console.log('Transformed data:', transformedData);
        setDeposits(transformedData);
      } catch (error) {
        console.error('Error fetching deposits:', error);
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

  const filteredDeposits = deposits.filter((deposit) => {
    if (depositStatus === 'all') return true;
    return deposit.status === depositStatus;
  });

  const sortedDeposits = [...filteredDeposits].sort((a, b) => {
    const { column, direction } = sortDescriptor;
    const multiplier = direction === 'ascending' ? 1 : -1;

    switch (column) {
      case 'id':
        return (a.id - b.id) * multiplier;
      case 'depositId':
        return (a.depositId - b.depositId) * multiplier;
      case 'created_at':
        return (
          (new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime()) *
          multiplier
        );
      case 'updated_at':
        return (
          (new Date(a.updated_at).getTime() -
            new Date(b.updated_at).getTime()) *
          multiplier
        );
      case 'amount':
        return (Number(a.amount) - Number(b.amount)) * multiplier;
      case 'status':
        return a.status.localeCompare(b.status) * multiplier;
      case 'coinTicker':
        return a.coinTicker.localeCompare(b.coinTicker) * multiplier;
      default:
        return 0;
    }
  });

  const pages = Math.max(1, Math.ceil(sortedDeposits.length / rowsPerPage));
  const paginatedDeposits = sortedDeposits.slice(
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
            История депозитов
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
                {depositStatus === 'all'
                  ? 'Все статусы'
                  : depositStatus === 'confirmed'
                    ? 'Подтвержденные'
                    : depositStatus === 'unconfirmed'
                      ? 'Неподтвержденные'
                      : 'Ошибки'}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label='Фильтр статусов'
              onAction={(key) => setDepositStatus(key as DepositStatus)}
              selectedKeys={new Set([depositStatus])}
              selectionMode='single'
            >
              <DropdownItem key='all'>Все статусы</DropdownItem>
              <DropdownItem key='confirmed'>Подтвержден</DropdownItem>
              <DropdownItem key='unconfirmed'>Неподтвержден</DropdownItem>
              <DropdownItem key='created'>Создан</DropdownItem>
              <DropdownItem key='failed'>Ошибка</DropdownItem>
              <DropdownItem key='blocked'>Заблокирован</DropdownItem>
              <DropdownItem key='canceled'>Отменен</DropdownItem>
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
            aria-label='Deposits table'
            sortDescriptor={sortDescriptor}
            onSortChange={setSortDescriptor}
            isHeaderSticky
            isVirtualized={true}
            maxTableHeight={400}
            color='success'
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
                key='depositId'
                allowsSorting
                className='whitespace-nowrap bg-gray-800 px-4 py-2 text-sm text-white'
              >
                ID Депозита
              </TableColumn>
              <TableColumn
                key='coinTicker'
                allowsSorting
                className='whitespace-nowrap bg-gray-800 px-4 py-2 text-sm text-white'
              >
                Монета
              </TableColumn>
              <TableColumn
                key='amount'
                allowsSorting
                className='whitespace-nowrap bg-gray-800 px-4 py-2 text-sm text-white'
              >
                Сумма
              </TableColumn>
              <TableColumn
                key='status'
                allowsSorting
                className='whitespace-nowrap bg-gray-800 px-4 py-2 text-sm text-white'
              >
                Статус
              </TableColumn>
              <TableColumn
                key='created_at'
                allowsSorting
                className='whitespace-nowrap bg-gray-800 px-4 py-2 text-sm text-white'
              >
                Дата создания
              </TableColumn>
              <TableColumn
                key='updated_at'
                allowsSorting
                className='whitespace-nowrap bg-gray-800 px-4 py-2 text-sm text-white'
              >
                Дата обновления
              </TableColumn>
            </TableHeader>
            <TableBody
              items={paginatedDeposits}
              emptyContent={isLoading ? ' ' : 'Нет данных'}
              className='text-white'
            >
              {(deposit) => (
                <TableRow key={deposit.id}>
                  <TableCell className='whitespace-pre-wrap px-4 py-2 text-sm text-white'>
                    {deposit.id}
                  </TableCell>
                  <TableCell className='whitespace-pre-wrap px-4 py-2 text-sm text-white'>
                    {deposit.depositId}
                  </TableCell>
                  <TableCell className='whitespace-pre-wrap px-4 py-2 text-sm text-white'>
                    {deposit.coinTicker}
                  </TableCell>
                  <TableCell className='whitespace-pre-wrap px-4 py-2 text-sm text-white'>
                    {deposit.amount}
                  </TableCell>
                  <TableCell className='whitespace-pre-wrap px-4 py-2 text-sm text-white'>
                    <Chip
                      color={getStatusColor(deposit.status)}
                      variant='solid'
                      size='sm'
                    >
                      {getStatusText(deposit.status)}
                    </Chip>
                  </TableCell>
                  <TableCell className='whitespace-pre-wrap px-4 py-2 text-sm text-white'>
                    {new Date(deposit.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell className='whitespace-pre-wrap px-4 py-2 text-sm text-white'>
                    {new Date(deposit.updated_at).toLocaleString()}
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
