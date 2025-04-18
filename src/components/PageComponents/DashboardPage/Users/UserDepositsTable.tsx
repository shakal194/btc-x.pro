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
import { fetchUserDeposits, fetchUserWithdrawals } from '@/lib/data';
import { useRouter } from 'next/navigation';
import {
  FunnelIcon,
  ListBulletIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';

type DepositStatus =
  | 'all'
  | 'confirmed'
  | 'unconfirmed'
  | 'created'
  | 'failed'
  | 'blocked'
  | 'canceled';

type OperationType = 'all' | 'deposit' | 'withdrawal';

interface Operation {
  id: number;
  type: 'deposit' | 'withdrawal';
  depositId?: number;
  coinTicker: string;
  amount: string;
  status: string;
  created_at: Date;
  updated_at: Date;
  network?: string;
  address?: string;
  fee?: string;
}

const ROWS_PER_PAGE_OPTIONS = [20, 50, 100, 200];

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

export default function UserDepositsTable({
  userId,
  userEmail,
}: {
  userId: number;
  userEmail: string;
}) {
  const [operations, setOperations] = useState<Operation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [operationType, setOperationType] = useState<OperationType>('all');
  const [selectedStatuses, setSelectedStatuses] = useState<Set<DepositStatus>>(
    new Set([
      'confirmed',
      'unconfirmed',
      'created',
      'failed',
      'blocked',
      'canceled',
    ]),
  );
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [isRowsOpen, setIsRowsOpen] = useState(false);
  const [isOperationTypeOpen, setIsOperationTypeOpen] = useState(false);
  const [isStatusesOpen, setIsStatusesOpen] = useState(false);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'created_at',
    direction: 'descending',
  });
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const [depositsData, withdrawalsData] = await Promise.all([
          fetchUserDeposits(userId),
          fetchUserWithdrawals(userId),
        ]);

        const transformedDeposits = depositsData.map((deposit) => ({
          ...deposit,
          type: 'deposit' as const,
        }));

        const transformedWithdrawals = withdrawalsData.map((withdrawal) => ({
          id: withdrawal.id,
          type: 'withdrawal' as const,
          coinTicker: withdrawal.coinTicker,
          amount: withdrawal.amount,
          status: withdrawal.status,
          created_at: withdrawal.created_at,
          updated_at: withdrawal.updated_at,
          network: withdrawal.network,
          address: withdrawal.address,
          fee: withdrawal.fee,
        }));

        setOperations([...transformedDeposits, ...transformedWithdrawals]);
      } catch (error) {
        console.error('Error fetching operations:', error);
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

  const selectAllStatuses = () => {
    const allStatuses: DepositStatus[] = [
      'confirmed',
      'unconfirmed',
      'created',
      'failed',
      'blocked',
      'canceled',
    ];
    setSelectedStatuses(new Set(allStatuses));
  };

  const deselectAllStatuses = () => {
    setSelectedStatuses(new Set());
  };

  const filteredOperations = operations.filter((operation) => {
    if (operationType !== 'all' && operation.type !== operationType)
      return false;
    if (selectedStatuses.size === 0) return false;
    return selectedStatuses.has(operation.status as DepositStatus);
  });

  const sortedOperations = [...filteredOperations].sort((a, b) => {
    const { column, direction } = sortDescriptor;
    const multiplier = direction === 'ascending' ? 1 : -1;

    switch (column) {
      case 'id':
        return (a.id - b.id) * multiplier;
      case 'depositId':
        return ((a.depositId || 0) - (b.depositId || 0)) * multiplier;
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

  const pages = Math.max(1, Math.ceil(sortedOperations.length / rowsPerPage));
  const paginatedOperations = sortedOperations.slice(
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
            История депозитов
          </BreadcrumbItem>
        </Breadcrumbs>

        <div className='mt-4 flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-white'>История депозитов</h1>
          </div>
          <div className='flex gap-4'>
            <Dropdown
              isOpen={isOperationTypeOpen}
              onOpenChange={setIsOperationTypeOpen}
            >
              <DropdownTrigger>
                <Button
                  variant='ghost'
                  color='secondary'
                  className='flex items-center gap-2'
                  endContent={
                    isOperationTypeOpen ? (
                      <ChevronUpIcon className='h-4 w-4' />
                    ) : (
                      <ChevronDownIcon className='h-4 w-4' />
                    )
                  }
                >
                  <FunnelIcon className='h-4 w-4' />
                  {operationType === 'all'
                    ? 'Все операции'
                    : operationType === 'deposit'
                      ? 'Депозиты'
                      : 'Выводы'}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label='Тип операции'
                onAction={(key) => setOperationType(key as OperationType)}
                selectedKeys={new Set([operationType])}
                selectionMode='single'
              >
                <DropdownItem key='all'>Все операции</DropdownItem>
                <DropdownItem key='deposit'>Депозиты</DropdownItem>
                <DropdownItem key='withdrawal'>Выводы</DropdownItem>
              </DropdownMenu>
            </Dropdown>

            <Dropdown isOpen={isStatusesOpen} onOpenChange={setIsStatusesOpen}>
              <DropdownTrigger>
                <Button
                  variant='ghost'
                  color='secondary'
                  className='flex items-center gap-2'
                  endContent={
                    isStatusesOpen ? (
                      <ChevronUpIcon className='h-4 w-4' />
                    ) : (
                      <ChevronDownIcon className='h-4 w-4' />
                    )
                  }
                >
                  <FunnelIcon className='h-4 w-4' />
                  {selectedStatuses.size === 0
                    ? 'Все статусы'
                    : selectedStatuses.size === 1
                      ? getStatusText(Array.from(selectedStatuses)[0])
                      : `${selectedStatuses.size} статусов`}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label='Фильтр статусов'
                selectionMode='multiple'
                selectedKeys={selectedStatuses}
                onSelectionChange={(keys) => {
                  setSelectedStatuses(keys as Set<DepositStatus>);
                }}
              >
                <DropdownItem
                  key='selectAll'
                  onPress={selectAllStatuses}
                  color='success'
                  className='text-success'
                >
                  Выбрать все
                </DropdownItem>
                <DropdownItem
                  key='deselectAll'
                  onPress={deselectAllStatuses}
                  color='danger'
                  className='text-danger'
                >
                  Отменить все
                </DropdownItem>
                <DropdownItem key='confirmed'>Подтвержден</DropdownItem>
                <DropdownItem key='unconfirmed'>Неподтвержден</DropdownItem>
                <DropdownItem key='created'>Создан</DropdownItem>
                <DropdownItem key='failed'>Ошибка</DropdownItem>
                <DropdownItem key='blocked'>Заблокирован</DropdownItem>
                <DropdownItem key='canceled'>Отменен</DropdownItem>
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
            aria-label='Operations table'
            sortDescriptor={sortDescriptor}
            onSortChange={setSortDescriptor}
            isHeaderSticky
            isVirtualized={true}
            maxTableHeight={600}
            color='success'
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
                key='type'
                allowsSorting
                className='whitespace-nowrap bg-gray-800 px-4 py-2 text-sm text-white'
              >
                Тип операции
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
              items={paginatedOperations}
              emptyContent={isLoading ? ' ' : 'Нет данных'}
              className='text-white'
            >
              {(operation) => (
                <TableRow key={operation.id}>
                  <TableCell className='whitespace-pre-wrap px-4 py-2 text-sm text-white'>
                    {operation.id}
                  </TableCell>
                  <TableCell className='whitespace-pre-wrap px-4 py-2 text-sm text-white'>
                    {operation.type === 'deposit' ? 'Депозит' : 'Вывод'}
                  </TableCell>
                  <TableCell className='whitespace-pre-wrap px-4 py-2 text-sm text-white'>
                    {operation.depositId || '-'}
                  </TableCell>
                  <TableCell className='whitespace-pre-wrap px-4 py-2 text-sm text-white'>
                    {operation.coinTicker}
                  </TableCell>
                  <TableCell className='whitespace-pre-wrap px-4 py-2 text-sm text-white'>
                    {operation.amount}
                  </TableCell>
                  <TableCell className='whitespace-pre-wrap px-4 py-2 text-sm text-white'>
                    <Chip
                      color={getStatusColor(operation.status)}
                      variant='flat'
                      size='sm'
                    >
                      {getStatusText(operation.status)}
                    </Chip>
                  </TableCell>
                  <TableCell className='whitespace-pre-wrap px-4 py-2 text-sm text-white'>
                    {new Date(operation.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell className='whitespace-pre-wrap px-4 py-2 text-sm text-white'>
                    {new Date(operation.updated_at).toLocaleString()}
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
              Всего операций: {filteredOperations.length}
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
    </div>
  );
}
