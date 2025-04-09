'use server';

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

// Получение токена доступа
export const getAccessToken = async (): Promise<{
  access: string;
  refresh: string;
  access_expired_at: string;
  refresh_expired_at: string;
}> => {
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
      throw new Error(`Failed to obtain access token: ${errorData}`);
    }

    const data: CoinsbuyAuthResponse = await response.json();

    // Проверяем подпись, если она есть в ответе
    if (data.meta?.sign) {
      const isValid = await verifySignature(
        COINSBUY_API_KEY,
        COINSBUY_API_SECRET,
        data.meta.time,
        data.data.attributes.refresh,
        data.meta.sign,
      );

      if (!isValid) {
        console.error('Signature verification failed');
        throw new Error('Invalid response signature');
      }
    }

    return {
      access: data.data.attributes.access,
      refresh: data.data.attributes.refresh,
      access_expired_at: data.data.attributes.access_expired_at,
      refresh_expired_at: data.data.attributes.refresh_expired_at,
    };
  } catch (error) {
    console.error('Error getting access token:', error);
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

// Создание вывода средств
export const createPayout = async (
  token: { access: string },
  walletId: string,
  amount: string,
  address: string,
  label?: string,
  tracking_id?: string,
) => {
  try {
    const endpoint = '/wallet/payout/';
    const body = JSON.stringify({
      data: {
        type: 'payout',
        attributes: {
          amount,
          address,
          label: label || 'Payout from web interface',
          tracking_id: tracking_id || generateRandomId(),
        },
        relationships: {
          wallet: {
            data: {
              type: 'wallet',
              id: walletId,
            },
          },
        },
      },
    });

    const signature = await generateSignature(
      'POST',
      endpoint,
      token.access,
      body,
    );

    const response = await fetch(`${COINSBUY_API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.api+json',
        Authorization: `Bearer ${token.access}`,
        'X-Signature': signature,
      },
      body,
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Payout creation error:', errorData);
      throw new Error(`Failed to create payout: ${errorData}`);
    }

    return await response.json();
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
    console.log('Deposits response:', data); // Добавляем лог для отладки
    return data;
  } catch (error) {
    console.error('Error getting deposits:', error);
    throw error;
  }
};

// Получение списка трансферов
export const getTransfers = async (token: { access: string }) => {
  try {
    const endpoint = '/transfer/?page[size]=100';
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
    console.log('Transfers response:', data);
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

export const handleBuyShares = async (
  equipmentUuid: string,
  shareCount: number,
) => {
  const token = await getAccessToken();
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/equipments/${equipmentUuid}/buy`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ shareCount }),
    },
  );

  if (!response.ok) {
    throw new Error('Failed to buy shares');
  }

  return response.json();
};
