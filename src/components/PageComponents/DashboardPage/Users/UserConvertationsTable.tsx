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
import { useRouter } from 'next/navigation';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { fetchUserConvertations } from '@/lib/data';

interface Convertation {
  id: number;
  uuid: string | null;
  user_id: number;
  coinTickerFrom: string;
  coinTickerTo: string;
  coinAmountFrom: string;
  coinAmountTo: string;
  created_at: Date | null;
}

export default function UserConvertationsTable({
  userId,
  userEmail,
}: {
  userId: number;
  userEmail: string;
}) {
  const [convertations, setConvertations] = useState<Convertation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'created_at',
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
        const data = await fetchUserConvertations(userId);
        setConvertations(data);
      } catch (error) {
        console.error('Error fetching convertations:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [userId]);

  const sortedConvertations = [...convertations].sort((a, b) => {
    const { column, direction } = sortDescriptor;
    const multiplier = direction === 'ascending' ? 1 : -1;

    switch (column) {
      case 'id':
        return (a.id - b.id) * multiplier;
      case 'created_at':
        if (!a.created_at || !b.created_at) return 0;
        return (
          (new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime()) *
          multiplier
        );
      case 'coinTickerFrom':
        return a.coinTickerFrom.localeCompare(b.coinTickerFrom) * multiplier;
      case 'coinTickerTo':
        return a.coinTickerTo.localeCompare(b.coinTickerTo) * multiplier;
      case 'coinAmountFrom':
        return (
          (parseFloat(a.coinAmountFrom) - parseFloat(b.coinAmountFrom)) *
          multiplier
        );
      case 'coinAmountTo':
        return (
          (parseFloat(a.coinAmountTo) - parseFloat(b.coinAmountTo)) * multiplier
        );
      default:
        return 0;
    }
  });

  const pages = Math.max(
    1,
    Math.ceil(sortedConvertations.length / rowsPerPage),
  );
  const paginatedConvertations = sortedConvertations.slice(
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
            История конвертаций
          </BreadcrumbItem>
        </Breadcrumbs>

        <div className='mt-4 flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-white'>
              История конвертаций
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
            aria-label='Convertations table'
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
                key='created_at'
                allowsSorting
                className='whitespace-nowrap bg-gray-800 px-4 py-2 text-sm text-white'
              >
                Дата и время
              </TableColumn>
              <TableColumn
                key='coinTickerFrom'
                allowsSorting
                className='whitespace-nowrap bg-gray-800 px-4 py-2 text-sm text-white'
              >
                Из
              </TableColumn>
              <TableColumn
                key='coinAmountFrom'
                allowsSorting
                className='whitespace-nowrap bg-gray-800 px-4 py-2 text-sm text-white'
              >
                Сумма
              </TableColumn>
              <TableColumn
                key='coinTickerTo'
                allowsSorting
                className='whitespace-nowrap bg-gray-800 px-4 py-2 text-sm text-white'
              >
                В
              </TableColumn>
              <TableColumn
                key='coinAmountTo'
                allowsSorting
                className='whitespace-nowrap bg-gray-800 px-4 py-2 text-sm text-white'
              >
                Сумма
              </TableColumn>
            </TableHeader>
            <TableBody
              items={paginatedConvertations}
              emptyContent={isLoading ? ' ' : 'Нет данных'}
              className='text-white'
            >
              {(convertation) => (
                <TableRow key={convertation.id}>
                  <TableCell className='whitespace-pre-wrap px-4 py-2 text-sm text-white'>
                    {convertation.id}
                  </TableCell>
                  <TableCell className='whitespace-pre-wrap px-4 py-2 text-sm text-white'>
                    {convertation.created_at
                      ? new Date(convertation.created_at).toLocaleString()
                      : 'Нет данных'}
                  </TableCell>
                  <TableCell className='whitespace-pre-wrap px-4 py-2 text-sm text-white'>
                    {convertation.coinTickerFrom}
                  </TableCell>
                  <TableCell className='whitespace-pre-wrap px-4 py-2 text-sm text-white'>
                    {parseFloat(convertation.coinAmountFrom).toFixed(8)}
                  </TableCell>
                  <TableCell className='whitespace-pre-wrap px-4 py-2 text-sm text-white'>
                    {convertation.coinTickerTo}
                  </TableCell>
                  <TableCell className='whitespace-pre-wrap px-4 py-2 text-sm text-white'>
                    {parseFloat(convertation.coinAmountTo).toFixed(8)}
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
              Всего операций: {convertations.length}
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
