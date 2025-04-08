'use client';

import { useState } from 'react';
import { getAccessToken } from '@/lib/coinsbuy';
import { Snippet, Button } from '@heroui/react';
import DepositsTable from '@/components/PageComponents/DashboardPage/Wallet/DepositsTable';
import TransfersTable from '@/components/PageComponents/DashboardPage/Wallet/TransfersTable';

interface TokenInfo {
  token: {
    access: string;
    refresh: string;
    access_expired_at: string;
    refresh_expired_at: string;
  } | null;
  error: string | null;
  loading: boolean;
}

export default function CoinsBuyPage() {
  const [tokenInfo, setTokenInfo] = useState<TokenInfo>({
    token: null,
    error: null,
    loading: false,
  });

  const testConnection = async () => {
    setTokenInfo((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const tokenData = await getAccessToken();
      setTokenInfo({
        token: tokenData,
        error: null,
        loading: false,
      });
    } catch (error) {
      setTokenInfo({
        token: null,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
        loading: false,
      });
    }
  };

  return (
    <div className='container mx-auto space-y-6 p-4'>
      <h1 className='mb-6 text-2xl font-bold text-white'>
        CoinsBuy API Configuration
      </h1>

      <div className='rounded-lg bg-gray-800 p-6'>
        <h2 className='mb-4 text-xl font-semibold text-white'>
          API Connection Status
        </h2>
        <div className='mb-8 space-y-4 rounded-lg bg-gray-800 p-6'>
          <h2 className='text-xl font-semibold text-white'>API Settings</h2>
          <div className='space-y-2'>
            <h3 className='text-gray-300'>
              Environment:{' '}
              <span className='font-mono text-success'>Production</span>
            </h3>
            <h3 className='text-gray-300'>
              Base URL:{' '}
              <span className='font-mono text-success'>
                https://api.coinsbuy.com
              </span>
            </h3>
            <h3 className='text-gray-300'>
              API Key:{' '}
              <Snippet hideSymbol color='warning' className='bg-inherit'>
                {process.env.COINSBUY_API_KEY || 'Not configured'}
              </Snippet>
            </h3>
            <h3 className='text-gray-300'>
              API Secret:{' '}
              <Snippet hideSymbol color='warning' className='bg-inherit'>
                {'*'.repeat(20)}
              </Snippet>
            </h3>
            <h3 className='text-gray-300'>
              Wallet ID:{' '}
              <Snippet hideSymbol color='warning' className='bg-inherit'>
                1413
              </Snippet>
            </h3>
          </div>
        </div>

        <div className='mb-8 space-y-4'>
          <Button
            color='success'
            className='text-white'
            onPress={testConnection}
            isLoading={tokenInfo.loading}
          >
            Test API Connection
          </Button>

          {tokenInfo.loading && (
            <p className='text-gray-300'>Testing connection...</p>
          )}

          {tokenInfo.token && (
            <div className='space-y-4 rounded-lg bg-gray-800 p-6'>
              <h3 className='text-lg font-semibold text-success'>
                ✓ Connection Successful
              </h3>
              <div className='space-y-2'>
                <h3 className='text-gray-300'>
                  Access Token:{' '}
                  <Snippet hideSymbol color='success' className='bg-inherit'>
                    {tokenInfo.token.access}
                  </Snippet>
                </h3>
                <h3 className='text-gray-300'>
                  Refresh Token:{' '}
                  <Snippet hideSymbol color='success' className='bg-inherit'>
                    {tokenInfo.token.refresh}
                  </Snippet>
                </h3>
                <p className='text-gray-300'>
                  Access Token Expires:{' '}
                  <span className='text-warning'>
                    {new Date(
                      tokenInfo.token.access_expired_at,
                    ).toLocaleString()}
                  </span>
                </p>
                <p className='text-gray-300'>
                  Refresh Token Expires:{' '}
                  <span className='text-warning'>
                    {new Date(
                      tokenInfo.token.refresh_expired_at,
                    ).toLocaleString()}
                  </span>
                </p>
              </div>
            </div>
          )}

          {tokenInfo.error && (
            <div className='rounded-lg bg-red-900/20 p-6'>
              <h3 className='text-lg font-semibold text-red-500'>
                ✗ Connection Failed
              </h3>
              <p className='text-gray-300'>{tokenInfo.error}</p>
            </div>
          )}
        </div>
      </div>

      <div className='rounded-lg bg-gray-800 p-6'>
        <h2 className='mb-4 text-xl font-semibold text-white'>
          Deposit Information
        </h2>
        <div className='space-y-2 text-gray-300'>
          <p>• Wallet ID 1413 is configured for BTC deposits</p>
          <p>• Minimum confirmations required: 1</p>
          <p>• Deposit notifications will be sent to your callback URL</p>
          <p>• Users will be redirected back to the dashboard after payment</p>
        </div>
      </div>

      <div className='rounded-lg bg-gray-800 p-6'>
        <h2 className='mb-4 text-xl font-semibold text-white'>
          Deposits History
        </h2>
        <DepositsTable />
      </div>

      <div className='rounded-lg bg-gray-800 p-6'>
        <h2 className='mb-4 text-xl font-semibold text-white'>
          Transfers History
        </h2>
        <TransfersTable />
      </div>
    </div>
  );
}
