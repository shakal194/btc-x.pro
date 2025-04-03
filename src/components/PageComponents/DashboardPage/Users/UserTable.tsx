'use client';

import { useEffect, useState, useMemo } from 'react';
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
  Selection,
  SortDescriptor,
  Pagination,
  Spinner,
  DateRangePicker,
  RangeValue,
  DateValue,
} from '@heroui/react';
import {
  fetchUserData,
  fetchRefBalance,
  fetchReferralCount,
  fetchAllUserBalanceShares,
  fetchEquipments,
  fetchAllUserBalances,
  fetchAlgorithms,
} from '@/lib/data';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  EllipsisVerticalIcon,
} from '@heroicons/react/24/solid';
import { parseDate } from '@internationalized/date';
import UserLinkButton from './UserLinkButton';

interface Equipment {
  id: number;
  uuid: string | null;
  name: string;
  algorithm_id: number;
  hashrate_unit: string;
  hashrate: number;
  power: string;
  purchasePrice: number;
  salePrice: number;
  shareCount: number;
  photoUrl: string | null;
}

interface Algorithm {
  id: number;
  name: string;
  uuid: string | null;
  coinTickers: { name: string; pricePerHashrate: number }[] | null;
}

interface UserData {
  id: number;
  uuid: string;
  email: string;
  status: 'admin' | 'user' | 'delete';
  registrationDate: Date;
  deletionDate?: Date;
  devices: Array<{
    name: string;
    hashrate: number;
    hashrate_unit: string;
    totalShares: number;
    sharesInUse: number;
    fullDevicesCount: number;
  }>;
  balances: Array<{
    coinTicker: string;
    amount: number;
  }>;
  referralBonus: number;
  referralCount: number;
}

const INITIAL_VISIBLE_COLUMNS = [
  'id',
  'email',
  'date',
  'devices',
  'balances',
  'referralBonus',
  'referralCount',
];

const ROWS_PER_PAGE_OPTIONS = [20, 50, 100, 200];

