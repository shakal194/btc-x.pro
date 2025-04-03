import { useState, useEffect } from 'react';
import { getAccessToken, getDeposits } from '@/lib/coinsbuy';
import { Spinner } from '@heroui/react';

interface Deposit {
  id: string;
  attributes: {
    payment_page: string;
    address: string;
    rate_expired_at: string;
    tracking_id: string;
    target_paid: string;
    status: number;
  };
  relationships: {
    currency: {
      data: {
        id: string;
      };
    };
    wallet: {
      data: {
        id: string;
      };
    };
  };
}

interface ApiResponse {
  data: Deposit[];
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
    case 2:
      return { text: 'Создан', color: 'text-yellow-400' };
    case 3:
      return { text: 'Оплачен', color: 'text-green-400' };
    case 4:
      return { text: 'Отменен', color: 'text-red-400' };
    case 5:
      return { text: 'Не разрешен', color: 'text-orange-400' };
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
    case '1019':
      return 'DOGE';
    default:
      return 'Unknown';
  }
};

export default function DepositsTable() {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDeposits = async () => {
    try {
      setIsLoading(true);
      const token = await getAccessToken();
      const response: ApiResponse = await getDeposits(token);

      setDeposits(response.data);
      setTotalRecords(response.meta?.total || response.meta?.page?.total || 0);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch deposits');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
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

  return (
    <div>
      <div className='mb-4 text-sm text-gray-400'>
        Всего записей: {totalRecords}
      </div>
      <div className='overflow-x-auto'>
        <table className='min-w-full divide-y divide-gray-700'>
          <thead>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400'>
                ID
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400'>
                Валюта
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400'>
                PAYMENT PAGE
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400'>
                Адрес
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400'>
                Tracking ID
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400'>
                Сумма
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
            {deposits.length === 0 ? (
              <tr>
                <td colSpan={7} className='px-6 py-4 text-center text-gray-400'>
                  Нет данных для отображения
                </td>
              </tr>
            ) : (
              deposits.map((deposit) => {
                const status = getStatusText(deposit.attributes.status);
                return (
                  <tr key={deposit.id} className='hover:bg-gray-700/50'>
                    <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-300'>
                      {deposit.id}
                    </td>
                    <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-300'>
                      {getCurrencyName(deposit.relationships.currency.data.id)}
                    </td>{' '}
                    <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-300'>
                      {deposit.attributes.payment_page}
                    </td>
                    <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-300'>
                      {deposit.attributes.address}
                    </td>
                    <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-300'>
                      {deposit.attributes.tracking_id}
                    </td>
                    <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-300'>
                      {deposit.attributes.target_paid}
                    </td>
                    <td className='whitespace-nowrap px-6 py-4 text-sm'>
                      <span className={status.color}>{status.text}</span>
                    </td>
                    <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-300'>
                      {new Date(
                        deposit.attributes.rate_expired_at,
                      ).toLocaleString()}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
