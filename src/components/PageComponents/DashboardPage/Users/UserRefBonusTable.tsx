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
import { useRouter } from 'next/navigation';
import { ListBulletIcon } from '@heroicons/react/24/outline';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

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
}

interface RefBonusRecord {
  id: number;
  recordDate: Date;
  referral_percent: string;
  referral_bonus: string;
  referralEmail: string;
}

export default function UserRefBonusTable({
  userId,
  userEmail,
}: {
  userId: number;
  userEmail: string;
}) {
  const [transactions, setTransactions] = useState<RefBonusTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'transactionDate',
    direction: 'descending',
  });
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const router = useRouter();
  const [isRowsOpen, setIsRowsOpen] = useState(false);

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
        const data = await fetchUserRefBonusTransactions(userId);
        const records = data.map((item) => ({
          id: item.id,
          transactionDate: item.recordDate,
          referralEmail: item.referralEmail,
          bonusPercent: parseFloat(item.referral_percent),
          bonusAmount: parseFloat(item.referral_bonus),
        }));
        setTransactions(records);
      } catch (error) {
        console.error('Error fetching referral bonus transactions:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [userId]);

  const sortedTransactions = [...transactions].sort((a, b) => {
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
      case 'referralEmail':
        return a.referralEmail.localeCompare(b.referralEmail) * multiplier;
      case 'bonusPercent':
        return (a.bonusPercent - b.bonusPercent) * multiplier;
      case 'bonusAmount':
        return (a.bonusAmount - b.bonusAmount) * multiplier;
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
            История реферальных начислений
          </BreadcrumbItem>
        </Breadcrumbs>

        <div className='mt-4 flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-white'>
              История реферальных начислений
            </h1>
          </div>
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
                Процент бонуса
              </TableColumn>
              <TableColumn
                key='bonusAmount'
                allowsSorting
                className='whitespace-nowrap bg-gray-800 px-4 py-2 text-sm text-white'
              >
                Сумма бонуса
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
                    {transaction.referralEmail}
                  </TableCell>
                  <TableCell className='whitespace-pre-wrap px-4 py-2 text-sm text-white'>
                    {transaction.bonusPercent}%
                  </TableCell>
                  <TableCell className='whitespace-pre-wrap px-4 py-2 text-sm text-white'>
                    ${transaction.bonusAmount.toFixed(2)}
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
