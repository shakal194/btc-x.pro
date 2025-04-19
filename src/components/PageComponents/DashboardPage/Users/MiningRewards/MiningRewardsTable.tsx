'use client';

import { useEffect, useState } from 'react';
import React from 'react';
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
import { fetchMiningRewardsHistory, type MiningRewardRecord } from '@/lib/data';
import {
  ListBulletIcon,
  FunnelIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { formatNumber } from '@/lib/utils';

interface MiningRewardsTableProps {
  userId: string;
}

const ROWS_PER_PAGE_OPTIONS = [20, 50, 100, 200];

const columns = [
  { uid: 'id', name: 'ID' },
  { uid: 'equipmentName', name: 'Устройство' },
  { uid: 'shareCount', name: 'Количество долей' },
  { uid: 'equipmentHashrate', name: 'Хешрейт' },
  { uid: 'minedAmount', name: 'Доходность' },
  { uid: 'electricityCost', name: 'Стоимость электричества' },
  { uid: 'rewardAmount', name: 'Прибыль' },
  { uid: 'balanceAfter', name: 'Итоговый баланс' },
];

export function MiningRewardsTable({ userId }: MiningRewardsTableProps) {
  const [records, setRecords] = useState<MiningRewardRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'id',
    direction: 'descending',
  });
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [isRowsOpen, setIsRowsOpen] = useState(false);
  const [isColumnsOpen, setIsColumnsOpen] = useState(false);
  const [isCoinOpen, setIsCoinOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(
    new Set(columns.map((col) => col.uid)),
  );
  const [selectedCoin, setSelectedCoin] = useState<Set<string>>(() => {
    const coins = new Set(records.map((record) => record.coinTicker));
    return coins;
  });

  useEffect(() => {
    setPage(1);
  }, [rowsPerPage]);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const data = await fetchMiningRewardsHistory(Number(userId));
        setRecords(data);
      } catch (error) {
        console.error('Error fetching mining rewards:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [userId]);

  useEffect(() => {
    if (records.length > 0) {
      setSelectedCoin(new Set(records.map((record) => record.coinTicker)));
    }
  }, [records]);

  const filteredRecords = records.filter((record) =>
    selectedCoin.has(record.coinTicker),
  );

  const sortedRecords = [...filteredRecords].sort((a, b) => {
    const { column, direction } = sortDescriptor;
    const multiplier = direction === 'ascending' ? 1 : -1;

    switch (column) {
      case 'id':
        return (a.id - b.id) * multiplier;
      case 'equipmentName':
        return a.equipmentName.localeCompare(b.equipmentName) * multiplier;
      case 'shareCount':
        return (a.shareCount - b.shareCount) * multiplier;
      case 'equipmentHashrate':
        return (
          (Number(a.equipmentHashrate) - Number(b.equipmentHashrate)) *
          multiplier
        );
      case 'minedAmount':
        return (Number(a.minedAmount) - Number(b.minedAmount)) * multiplier;
      case 'electricityCost':
        return (
          (Number(a.electricityCost) - Number(b.electricityCost)) * multiplier
        );
      case 'rewardAmount':
        return (Number(a.rewardAmount) - Number(b.rewardAmount)) * multiplier;
      case 'balanceAfter':
        return (Number(a.balanceAfter) - Number(b.balanceAfter)) * multiplier;
      case 'coinTicker':
        return a.coinTicker.localeCompare(b.coinTicker) * multiplier;
      default:
        return 0;
    }
  });

  const pages = Math.max(1, Math.ceil(sortedRecords.length / rowsPerPage));
  const paginatedRecords = sortedRecords.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  const uniqueCoins = Array.from(
    new Set(records.map((record) => record.coinTicker)),
  );

  const headerColumns = columns.filter((column) =>
    visibleColumns.has(column.uid),
  );

  return (
    <div className='min-h-screen w-full space-y-4'>
      <div className='flex flex-col gap-4'>
        <div className='space-y-4 md:flex md:items-center md:justify-between md:space-y-0'>
          <div>
            <h1 className='text-2xl font-bold text-default-500'>
              История начислений майнинга
            </h1>
          </div>
          <div className='flex justify-between gap-3'>
            <Dropdown
              isOpen={isColumnsOpen}
              onOpenChange={setIsColumnsOpen}
              className='w-full bg-inherit'
            >
              <DropdownTrigger>
                <Button
                  variant='ghost'
                  color='secondary'
                  endContent={
                    isColumnsOpen ? (
                      <ChevronUpIcon className='h-4 w-4 text-gray-400' />
                    ) : (
                      <ChevronDownIcon className='h-4 w-4 text-gray-400' />
                    )
                  }
                >
                  Столбцы
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label='Выбор столбцов'
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode='multiple'
                onSelectionChange={(keys) => {
                  if (typeof keys === 'string') {
                    setVisibleColumns(new Set([keys]));
                  } else {
                    const stringKeys = Array.from(keys).map((key) =>
                      String(key),
                    );
                    setVisibleColumns(new Set(stringKeys));
                  }
                }}
                className='max-h-[30vh] border-0 bg-white text-sm'
                classNames={{
                  base: 'bg-white border-0 focus:outline-none rounded-lg',
                  list: 'bg-white text-gray-900',
                }}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid}>{column.name}</DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

            <Dropdown
              isOpen={isCoinOpen}
              onOpenChange={setIsCoinOpen}
              className='w-full bg-inherit'
            >
              <DropdownTrigger>
                <Button
                  variant='ghost'
                  color='secondary'
                  endContent={
                    isCoinOpen ? (
                      <ChevronUpIcon className='h-4 w-4 text-gray-400' />
                    ) : (
                      <ChevronDownIcon className='h-4 w-4 text-gray-400' />
                    )
                  }
                >
                  <FunnelIcon className='h-4 w-4' />
                  {Array.from(selectedCoin).length
                    ? `Выбрано: ${Array.from(selectedCoin).length}`
                    : 'Выберите монету'}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label='Выбор монеты'
                selectionMode='multiple'
                selectedKeys={selectedCoin}
                onSelectionChange={(keys) => {
                  if (typeof keys === 'string') {
                    setSelectedCoin(new Set([keys]));
                  } else {
                    const stringKeys = Array.from(keys).map((key) =>
                      String(key),
                    );
                    setSelectedCoin(new Set(stringKeys));
                  }
                }}
                className='max-h-[30vh] border-0 bg-white text-sm'
                classNames={{
                  base: 'bg-white border-0 focus:outline-none rounded-lg',
                  list: 'bg-white text-gray-900',
                }}
              >
                <DropdownItem
                  key='select-all-coins'
                  onPress={() => setSelectedCoin(new Set(uniqueCoins))}
                  color='success'
                  className='text-success'
                >
                  Выбрать все
                </DropdownItem>
                <DropdownItem
                  key='clear-all-coins'
                  onPress={() => setSelectedCoin(new Set())}
                  color='danger'
                  className='text-danger'
                >
                  Очистить все
                </DropdownItem>
                <React.Fragment>
                  {uniqueCoins.map((coin) => (
                    <DropdownItem key={coin}>{coin}</DropdownItem>
                  ))}
                </React.Fragment>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>

        <div className='relative overflow-x-auto rounded-lg'>
          {isLoading && (
            <div className='absolute inset-0 z-50 flex items-center justify-center bg-gray-900/50'>
              <Spinner size='lg' color='secondary' />
            </div>
          )}

          <Table
            aria-label='Mining rewards table'
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
              {headerColumns.map((column) => (
                <TableColumn
                  key={column.uid}
                  allowsSorting
                  className='whitespace-nowrap bg-gray-800 px-4 py-2 text-sm text-white'
                >
                  {column.name}
                </TableColumn>
              ))}
            </TableHeader>
            <TableBody
              items={paginatedRecords}
              emptyContent={isLoading ? ' ' : 'Нет данных'}
              className='text-white'
            >
              {(record) => (
                <TableRow key={record.id}>
                  {headerColumns.map((column) => (
                    <TableCell
                      key={column.uid}
                      className='whitespace-pre-wrap px-4 py-2 text-sm text-white'
                    >
                      {column.uid === 'id' && record.id}
                      {column.uid === 'equipmentName' && record.equipmentName}
                      {column.uid === 'shareCount' &&
                        formatNumber(record.shareCount, 0)}
                      {column.uid === 'equipmentHashrate' &&
                        `${formatNumber(Number(record.equipmentHashrate), 2)} ${record.equipmentHashrateUnit}`}
                      {column.uid === 'minedAmount' &&
                        `${formatNumber(Number(record.minedAmount))} ${record.coinTicker}`}
                      {column.uid === 'electricityCost' &&
                        `${formatNumber(Number(record.electricityCost))} ${record.coinTicker}`}
                      {column.uid === 'rewardAmount' &&
                        `${formatNumber(Number(record.rewardAmount))} ${record.coinTicker}`}
                      {column.uid === 'balanceAfter' &&
                        `${formatNumber(Number(record.balanceAfter))} ${record.coinTicker}`}
                    </TableCell>
                  ))}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className='flex flex-col justify-between space-y-4 text-gray-400 md:items-center'>
          <div className='flex w-full items-center justify-between'>
            <span className='text-sm'>
              Всего записей: {filteredRecords.length}
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

        <div className='flex w-full justify-center'>
          <Pagination
            total={pages}
            page={page}
            onChange={(newPage) => {
              setPage(newPage);
            }}
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
      </div>
    </div>
  );
}
