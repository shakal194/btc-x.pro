'use server';

import db from '@/db/db';
import { electricityPriceTable } from '@/db/schema';
import { eq, desc, sql } from 'drizzle-orm';
import { formatDate } from './utils';

// Константы для API
const COINSBUY_API_BASE_URL = process.env.COINSBUY_API_URL!;
const COINSBUY_API_KEY = process.env.COINSBUY_API_KEY!;
const COINSBUY_API_SECRET = process.env.COINSBUY_API_SECRET!;

interface Token {
  access: string;
}

// Интерфейсы для типизации ответов API
interface CoinsbuyAuthResponse {
  data: {
    type: string;
    id: string;
    attributes: {
      refresh: string;
      access: string;
      access_expired_at: string;
      refresh_expired_at: string;
      is_2fa_confirmed: boolean;
    };
  };
  meta?: {
    time: string;
    sign: string;
  };
}

// Вспомогательная функция для конвертации ArrayBuffer в hex строку
function arrayBufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Функция для хеширования строки с помощью SHA-256
async function sha256(message: string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  return await crypto.subtle.digest('SHA-256', data);
}

// Функция для создания HMAC подписи
async function hmacSha256(message: string, key: ArrayBuffer): Promise<string> {
  const encoder = new TextEncoder();
  const messageData = encoder.encode(message);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
  return arrayBufferToHex(signature);
}

// Функция для верификации подписи
export const verifySignature = async (
  login: string,
  password: string,
  time: string,
  refresh: string,
  receivedSign: string,
): Promise<boolean> => {
  try {
    const message = time + refresh;

    // Создаем секрет как SHA256(login + password)
    const secret = await sha256(login + password);

    // Используем этот секрет как ключ для HMAC-SHA256
    const calculatedSign = await hmacSha256(message, secret);

    return calculatedSign === receivedSign;
  } catch (error) {
    console.error('Error verifying signature:', error);
    return false;
  }
};

// Генерация HMAC подписи для запросов
export const generateSignature = async (
  method: string,
  endpoint: string,
  token: string,
  body: string = '',
): Promise<string> => {
  const message = method + endpoint + token + body;
  const secretBuffer = await sha256(COINSBUY_API_SECRET);
  return await hmacSha256(message, secretBuffer);
};

