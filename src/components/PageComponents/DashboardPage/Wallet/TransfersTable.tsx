import { useState, useEffect } from 'react';
import { getAccessToken, getTransfers } from '@/lib/coinsbuy';
import { Spinner } from '@heroui/react';

interface Transfer {
  id: string;
  attributes: {
    op_id: number;
    op_type: number;
    amount: string;
    commission: string;
    fee: string;
    txid: string;
    status: number;
    created_at: string;
  };
  relationships: {
    wallet: {
      data: {
        id: string;
      };
    };
    currency: {
      data: {
        id: string;
      };
    };
  };
}

interface GroupedTransfers {
  [key: string]: {
    deposits: Transfer[];
    fees: Transfer[];
  };
}

interface ApiResponse {
  data: Transfer[];
  meta?: {
    total?: number;
    page?: {
      number: number;
      size: number;
      total: number;
    };
  };
}

const getStatusText = (status: number) => {
  switch (status) {
    case -3:
      return { text: 'Отменен', color: 'text-red-400' };
    case -2:
      return { text: 'Заблокирован', color: 'text-red-400' };
    case -1:
      return { text: 'Неудача', color: 'text-red-400' };
    case 0:
      return { text: 'Создан', color: 'text-yellow-400' };
    case 1:
      return { text: 'Не подтвержден', color: 'text-yellow-400' };
    case 2:
      return { text: 'Подтвержден', color: 'text-green-400' };
    default:
      return { text: 'Неизвестно', color: 'text-gray-400' };
  }
};

const getCurrencyName = (id: string) => {
  switch (id) {
    case '1000':
      return 'BTC';
    case '2145':
      return 'USDT';
    case '1026':
      return 'TRX';
    case '1003':
      return 'LTC';
    default:
      return 'Unknown';
  }
};

const getOperationTypeText = (type: number) => {
  switch (type) {
    case 1:
      return 'Пополнение';
    case 2:
      return 'Вывод';
    case 9:
      return 'Комиссия';
    default:
      return 'Неизвестно';
  }
};

export default function TransfersTable() {
  const [withdrawals, setWithdrawals] = useState<Transfer[]>([]);
  const [groupedDeposits, setGroupedDeposits] = useState<GroupedTransfers>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const groupTransfers = (transfers: Transfer[]) => {
    const grouped: GroupedTransfers = {};
    const withdrawalsList: Transfer[] = [];

    transfers.forEach((transfer) => {
      if (transfer.attributes.op_type === 2) {
        withdrawalsList.push(transfer);
      } else if (
        transfer.attributes.op_type === 1 ||
        transfer.attributes.op_type === 9
      ) {
        const opId = transfer.attributes.op_id.toString();
        if (!grouped[opId]) {
          grouped[opId] = {
            deposits: [],
            fees: [],
          };
        }
        if (transfer.attributes.op_type === 1) {
          grouped[opId].deposits.push(transfer);
        } else {
          grouped[opId].fees.push(transfer);
        }
      }
    });

    return { grouped, withdrawals: withdrawalsList };
  };

  const fetchTransfers = async () => {
    try {
      setIsLoading(true);
      const token = await getAccessToken();
      const response: ApiResponse = await getTransfers(token);
      const { grouped, withdrawals } = groupTransfers(response.data);
      setGroupedDeposits(grouped);
      setWithdrawals(withdrawals);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch transfers',
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransfers();
  }, []);

  if (isLoading) {
    return (
      <div className='flex justify-center p-4'>
        <Spinner size='lg' />
      </div>
    );
  }

  if (error) {
    return (
      <div className='rounded-lg bg-red-900/20 p-4 text-red-500'>
        Error: {error}
      </div>
    );
  }

  const renderTransactionRow = (transfer: Transfer) => {
    const status = getStatusText(transfer.attributes.status);
    const currency = getCurrencyName(transfer.relationships.currency.data.id);
    return (
      <tr key={transfer.id} className='hover:bg-gray-700/50'>
        <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-300'>
          {transfer.id}
        </td>
        <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-300'>
          {transfer.relationships.wallet.data.id} /{' '}
          <span className='text-success'>{currency}</span>
        </td>
        <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-300'>
          {getOperationTypeText(transfer.attributes.op_type)}
        </td>
        <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-300'>
          {transfer.attributes.txid}
        </td>
        <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-300'>
          {transfer.attributes.amount} {currency}
        </td>
        <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-300'>
          {transfer.attributes.commission} {currency}
        </td>
        <td className='whitespace-nowrap px-6 py-4 text-sm'>
          <span className={status.color}>{status.text}</span>
        </td>
        <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-300'>
          {new Date(transfer.attributes.created_at).toLocaleString()}
        </td>
      </tr>
    );
  };

  return (
    <div className='space-y-8'>
      {/* Deposits Section */}
      <div>
        <h2 className='mb-4 text-xl font-bold text-white'>Пополнения</h2>
        <div className='overflow-x-auto'>
          {Object.entries(groupedDeposits).map(([opId, { deposits, fees }]) => (
            <div key={opId} className='mb-8'>
              <div className='mb-2 text-lg font-semibold text-white'>
                ID Депозита: {opId}
              </div>
              <table className='min-w-full divide-y divide-gray-700'>
                <thead>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400'>
                      ID
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400'>
                      Кошелек / Валюта
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400'>
                      Тип операции
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400'>
                      TXID
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400'>
                      Сумма
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400'>
                      Комиссия
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400'>
                      Статус
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400'>
                      Дата создания
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-700'>
                  {[...deposits, ...fees].map(renderTransactionRow)}
                  <tr className='bg-gray-800'>
                    <td
                      colSpan={4}
                      className='px-6 py-4 text-sm font-semibold text-gray-300'
                    >
                      Всего транзакций:
                    </td>
                    <td colSpan={4} className='px-6 py-4 text-sm text-gray-300'>
                      {deposits.length + fees.length} (Пополнений:{' '}
                      {deposits.length}, Комиссий: {fees.length})
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>

      {/* Withdrawals Section */}
      <div>
        <h2 className='mb-4 text-xl font-bold text-white'>Выводы</h2>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-700'>
            <thead>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400'>
                  ID
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400'>
                  Кошелек / Валюта
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400'>
                  Тип операции
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400'>
                  TXID
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400'>
                  Сумма
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400'>
                  Комиссия
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400'>
                  Статус
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400'>
                  Дата создания
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-700'>
              {withdrawals.map(renderTransactionRow)}
              {withdrawals.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className='px-6 py-4 text-center text-gray-400'
                  >
                    Нет выводов для отображения
                  </td>
                </tr>
              )}
              {withdrawals.length > 0 && (
                <tr className='bg-gray-800'>
                  <td
                    colSpan={4}
                    className='px-6 py-4 text-sm font-semibold text-gray-300'
                  >
                    Всего выводов:
                  </td>
                  <td colSpan={4} className='px-6 py-4 text-sm text-gray-300'>
                    {withdrawals.length}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
