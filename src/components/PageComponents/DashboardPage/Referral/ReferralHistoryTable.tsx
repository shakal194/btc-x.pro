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
  SortDescriptor,
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
} from '@heroui/react';
import { fetchUserRefBonusTransactions } from '@/lib/data';
import { useParams } from 'next/navigation';
import { ListBulletIcon } from '@heroicons/react/24/outline';

interface ApiRefBonusTransaction {
  id: number;
  recordDate: Date;
  uuid: string | null;
  referral_id: number;
  referral_percent: number;
  referral_bonus: string;
  referralEmail: string;
}

interface RefBonusTransaction {
  id: number;
  transactionDate: Date;
  referralEmail: string;
  bonusPercent: number;
  bonusAmount: number;
  balanceAfter: number;
}

export default function ReferralHistoryTable({
  userId: referralId,
}: {
  userId: number;
}) {
  const { locale } = useParams();
  const [transactions, setTransactions] = useState<RefBonusTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'transactionDate',
    direction: 'descending',
  });
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const rowsPerPageOptions = [
    { key: '20', label: '20 строк' },
    { key: '50', label: '50 строк' },
    { key: '100', label: '100 строк' },
    { key: '200', label: '200 строк' },
  ];

  useEffect(() => {
    setPage(1);
  }, [rowsPerPage]);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const data = await fetchUserRefBonusTransactions(referralId);

        // Сортируем транзакции по дате (по возрастанию) для расчета накопительного баланса
        const sortedData = [...data].sort(
          (a, b) =>
            new Date(a.recordDate).getTime() - new Date(b.recordDate).getTime(),
        );

        let currentBalance = 0;
        const mappedData: RefBonusTransaction[] = sortedData.map(
          (item: ApiRefBonusTransaction) => {
            const bonusAmount = Number(item.referral_bonus);
            currentBalance += bonusAmount;
            return {
              id: item.id,
              transactionDate: item.recordDate,
              referralEmail: item.referralEmail,
              bonusPercent: item.referral_percent,
              bonusAmount: bonusAmount,
              balanceAfter: currentBalance,
            };
          },
        );
        setTransactions(mappedData);
      } catch (error) {
        console.error('Error fetching referral bonus transactions:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [referralId]);

  const sortedTransactions = [...transactions].sort((a, b) => {
    const { column, direction } = sortDescriptor;
    const multiplier = direction === 'ascending' ? 1 : -1;

    switch (column) {
      case 'transactionDate':
        return (
          (new Date(a.transactionDate).getTime() -
            new Date(b.transactionDate).getTime()) *
          multiplier
        );
      case 'referralEmail':
        return a.referralEmail.localeCompare(b.referralEmail) * multiplier;
      case 'bonusPercent':
        return (a.bonusPercent - b.bonusPercent) * multiplier;
      case 'bonusAmount':
        return (a.bonusAmount - b.bonusAmount) * multiplier;
      case 'balanceAfter':
        return (a.balanceAfter - b.balanceAfter) * multiplier;
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
          <BreadcrumbItem
            href={`/${locale}/dashboard/settings`}
            className='text-gray-300'
          >
            Настройки
          </BreadcrumbItem>
          <BreadcrumbItem isCurrent className='text-gray-200'>
            История реферальных начислений
          </BreadcrumbItem>
        </Breadcrumbs>

        <div className='mt-4'>
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
        </div>

        <div className='relative mt-4 overflow-x-auto rounded-lg bg-gray-900'>
          {isLoading && (
            <div className='absolute inset-0 z-50 flex items-center justify-center bg-gray-900/50'>
              <Spinner size='lg' color='secondary' />
            </div>
          )}

          <Table
            aria-label='Referral bonus transactions table'
            isHeaderSticky
            isVirtualized={true}
            maxTableHeight={500}
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
                key='transactionDate'
                allowsSorting
                className='whitespace-nowrap bg-gray-800 px-4 py-2 text-sm text-white'
              >
                Дата и время
              </TableColumn>
              <TableColumn
                key='referralEmail'
                allowsSorting
                className='whitespace-nowrap bg-gray-800 px-4 py-2 text-sm text-white'
              >
                Email реферала
              </TableColumn>
              <TableColumn
                key='bonusPercent'
                allowsSorting
                className='whitespace-nowrap bg-gray-800 px-4 py-2 text-sm text-white'
              >
                Реферальный процент
              </TableColumn>
              <TableColumn
                key='bonusAmount'
                allowsSorting
                className='whitespace-nowrap bg-gray-800 px-4 py-2 text-sm text-white'
              >
                Реферальный бонус, USDT
              </TableColumn>
              <TableColumn
                key='balanceAfter'
                allowsSorting
                className='whitespace-nowrap bg-gray-800 px-4 py-2 text-sm text-white'
              >
                Баланс после начисления, USDT
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
                    {new Date(transaction.transactionDate).toLocaleString()}
                  </TableCell>
                  <TableCell className='whitespace-pre-wrap px-4 py-2 text-sm text-white'>
                    {transaction.referralEmail}
                  </TableCell>
                  <TableCell className='whitespace-pre-wrap px-4 py-2 text-sm text-white'>
                    {transaction.bonusPercent}%
                  </TableCell>
                  <TableCell className='whitespace-pre-wrap px-4 py-2 text-sm text-white'>
                    {transaction.bonusAmount.toFixed(2)}
                  </TableCell>
                  <TableCell className='whitespace-pre-wrap px-4 py-2 text-sm text-white'>
                    {transaction.balanceAfter.toFixed(2)}
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