// Генерация случайного ID
function generateRandomId(): string {
  const array = new Uint8Array(8);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Получение токена доступа
export const getAccessToken = async (): Promise<{
  access: string;
  refresh: string;
  access_expired_at: string;
  refresh_expired_at: string;
}> => {
  try {
    // Получаем последнюю запись, содержащую токены
    const [lastTokenRecord] = await db
      .select({
        id: electricityPriceTable.id,
        access_token: electricityPriceTable.access_token,
        refresh_token: electricityPriceTable.refresh_token,
        access_expired_at: electricityPriceTable.access_expired_at,
        refresh_expired_at: electricityPriceTable.refresh_expired_at,
        pricePerKWh: electricityPriceTable.pricePerKWh,
      })
      .from(electricityPriceTable)
      .where(
        sql`${electricityPriceTable.access_token} IS NOT NULL 
            AND ${electricityPriceTable.refresh_token} IS NOT NULL 
            AND ${electricityPriceTable.access_expired_at} IS NOT NULL 
            AND ${electricityPriceTable.refresh_expired_at} IS NOT NULL`,
      )
      .orderBy(desc(electricityPriceTable.access_expired_at))
      .limit(1);

    const now = new Date();

    // Проверяем наличие токенов и их валидность
    if (lastTokenRecord) {
      const accessExpired = new Date(lastTokenRecord.access_expired_at!) <= now;
      const refreshExpired =
        new Date(lastTokenRecord.refresh_expired_at!) <= now;

      // Если refresh токен валиден, но access истек - обновляем access
      if (!refreshExpired && accessExpired) {
        try {
          const response = await fetch(
            `${COINSBUY_API_BASE_URL}/token/refresh/`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/vnd.api+json',
              },
              body: JSON.stringify({
                data: {
                  type: 'auth-token',
                  attributes: {
                    refresh: lastTokenRecord.refresh_token!,
                  },
                },
              }),
            },
          );

          if (!response.ok) {
            // Если refresh токен не работает, удаляем старые токены из БД
            await db
              .update(electricityPriceTable)
              .set({
                access_token: null,
                refresh_token: null,
                access_expired_at: null,
                refresh_expired_at: null,
              })
              .where(eq(electricityPriceTable.id, lastTokenRecord.id));

            throw new Error(
              `[${formatDate(new Date())}] Failed to refresh token`,
            );
          }

          const data = await response.json();

          // Создаем новую запись только с обновленными токенами
          await db.insert(electricityPriceTable).values({
            access_token: data.data.attributes.access,
            refresh_token: data.data.attributes.refresh,
            access_expired_at: new Date(data.data.attributes.access_expired_at),
            refresh_expired_at: new Date(
              data.data.attributes.refresh_expired_at,
            ),
          });

          return {
            access: data.data.attributes.access,
            refresh: data.data.attributes.refresh,
            access_expired_at: data.data.attributes.access_expired_at,
            refresh_expired_at: data.data.attributes.refresh_expired_at,
          };
        } catch (error) {
          console.error('Error refreshing token:', error);
          // Если не удалось обновить токен, получаем новый
        }
      }

      // Если токены еще валидны - возвращаем их
      if (!accessExpired && !refreshExpired) {
        return {
          access: lastTokenRecord.access_token!,
          refresh: lastTokenRecord.refresh_token!,
          access_expired_at: lastTokenRecord.access_expired_at!.toISOString(),
          refresh_expired_at: lastTokenRecord.refresh_expired_at!.toISOString(),
        };
      }
    }

    // Если токенов нет или они истекли - получаем новые
    let retryCount = 0;
    const maxRetries = 3;
    const baseDelay = 1000;

    while (retryCount < maxRetries) {
      try {
        const response = await fetch(`${COINSBUY_API_BASE_URL}/token/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/vnd.api+json',
          },
          body: JSON.stringify({
            data: {
              type: 'auth-token',
              attributes: {
                login: COINSBUY_API_KEY,
                password: COINSBUY_API_SECRET,
              },
            },
          }),
        });

        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After');
          const waitTime = retryAfter
            ? parseInt(retryAfter, 10) * 1000
            : Math.min(baseDelay * Math.pow(2, retryCount), 45000);
          console.log(
            `Rate limited. Waiting ${waitTime / 1000} seconds before retry...`,
          );
          await sleep(waitTime);
          retryCount++;
          continue;
        }

        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`Failed to obtain access token: ${errorData}`);
        }

        const data: CoinsbuyAuthResponse = await response.json();

        // Проверяем подпись
        if (data.meta?.sign) {
          const isValid = await verifySignature(
            COINSBUY_API_KEY,
            COINSBUY_API_SECRET,
            data.meta.time,
            data.data.attributes.refresh,
            data.meta.sign,
          );

          if (!isValid) {
            throw new Error('Invalid response signature');
          }
        }

        // Сохраняем новые токены в БД
        if (lastTokenRecord) {
          await db
            .update(electricityPriceTable)
            .set({
              access_token: data.data.attributes.access,
              refresh_token: data.data.attributes.refresh,
              access_expired_at: new Date(
                data.data.attributes.access_expired_at,
              ),
              refresh_expired_at: new Date(
                data.data.attributes.refresh_expired_at,
              ),
            })
            .where(eq(electricityPriceTable.id, lastTokenRecord.id));
        } else {
          // Если записи нет, создаем новую
          await db.insert(electricityPriceTable).values({
            access_token: data.data.attributes.access,
            refresh_token: data.data.attributes.refresh,
            access_expired_at: new Date(data.data.attributes.access_expired_at),
            refresh_expired_at: new Date(
              data.data.attributes.refresh_expired_at,
            ),
          });
        }

        return {
          access: data.data.attributes.access,
          refresh: data.data.attributes.refresh,
          access_expired_at: data.data.attributes.access_expired_at,
          refresh_expired_at: data.data.attributes.refresh_expired_at,
        };
      } catch (error) {
        if (retryCount === maxRetries - 1) {
          console.error('Error getting access token after all retries:', error);
          throw error;
        }

        const waitTime = Math.min(baseDelay * Math.pow(2, retryCount), 45000);
        console.log(
          `Attempt ${retryCount + 1} failed. Waiting ${waitTime / 1000} seconds before retry...`,
        );
        await sleep(waitTime);
        retryCount++;
      }
    }

    throw new Error('Failed to obtain access token after all retries');
  } catch (error) {
    console.error('Error in getAccessToken:', error);
    throw error;
  }
};

// Интерфейс для параметров создания депозита
interface CreateDepositParams {
  label: string;
  tracking_id: string;
  confirmations_needed?: number;
  callback_url?: string;
  payment_page_redirect_url?: string;
  payment_page_button_text?: string;
  relationships: {
    wallet: {
      data: {
        type: string;
        id: string;
      };
    };
  };
}

// Создание депозита
export async function createDeposit(token: Token, params: CreateDepositParams) {
  try {
    const requestPayload = {
      data: {
        type: 'deposit',
        attributes: {
          label: params.label,
          tracking_id: params.tracking_id,
          confirmations_needed: params.confirmations_needed || 1,
          callback_url: params.callback_url,
          payment_page_redirect_url: params.payment_page_redirect_url,
          payment_page_button_text: params.payment_page_button_text,
        },
        relationships: params.relationships,
      },
    };

    console.log(
      'Creating deposit with payload:',
      JSON.stringify(requestPayload, null, 2),
    );

    const response = await fetch(`${COINSBUY_API_BASE_URL}/deposit/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.api+json',
        Authorization: `Bearer ${token.access}`,
        'X-Signature': await generateSignature(
          'POST',
          '/deposit/',
          token.access,
          JSON.stringify(requestPayload),
        ),
      },
      body: JSON.stringify(requestPayload),
    });

    if (!response.ok) {
      let errorMessage = 'Ошибка при создании депозита';

      try {
        const errorData = await response.json();
        // Логируем полную ошибку для отладки
        console.log('Full deposit creation error details:', {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          errorData: JSON.stringify(errorData, null, 2),
        });

        // Проверяем наличие специфической ошибки от API
        if (errorData?.errors?.[0]?.detail) {
          errorMessage = `Ошибка при создании депозита: ${errorData.errors[0].detail}`;
          console.log('API Error Detail:', errorData.errors[0].detail);
        }
      } catch {
        // Если не можем распарсить JSON, логируем текст ошибки
        const errorText = await response.text();
        console.log('Raw error response:', errorText);
      }

      throw new Error(errorMessage);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    // Логируем ошибку для отладки
    console.error('Error in createDeposit:', error);

    // Возвращаем пользователю общее сообщение об ошибке
    throw new Error(
      'Произошла ошибка при создании депозита. Пожалуйста, попробуйте позже.',
    );
  }
}

