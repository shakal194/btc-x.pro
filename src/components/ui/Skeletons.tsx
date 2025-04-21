import { Card, Skeleton, CardBody, Button } from '@heroui/react';

export function MiningRewardsSkeleton() {
  return (
    <div className='mb-4 grid grid-cols-1 gap-4 rounded-lg p-4 md:grid-cols-2 md:justify-between xl:grid-cols-4'>
      {/* Hashrate Card */}
      <div className='rounded-lg border-1 border-secondary bg-default-100 p-4 shadow-md shadow-secondary'>
        <Skeleton className='mb-2 rounded-lg bg-secondary/40'>
          <div className='h-6 w-full rounded-lg bg-inherit text-center'>
            Хешрейт
          </div>
        </Skeleton>
        <Skeleton className='rounded-lg bg-secondary/40'>
          <div className='h-8 w-full rounded-lg bg-inherit text-center' />
        </Skeleton>
      </div>

      {/* Total Mined Card */}
      <div className='rounded-lg border-1 border-secondary bg-default-200 p-4 shadow-md shadow-secondary'>
        <Skeleton className='mb-2 rounded-lg bg-secondary/40'>
          <div className='h-6 w-full rounded-lg bg-inherit text-center'>
            Намайнено всего
          </div>
        </Skeleton>
        <div className='space-y-2'>
          <Skeleton className='rounded-lg bg-secondary/40'>
            <div className='h-6 w-full rounded-lg bg-inherit' />
          </Skeleton>
          <Skeleton className='rounded-lg bg-secondary/40'>
            <div className='h-6 w-full rounded-lg bg-inherit' />
          </Skeleton>
        </div>
      </div>

      {/* 24h Profit Card */}
      <div className='rounded-lg border-1 border-secondary bg-transparent p-4 shadow-md shadow-secondary'>
        <Skeleton className='mb-2 rounded-lg bg-secondary/40'>
          <div className='h-6 w-full rounded-lg bg-inherit text-center'>
            Прибыль за 24ч.
          </div>
        </Skeleton>
        <div className='space-y-2'>
          <Skeleton className='rounded-lg bg-secondary/40'>
            <div className='h-6 w-full rounded-lg bg-inherit' />
          </Skeleton>
          <Skeleton className='rounded-lg bg-secondary/40'>
            <div className='h-6 w-full rounded-lg bg-inherit' />
          </Skeleton>
        </div>
      </div>

      {/* 24h Mined Card */}
      <div className='rounded-lg border-1 border-secondary bg-transparent p-4 shadow-sm shadow-secondary'>
        <Skeleton className='mb-2 rounded-lg bg-secondary/40'>
          <div className='h-6 w-full rounded-lg bg-inherit text-center'>
            Намайнено за 24ч.
          </div>
        </Skeleton>
        <div className='space-y-2'>
          <Skeleton className='rounded-lg bg-secondary/40'>
            <div className='h-6 w-full rounded-lg bg-inherit' />
          </Skeleton>
          <Skeleton className='rounded-lg bg-secondary/40'>
            <div className='h-6 w-full rounded-lg bg-inherit' />
          </Skeleton>
        </div>
      </div>
    </div>
  );
}
export function EquipmentSkeleton() {
  return (
    <div className='space-y-4'>
      {/* Equipment List */}
      <div className='border-b-1 border-secondary p-2'>
        <div className='flex flex-col items-center gap-4 md:flex-row'>
          <div className='mr-4 flex flex-col items-center'>
            <Skeleton className='mb-2 rounded-lg bg-secondary/40'>
              <div className='h-6 w-48 rounded-lg bg-inherit' />
            </Skeleton>
            <Skeleton className='rounded-lg bg-secondary/40'>
              <div className='h-[350px] w-[350px] rounded-lg bg-inherit' />
            </Skeleton>
          </div>
          <div>
            <div className='flex flex-col gap-2'>
              <Skeleton className='rounded-lg bg-secondary/40'>
                <div className='h-5 w-36 rounded-lg bg-inherit' />
              </Skeleton>
              <Skeleton className='rounded-lg bg-secondary/40'>
                <div className='h-5 w-32 rounded-lg bg-inherit' />
              </Skeleton>
              <Skeleton className='rounded-lg bg-secondary/40'>
                <div className='h-5 w-40 rounded-lg bg-inherit' />
              </Skeleton>
              <Skeleton className='rounded-lg bg-secondary/40'>
                <div className='h-5 w-44 rounded-lg bg-inherit' />
              </Skeleton>
              {/* Daily Income */}
              <Skeleton className='rounded-lg bg-secondary/40'>
                <div className='h-5 w-44 rounded-lg bg-inherit' />
              </Skeleton>
              <Skeleton className='rounded-lg bg-secondary/40'>
                <div className='h-5 w-36 rounded-lg bg-inherit' />
              </Skeleton>
              {/* Daily Profit */}
              <Skeleton className='rounded-lg bg-secondary/40'>
                <div className='h-5 w-40 rounded-lg bg-inherit' />
              </Skeleton>
              <Skeleton className='rounded-lg bg-secondary/40'>
                <div className='h-5 w-44 rounded-lg bg-inherit' />
              </Skeleton>
            </div>
            <div className='mt-4 flex justify-between gap-2'>
              <Skeleton className='rounded-lg bg-secondary/40'>
                <div className='h-9 w-32 rounded-lg bg-inherit' />
              </Skeleton>
              <Skeleton className='rounded-lg bg-secondary/40'>
                <div className='h-9 w-32 rounded-lg bg-inherit' />
              </Skeleton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AlgorithmSkeleton() {
  return (
    <Card
      className='border-b-1 border-secondary bg-transparent p-4 dark'
      radius='lg'
    >
      <CardBody>
        <div className='flex items-center'>
          <div className='mr-4 space-y-3'>
            <Skeleton className='rounded-lg bg-secondary/40'>
              <div className='h-6 w-48 rounded-lg bg-inherit' />
            </Skeleton>
            <Skeleton className='rounded-lg bg-secondary/40'>
              <div className='h-[200px] w-[200px] rounded-lg bg-inherit' />
            </Skeleton>
          </div>
          <div className='flex-1'>
            <div className='space-y-3'>
              <Skeleton className='rounded-lg bg-secondary/40'>
                <div className='h-5 w-36 rounded-lg bg-inherit' />
              </Skeleton>
              <Skeleton className='rounded-lg bg-secondary/40'>
                <div className='h-5 w-40 rounded-lg bg-inherit' />
              </Skeleton>
              <Skeleton className='rounded-lg bg-secondary/40'>
                <div className='h-5 w-44 rounded-lg bg-inherit' />
              </Skeleton>
              <Skeleton className='rounded-lg bg-secondary/40'>
                <div className='h-5 w-48 rounded-lg bg-inherit' />
              </Skeleton>
              <Skeleton className='rounded-lg bg-secondary/40'>
                <div className='h-5 w-52 rounded-lg bg-inherit' />
              </Skeleton>
              <Skeleton className='rounded-lg bg-secondary/40'>
                <div className='h-5 w-40 rounded-lg bg-inherit' />
              </Skeleton>
            </div>
            <div className='mt-4 flex gap-2'>
              <Skeleton className='rounded-lg bg-secondary/40'>
                <div className='h-9 w-32 rounded-lg bg-inherit' />
              </Skeleton>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export function StoreSkeleton() {
  return (
    <div className='border-b-1 border-secondary p-2 dark'>
      <div className='flex flex-col items-center gap-4 md:flex-row'>
        <div className='mr-4'>
          <Skeleton className='rounded-lg bg-secondary/40'>
            <div className='h-6 w-48 rounded-lg bg-inherit' />
          </Skeleton>
          <Skeleton className='mt-2 rounded-lg bg-secondary/40'>
            <div className='h-[350px] w-[350px] rounded-lg bg-inherit' />
          </Skeleton>
        </div>
        <div className='flex-1'>
          <div className='flex flex-col gap-2'>
            <Skeleton className='rounded-lg bg-secondary/40'>
              <div className='h-5 w-36 rounded-lg bg-inherit' />
            </Skeleton>
            <Skeleton className='rounded-lg bg-secondary/40'>
              <div className='h-5 w-32 rounded-lg bg-inherit' />
            </Skeleton>
            <Skeleton className='rounded-lg bg-secondary/40'>
              <div className='h-5 w-40 rounded-lg bg-inherit' />
            </Skeleton>
            <Skeleton className='rounded-lg bg-secondary/40'>
              <div className='h-5 w-44 rounded-lg bg-inherit' />
            </Skeleton>
            <Skeleton className='rounded-lg bg-secondary/40'>
              <div className='h-5 w-44 rounded-lg bg-inherit' />
            </Skeleton>
            <Skeleton className='rounded-lg bg-secondary/40'>
              <div className='h-5 w-36 rounded-lg bg-inherit' />
            </Skeleton>
            <Skeleton className='rounded-lg bg-secondary/40'>
              <div className='h-5 w-40 rounded-lg bg-inherit' />
            </Skeleton>
            <Skeleton className='rounded-lg bg-secondary/40'>
              <div className='h-5 w-44 rounded-lg bg-inherit' />
            </Skeleton>
            <Skeleton className='rounded-lg bg-secondary/40'>
              <div className='h-5 w-44 rounded-lg bg-inherit' />
            </Skeleton>
            <Skeleton className='rounded-lg bg-secondary/40'>
              <div className='h-5 w-44 rounded-lg bg-inherit' />
            </Skeleton>
          </div>
          <div className='mt-4 flex justify-between gap-2'>
            <Skeleton className='rounded-lg bg-secondary/40'>
              <div className='h-9 w-32 rounded-lg bg-inherit' />
            </Skeleton>
          </div>
        </div>
      </div>
    </div>
  );
}