export default function UsersTable() {
  const [isClient, setIsClient] = useState(false);
  const [users, setUsers] = useState<UserData[]>([]);
  const [filterValue, setFilterValue] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState<RangeValue<DateValue>>({
    start: parseDate('2023-01-01'),
    end: parseDate(new Date().toISOString().split('T')[0]),
  });
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Selection>(
    new Set([]),
  );
  const [selectedDevice, setSelectedDevice] = useState<Selection>(new Set([]));
  const [selectedCoin, setSelectedCoin] = useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'id',
    direction: 'descending',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [isColumnsOpen, setIsColumnsOpen] = useState(false);
  const [isRowsOpen, setIsRowsOpen] = useState(false);
  const [equipmentsFetch, setEquipmentsFetch] = useState<Equipment[]>([]);
  const [algorithms, setAlgorithms] = useState<Algorithm[]>([]);
  const [isAlgorithmOpen, setIsAlgorithmOpen] = useState(false);
  const [isDeviceOpen, setIsDeviceOpen] = useState(false);
  const [isCoinOpen, setIsCoinOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    async function getUsersData() {
      try {
        const startTime = performance.now();
        setIsLoading(true);

        // Измеряем загрузку данных
        const fetchStart = performance.now();
        const [usersData, equipments, algorithmsData] = await Promise.all([
          fetchUserData(),
          fetchEquipments(),
          fetchAlgorithms(),
        ]);
        console.log(
          `[Performance] Data fetching took: ${performance.now() - fetchStart}ms`,
        );

        // Измеряем обработку данных
        const processingStart = performance.now();
        const formattedUsers = await Promise.all(
          usersData.map(async (user: any) => {
            // Параллельная загрузка всех данных пользователя
            const [referralBonus, referralCount, balances, userBalanceShares] =
              await Promise.all([
                fetchRefBalance(user.id),
                fetchReferralCount(user.id),
                fetchAllUserBalances(user.id),
                fetchAllUserBalanceShares(user.id),
              ]);

            const userDevices = equipments.map((equipment) => {
              const balanceShareCount =
                userBalanceShares[equipment.id]?.balanceShareCount || 0;
              if (balanceShareCount && balanceShareCount > 0) {
                const fullDevicesCount = Math.floor(
                  balanceShareCount / equipment.shareCount,
                );
                const sharesInUse =
                  balanceShareCount - fullDevicesCount * equipment.shareCount;
                return {
                  name: equipment.name,
                  hashrate: equipment.hashrate,
                  hashrate_unit: equipment.hashrate_unit,
                  totalShares: balanceShareCount,
                  sharesInUse,
                  fullDevicesCount,
                };
              }
              return null;
            });

            return {
              id: user.id,
              uuid: user.uuid,
              email: user.email,
              status: user.status,
              registrationDate: new Date(user.registration_date),
              deletionDate:
                user.status === 'delete'
                  ? new Date(user.deleting_date)
                  : undefined,
              devices: userDevices.filter(
                (device): device is NonNullable<typeof device> =>
                  device !== null,
              ),
              balances: balances.map((balance) => ({
                coinTicker: balance.coinTicker,
                amount: Number(balance.coinAmount),
              })),
              referralBonus: Number(referralBonus) || 0,
              referralCount: referralCount || 0,
            };
          }),
        );
        console.log(
          `[Performance] Data processing took: ${performance.now() - processingStart}ms`,
        );

        setUsers(formattedUsers);
        setEquipmentsFetch(equipments);
        setAlgorithms(algorithmsData);

        const totalTime = performance.now() - startTime;
        console.log(`[Performance] Total operation took: ${totalTime}ms`);
      } catch (error) {
        console.error('Error fetching users data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    getUsersData();
  }, []);

  const columns = useMemo(
    () => [
      { name: 'User ID', uid: 'id', sortable: true },
      { name: 'Email', uid: 'email', sortable: true },
      {
        name: 'Дата регистрации (удаления)',
        uid: 'date',
        sortable: true,
      },
      { name: 'Устройства', uid: 'devices', sortable: true },
      { name: 'Балансы', uid: 'balances', sortable: true },
      { name: 'Реферальный бонус, USDT', uid: 'referralBonus', sortable: true },
      { name: 'Кол-во рефералов', uid: 'referralCount', sortable: true },
    ],
    [],
  );

  const headerColumns = useMemo(() => {
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid),
    );
  }, [visibleColumns, columns]);

  // Get unique values for filters
  const filterOptions = useMemo(() => {
    const algorithmsSet = new Set<string>();
    const devices = new Set<string>();
    const coins = new Set<string>();

    users.forEach((user) => {
      user.devices.forEach((device) => {
        const equipment = equipmentsFetch.find((eq) => eq.name === device.name);
        if (equipment) {
          const algorithm = algorithms.find(
            (algo) => algo.id === equipment.algorithm_id,
          );
          if (algorithm) {
            algorithmsSet.add(algorithm.name);
          }
        }
        devices.add(device.name);
      });
      user.balances.forEach((balance) => {
        coins.add(balance.coinTicker);
      });
    });

    return {
      algorithms: Array.from(algorithmsSet),
      devices: Array.from(devices),
      coins: Array.from(coins),
    };
  }, [users, equipmentsFetch, algorithms]);

  // Filter data
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Filter by search value
      const searchMatch =
        filterValue === '' ||
        user.email.toLowerCase().includes(filterValue.toLowerCase()) ||
        user.id.toString().includes(filterValue);

      // Filter by date range
      const dateMatch =
        (!dateRange.start && !dateRange.end) ||
        (dateRange.start &&
          dateRange.end &&
          new Date(user.registrationDate) >=
            new Date(dateRange.start.toString().split('T')[0] + 'T00:00:00') &&
          new Date(user.registrationDate) <=
            new Date(dateRange.end.toString().split('T')[0] + 'T23:59:59'));

      // Filter by algorithm
      const algorithmMatch =
        selectedAlgorithm === 'all' ||
        (selectedAlgorithm instanceof Set && selectedAlgorithm.size === 0) ||
        user.devices.some((device) => {
          const equipment = equipmentsFetch.find(
            (eq) => eq.name === device.name,
          );
          if (!equipment) return false;
          const algorithm = algorithms.find(
            (algo) => algo.id === equipment.algorithm_id,
          );
          return (
            algorithm &&
            Array.from(selectedAlgorithm as Set<string>).includes(
              algorithm.name,
            )
          );
        });

      // Filter by device
      const deviceMatch =
        selectedDevice === 'all' ||
        (selectedDevice instanceof Set && selectedDevice.size === 0) ||
        user.devices.some((device) =>
          Array.from(selectedDevice as Set<string>).includes(device.name),
        );

      // Filter by coin
      const coinMatch =
        selectedCoin === 'all' ||
        (selectedCoin instanceof Set && selectedCoin.size === 0) ||
        user.balances.some((balance) =>
          Array.from(selectedCoin as Set<string>).includes(balance.coinTicker),
        );

      return (
        searchMatch && dateMatch && algorithmMatch && deviceMatch && coinMatch
      );
    });
  }, [
    users,
    filterValue,
    dateRange,
    selectedAlgorithm,
    selectedDevice,
    selectedCoin,
    equipmentsFetch,
    algorithms,
  ]);

  // Функция для сортировки данных
  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      if (sortDescriptor.column === 'date') {
        return sortDescriptor.direction === 'ascending'
          ? a.registrationDate.getTime() - b.registrationDate.getTime()
          : b.registrationDate.getTime() - a.registrationDate.getTime();
      }

      const first = a[sortDescriptor.column as keyof UserData];
      const second = b[sortDescriptor.column as keyof UserData];

      if (first === undefined || second === undefined) return 0;

      const cmp = (() => {
        if (sortDescriptor.column === 'devices') {
          const devicesA = a.devices.length;
          const devicesB = b.devices.length;
          return devicesA - devicesB;
        }
        if (sortDescriptor.column === 'balances') {
          const totalBalanceA = a.balances.reduce(
            (sum, balance) => sum + balance.amount,
            0,
          );
          const totalBalanceB = b.balances.reduce(
            (sum, balance) => sum + balance.amount,
            0,
          );
          return totalBalanceA - totalBalanceB;
        }
        if (typeof first === 'string') {
          return first.localeCompare(second as string);
        }
        return Number(first) - Number(second);
      })();

      return sortDescriptor.direction === 'descending' ? -cmp : cmp;
    });
  }, [filteredUsers, sortDescriptor]);

  // Пагинация и вычисление общих сумм
  const { paginatedUsers, selectedTotals, pages } = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedUsers = sortedUsers.slice(start, end);

    const selectedUsers =
      selectedKeys === 'all'
        ? paginatedUsers
        : paginatedUsers.filter((user) =>
            Array.from(selectedKeys as Set<string>).includes(
              user.id.toString(),
            ),
          );

    const totals = selectedUsers.reduce(
      (
        acc: { balances: Record<string, number>; totalRefBonus: number },
        user,
      ) => {
        user.balances.forEach(
          (balance: { coinTicker: string; amount: number }) => {
            acc.balances[balance.coinTicker] =
              (acc.balances[balance.coinTicker] || 0) + balance.amount;
          },
        );
        acc.totalRefBonus += user.referralBonus;
        return acc;
      },
      {
        balances: {} as Record<string, number>,
        totalRefBonus: 0,
      },
    );

    return {
      paginatedUsers,
      selectedTotals: totals,
      pages: Math.max(1, Math.ceil(filteredUsers.length / rowsPerPage)),
    };
  }, [page, rowsPerPage, sortedUsers, selectedKeys, filteredUsers]);

  const renderCell = (user: UserData, columnKey: string) => {
    switch (columnKey) {
      case 'id':
        return <span className='text-inherit'>{user.id}</span>;
      case 'email':
        return (
          <div className='flex items-center gap-3'>
            <div className='flex flex-col'>
              <UserLinkButton user={user} />
            </div>
          </div>
        );
      case 'date':
        return (
          <p className='text-inherit'>
            {user.deletionDate
              ? `${user.registrationDate.toLocaleString()}\n(Удален: ${user.deletionDate.toLocaleString()})`
              : user.registrationDate.toLocaleString()}
          </p>
        );
      case 'devices':
        return (
          <span className='whitespace-pre-line text-inherit'>
            {user.devices.length > 0
              ? user.devices
                  .map(
                    (device) =>
                      `${device.name} ${device.hashrate}${device.hashrate_unit} - ${device.sharesInUse} долей (${device.fullDevicesCount} устр.)`,
                  )
                  .join('\n')
              : 'Нет устройств'}
          </span>
        );
      case 'balances':
        return (
          <span className='text-inherit'>
            {user.balances.length > 0
              ? user.balances
                  .map(
                    (balance) =>
                      `${balance.coinTicker}: ${balance.amount.toFixed(8)}`,
                  )
                  .join(', ')
              : 'Нет балансов'}
          </span>
        );
      case 'referralBonus':
        return (
          <span className='text-inherit'>${user.referralBonus.toFixed(2)}</span>
        );
      case 'referralCount':
        return <span className='text-inherit'>{user.referralCount}</span>;
      case 'status':
        const statusColorMap = {
          admin: 'bg-emerald-500',
          user: 'bg-blue-500',
          delete: 'bg-red-500',
        };
        const statusTextMap = {
          admin: 'Администратор',
          user: 'Пользователь',
          delete: 'Удален',
        };
        return (
          <div className='flex items-center gap-2'>
            <div
              className={`h-2 w-2 rounded-full ${statusColorMap[user.status]}`}
            ></div>
            <span className='text-sm text-white'>
              {statusTextMap[user.status]}
            </span>
          </div>
        );
      case 'actions':
        return (
          <button className='rounded-full p-2 hover:bg-gray-700'>
            <EllipsisVerticalIcon className='h-5 w-5 text-gray-400' />
          </button>
        );
      default:
        return null;
    }
  };

  if (!isClient) {
    return <div className='min-h-screen w-full bg-black/90' />;
  }

  return (
    <div className='min-h-screen w-full space-y-4 bg-black/90'>
      <div className='flex flex-col gap-4'>
        <div className='space-y-4 md:flex md:items-center md:justify-between md:space-y-0'>
          <div className='flex items-center gap-3'>
            <Input
              variant='bordered'
              classNames={{
                base: 'w-full md:w-72',
                inputWrapper:
                  'border-1 border-gray-700 bg-gray-800 hover:border-gray-600 focus-within:!border-gray-500',
                input: 'text-gray-300 placeholder:text-gray-300',
                clearButton: 'text-gray-300 hover:text-gray-300',
              }}
              placeholder='Поиск по имени...'
              startContent={
                <MagnifyingGlassIcon className='h-4 w-4 text-gray-300' />
              }
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              isClearable
              onClear={() => setFilterValue('')}
            />
          </div>
          <div className='flex justify-between gap-3'>
            <Button
              variant='flat'
              className='w-full border-0 bg-gray-800 text-white md:w-auto'
              onPress={() => setShowFilters(!showFilters)}
              startContent={<FunnelIcon className='h-4 w-4' />}
              endContent={
                showFilters ? (
                  <ChevronUpIcon className='h-4 w-4 text-gray-400' />
                ) : (
                  <ChevronDownIcon className='h-4 w-4 text-gray-400' />
                )
              }
            >
              Фильтры
            </Button>
            <Dropdown
              isOpen={isColumnsOpen}
              onOpenChange={setIsColumnsOpen}
              className='bg-gray-700'
            >
              <DropdownTrigger>
                <Button
                  variant='flat'
                  className='border-0 bg-gray-800 text-white'
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
                onSelectionChange={setVisibleColumns}
                className='border-0 bg-gray-700'
                classNames={{
                  base: 'bg-gray-700 border-0 focus:outline-none rounded-lg',
                  list: 'bg-gray-700 text-white',
                }}
              >
                {columns.map((column) => (
                  <DropdownItem
                    key={column.uid}
                    className='text-white hover:bg-gray-700'
                  >
                    {column.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>

        {showFilters && (
          <div className='gap-4 space-y-4 rounded-lg bg-gray-800 p-4'>
            <div className='flex flex-wrap items-end space-y-4'>
              <div className='flex w-full max-w-[400px] flex-col gap-2'>
                <DateRangePicker
                  labelPlacement='outside'
                  label='Дата регистрации:'
                  value={dateRange}
                  onChange={(value) =>
                    setDateRange(
                      value || {
                        start: parseDate('2023-01-01'),
                        end: parseDate(new Date().toISOString().split('T')[0]),
                      },
                    )
                  }
                  classNames={{
                    base: 'w-full',
                    inputWrapper:
                      'border-1 border-gray-700 bg-gray-900 hover:border-gray-600 focus-within:!border-gray-500',
                    input: 'text-gray-300 text-sm hover:text-gray-300',
                    calendar: 'bg-gray-900 text-gray-300',
                  }}
                />
              </div>

              <div className='w-full justify-between space-y-4 md:flex md:space-y-0'>
                <div className='flex w-full max-w-[200px] flex-col gap-2'>
                  <Dropdown
                    isOpen={isAlgorithmOpen}
                    onOpenChange={setIsAlgorithmOpen}
                    className='w-full bg-inherit'
                  >
                    <DropdownTrigger className='w-full'>
                      <Button
                        variant='flat'
                        className='w-full border-1 border-gray-700 bg-gray-900 text-white'
                        endContent={
                          isAlgorithmOpen ? (
                            <ChevronUpIcon className='h-4 w-4 text-gray-400' />
                          ) : (
                            <ChevronDownIcon className='h-4 w-4 text-gray-400' />
                          )
                        }
                      >
                        {Array.from(
                          selectedAlgorithm instanceof Set
                            ? selectedAlgorithm
                            : new Set(),
                        ).length
                          ? `Выбрано: ${selectedAlgorithm instanceof Set ? selectedAlgorithm.size : 0}`
                          : 'Выберите алгоритм'}
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      disallowEmptySelection={false}
                      aria-label='Выбор алгоритма'
                      closeOnSelect={false}
                      selectedKeys={selectedAlgorithm}
                      selectionMode='multiple'
                      onSelectionChange={setSelectedAlgorithm}
                      className='w-full min-w-[300px] bg-gray-700'
                      classNames={{
                        base: 'bg-gray-700 border-0 focus:outline-none rounded-lg',
                        list: 'bg-gray-700 text-white',
                      }}
                    >
                      {filterOptions.algorithms.map((algorithm) => (
                        <DropdownItem
                          key={algorithm}
                          className='text-white hover:bg-gray-700'
                        >
                          {algorithm}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                </div>

                <div className='flex w-full max-w-[200px] flex-col gap-2'>
                  <Dropdown
                    isOpen={isDeviceOpen}
                    onOpenChange={setIsDeviceOpen}
                    className='w-full bg-inherit'
                  >
                    <DropdownTrigger className='w-full'>
                      <Button
                        variant='flat'
                        className='w-full border-1 border-gray-700 bg-gray-900 text-white'
                        endContent={
                          isDeviceOpen ? (
                            <ChevronUpIcon className='h-4 w-4 text-gray-400' />
                          ) : (
                            <ChevronDownIcon className='h-4 w-4 text-gray-400' />
                          )
                        }
                      >
                        {Array.from(
                          selectedDevice instanceof Set
                            ? selectedDevice
                            : new Set(),
                        ).length
                          ? `Выбрано: ${selectedDevice instanceof Set ? selectedDevice.size : 0}`
                          : 'Выберите устройство'}
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      disallowEmptySelection={false}
                      aria-label='Выбор устройства'
                      closeOnSelect={false}
                      selectedKeys={selectedDevice}
                      selectionMode='multiple'
                      onSelectionChange={setSelectedDevice}
                      className='w-full min-w-[300px] bg-gray-700'
                      classNames={{
                        base: 'bg-gray-700 border-0 focus:outline-none rounded-lg',
                        list: 'bg-gray-700 text-white',
                      }}
                    >
                      {filterOptions.devices.map((device) => (
                        <DropdownItem
                          key={device}
                          className='text-white hover:bg-gray-700'
                        >
                          {device}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                </div>

                <div className='flex w-full max-w-[200px] flex-col gap-2'>
                  <Dropdown
                    isOpen={isCoinOpen}
                    onOpenChange={setIsCoinOpen}
                    className='w-full bg-inherit'
                  >
                    <DropdownTrigger className='w-full'>
                      <Button
                        variant='flat'
                        className='w-full border-1 border-gray-700 bg-gray-900 text-white'
                        endContent={
                          isCoinOpen ? (
                            <ChevronUpIcon className='h-4 w-4 text-gray-400' />
                          ) : (
                            <ChevronDownIcon className='h-4 w-4 text-gray-400' />
                          )
                        }
                      >
                        {Array.from(
                          selectedCoin instanceof Set
                            ? selectedCoin
                            : new Set(),
                        ).length
                          ? `Выбрано: ${selectedCoin instanceof Set ? selectedCoin.size : 0}`
                          : 'Выберите монету'}
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      disallowEmptySelection={false}
                      aria-label='Выбор монеты'
                      closeOnSelect={false}
                      selectedKeys={selectedCoin}
                      selectionMode='multiple'
                      onSelectionChange={setSelectedCoin}
                      className='w-full min-w-[300px] bg-gray-700'
                      classNames={{
                        base: 'bg-gray-700 border-0 focus:outline-none rounded-lg',
                        list: 'bg-gray-700 text-white',
                      }}
                    >
                      {filterOptions.coins.map((coin) => (
                        <DropdownItem
                          key={coin}
                          className='text-white hover:bg-gray-700'
                        >
                          {coin}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </div>
            </div>

            <Button
              variant='flat'
              className='mt-2 border-1 border-gray-700 bg-gray-900 text-white'
              onPress={() => {
                setDateRange({
                  start: parseDate('2023-01-01'),
                  end: parseDate(new Date().toISOString().split('T')[0]),
                });
                setSelectedAlgorithm(new Set([]));
                setSelectedDevice(new Set([]));
                setSelectedCoin(new Set([]));
              }}
            >
              Сбросить
            </Button>
          </div>
        )}
      </div>

      <div className='relative overflow-x-auto rounded-lg bg-gray-900'>
        {isLoading && (
          <div className='absolute inset-0 z-50 flex items-center justify-center bg-gray-900/50'>
            <Spinner size='lg' color='secondary' />
          </div>
        )}

        <Table
          aria-label='Users table'
          sortDescriptor={sortDescriptor}
          onSortChange={setSortDescriptor}
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
          selectionMode='multiple'
          selectionBehavior='toggle'
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
          <TableHeader columns={headerColumns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                className='whitespace-nowrap bg-gray-800 px-4 py-2 text-sm text-white'
                allowsSorting={column.sortable}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={paginatedUsers}
            emptyContent={isLoading ? ' ' : 'Нет данных'}
            className='text-white'
          >
            {(user) => (
              <TableRow key={user.id}>
                {headerColumns.map((column) => (
                  <TableCell
                    key={column.uid}
                    className='whitespace-pre-wrap px-4 py-2 text-sm text-white'
                  >
                    {renderCell(user, column.uid)}
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
          onChange={(newPage) => {
            setPage(newPage);
            setSelectedKeys(new Set([]));
          }}
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

      <div className='flex flex-col justify-between space-y-4 text-gray-400 md:items-center'>
        <div className='flex w-full items-center justify-between'>
          <span className='text-sm'>
            Всего пользователей: {filteredUsers.length}
          </span>
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

      {/* Итоговые суммы выбранных пользователей */}
      {(selectedKeys === 'all' ||
        Array.from(selectedKeys as Set<string>).length > 0) && (
        <div className='mt-6 space-y-2 rounded-lg bg-gray-800 p-4'>
          <h3 className='text-lg font-semibold text-white'>
            Суммы выбранных пользователей (
            {selectedKeys === 'all'
              ? paginatedUsers.length
              : Array.from(selectedKeys as Set<string>).length}
            ):
          </h3>
          <div className='space-y-1'>
            {Object.entries(selectedTotals.balances).map(([ticker, amount]) => (
              <p key={ticker} className='text-white'>
                Общий баланс {ticker}: {amount.toFixed(8)}
              </p>
            ))}
            <p className='text-white'>
              Общий реферальный бонус: $
              {selectedTotals.totalRefBonus.toFixed(2)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