// Создание выплаты
export const createPayout = async (
  token: { access: string },
  params: {
    amount: string;
    feeInUSDT: string;
    feeInCoin: string;
    address: string;
    coinTicker: string;
    walletId: string;
    currencyId: string;
    userId: number;
    uuid: string;
  },
) => {
  try {
    const endpoint = '/payout/';
    const idempotencyKey = crypto.randomUUID();

    const requestBody = {
      data: {
        type: 'payout',
        attributes: {
          label: `Withdraw ${params.coinTicker} from ${params.userId}`,
          amount: params.amount,
          fee_amount: params.feeInCoin,
          address: params.address,
          tracking_id: params.uuid,
          travel_rule_info: {
            beneficiary: {
              beneficiaryPersons: [
                {
                  naturalPerson: {
                    name: [
                      {
                        nameIdentifier: [
                          {
                            primaryIdentifier: 'Default',
                            secondaryIdentifier: 'User',
                          },
                        ],
                      },
                    ],
                    geographicAddress: [
                      {
                        country: 'Default',
                        addressLine: ['Default Address'],
                        addressType: 'HOME',
                      },
                    ],
                  },
                },
              ],
            },
          },
        },
        relationships: {
          wallet: {
            data: {
              type: 'wallet',
              id: params.walletId,
            },
          },
          currency: {
            data: {
              type: 'currency',
              id: params.currencyId,
            },
          },
        },
      },
    };

    const response = await fetch(`${COINSBUY_API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.api+json',
        Authorization: `Bearer ${token.access}`,
        'idempotency-key': idempotencyKey,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(
        `[${formatDate(new Date())}] Create payout error:`,
        errorData,
      );
      throw new Error(`Failed to create payout: ${errorData}`);
    }

    const data = await response.text();
    console.log(`[${formatDate(new Date())}] Create payout response:`, data);

    return data;
  } catch (error) {
    console.error('Error creating payout:', error);
    throw error;
  }
};

// Получение статуса транзакции
export const getTransactionStatus = async (
  token: { access: string },
  transactionId: string,
) => {
  try {
    const endpoint = `/wallet/transaction/${transactionId}/`;
    const signature = await generateSignature('GET', endpoint, token.access);

    const response = await fetch(`${COINSBUY_API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/vnd.api+json',
        Authorization: `Bearer ${token.access}`,
        'X-Signature': signature,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Transaction status error:', errorData);
      throw new Error(`Failed to get transaction status: ${errorData}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting transaction status:', error);
    throw error;
  }
};

// Получение списка депозитов
export const getDeposits = async (token: { access: string }) => {
  try {
    const endpoint = '/deposit/?page[size]=100'; // Увеличиваем размер страницы до 100 записей
    const signature = await generateSignature('GET', endpoint, token.access);

    const response = await fetch(`${process.env.COINSBUY_API_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/vnd.api+json',
        Authorization: `Bearer ${token.access}`,
        'X-Signature': signature,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Get deposits error:', errorData);
      throw new Error(`Failed to get deposits: ${errorData}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting deposits:', error);
    throw error;
  }
};

// Получение списка трансферов
export const getTransfers = async (token: { access: string }) => {
  try {
    const endpoint = '/transfer/?page[size]=150';
    const signature = await generateSignature('GET', endpoint, token.access);

    const response = await fetch(`${process.env.COINSBUY_API_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/vnd.api+json',
        Authorization: `Bearer ${token.access}`,
        'X-Signature': signature,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Get transfers error:', errorData);
      throw new Error(`Failed to get transfers: ${errorData}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting transfers:', error);
    throw error;
  }
};

export async function getToken() {
  try {
    const response = await fetch(`${COINSBUY_API_BASE_URL}/token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.api+json',
      },
      body: JSON.stringify({
        data: {
          type: 'auth-token',
          attributes: {
            login: COINSBUY_API_KEY,
            password: COINSBUY_API_SECRET,
          },
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Token response error:', errorData);
      throw new Error(`Failed to get token: ${errorData}`);
    }

    const data = await response.json();
    return {
      access: data.data.attributes.access,
      refresh: data.data.attributes.refresh,
    };
  } catch (error) {
    console.error('Error getting token:', error);
    throw error;
  }
}

// Получение баланса кошелька
export const getWalletBalance = async (
  token: { access: string },
  walletId: string,
) => {
  try {
    const endpoint = `/wallet/${walletId}/`;
    const signature = await generateSignature('GET', endpoint, token.access);

    const response = await fetch(`${COINSBUY_API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/vnd.api+json',
        Authorization: `Bearer ${token.access}`,
        'X-Signature': signature,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Get wallet balance error:', errorData);
      throw new Error(`Failed to get wallet balance: ${errorData}`);
    }

    const data = await response.json();
    return data.data.attributes.balance_confirmed;
  } catch (error) {
    console.error('Error getting wallet balance:', error);
    throw error;
  }
};
