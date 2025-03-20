import { Card, Skeleton, CardBody } from '@heroui/react';

export function EquipmentSkeleton() {
  return (
    <Card
      className='border-b-1 border-secondary bg-transparent p-4 dark'
      radius='lg'
    >
      <CardBody>
        <div className='flex items-center'>
          <div className='mr-4 space-y-3'>
            <Skeleton className='bg-secondary/40 rounded-lg'>
              <div className='h-6 w-48 rounded-lg bg-inherit' />
            </Skeleton>
            <Skeleton className='bg-secondary/40 rounded-lg'>
              <div className='h-[300px] w-[300px] rounded-lg bg-inherit' />
            </Skeleton>
          </div>
          <div className='flex-1'>
            <div className='space-y-3'>
              <Skeleton className='bg-secondary/40 rounded-lg'>
                <div className='h-5 w-36 rounded-lg bg-inherit' />
              </Skeleton>
              <Skeleton className='bg-secondary/40 rounded-lg'>
                <div className='h-5 w-32 rounded-lg bg-inherit' />
              </Skeleton>
              <Skeleton className='bg-secondary/40 rounded-lg'>
                <div className='h-5 w-28 rounded-lg bg-inherit' />
              </Skeleton>
              <Skeleton className='bg-secondary/40 rounded-lg'>
                <div className='h-5 w-40 rounded-lg bg-inherit' />
              </Skeleton>
              <Skeleton className='bg-secondary/40 rounded-lg'>
                <div className='h-5 w-40 rounded-lg bg-inherit' />
              </Skeleton>
              <Skeleton className='bg-secondary/40 rounded-lg'>
                <div className='h-5 w-36 rounded-lg bg-inherit' />
              </Skeleton>
              <Skeleton className='bg-secondary/40 rounded-lg'>
                <div className='h-5 w-40 rounded-lg bg-inherit' />
              </Skeleton>
              <Skeleton className='bg-secondary/40 rounded-lg'>
                <div className='h-5 w-56 rounded-lg bg-inherit' />
              </Skeleton>
            </div>
            <div className='mt-4 flex gap-2'>
              <Skeleton className='bg-secondary/40 rounded-lg'>
                <div className='h-9 w-24 rounded-lg bg-inherit' />
              </Skeleton>
              <Skeleton className='bg-secondary/40 rounded-lg'>
                <div className='h-9 w-24 rounded-lg bg-inherit' />
              </Skeleton>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
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
            <Skeleton className='bg-secondary/40 rounded-lg'>
              <div className='h-6 w-48 rounded-lg bg-inherit' />
            </Skeleton>
            <Skeleton className='bg-secondary/40 rounded-lg'>
              <div className='h-[200px] w-[200px] rounded-lg bg-inherit' />
            </Skeleton>
          </div>
          <div className='flex-1'>
            <div className='space-y-3'>
              <Skeleton className='bg-secondary/40 rounded-lg'>
                <div className='h-5 w-36 rounded-lg bg-inherit' />
              </Skeleton>
              <Skeleton className='bg-secondary/40 rounded-lg'>
                <div className='h-5 w-40 rounded-lg bg-inherit' />
              </Skeleton>
              <Skeleton className='bg-secondary/40 rounded-lg'>
                <div className='h-5 w-44 rounded-lg bg-inherit' />
              </Skeleton>
              <Skeleton className='bg-secondary/40 rounded-lg'>
                <div className='h-5 w-48 rounded-lg bg-inherit' />
              </Skeleton>
              <Skeleton className='bg-secondary/40 rounded-lg'>
                <div className='h-5 w-52 rounded-lg bg-inherit' />
              </Skeleton>
              <Skeleton className='bg-secondary/40 rounded-lg'>
                <div className='h-5 w-40 rounded-lg bg-inherit' />
              </Skeleton>
            </div>
            <div className='mt-4 flex gap-2'>
              <Skeleton className='bg-secondary/40 rounded-lg'>
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
    <Card
      className='border-b-1 border-secondary bg-transparent p-4 dark'
      radius='lg'
    >
      <CardBody>
        <div className='flex items-center'>
          <div className='mr-4 space-y-3'>
            <Skeleton className='bg-secondary/40 rounded-lg'>
              <div className='h-6 w-48 rounded-lg bg-inherit' />
            </Skeleton>
            <Skeleton className='bg-secondary/40 rounded-lg'>
              <div className='h-[300px] w-[300px] rounded-lg bg-inherit' />
            </Skeleton>
          </div>
          <div className='flex-1'>
            <div className='space-y-3'>
              <Skeleton className='bg-secondary/40 rounded-lg'>
                <div className='h-5 w-36 rounded-lg bg-inherit' />
              </Skeleton>
              <Skeleton className='bg-secondary/40 rounded-lg'>
                <div className='h-5 w-32 rounded-lg bg-inherit' />
              </Skeleton>
              <Skeleton className='bg-secondary/40 rounded-lg'>
                <div className='h-5 w-40 rounded-lg bg-inherit' />
              </Skeleton>
              <Skeleton className='bg-secondary/40 rounded-lg'>
                <div className='h-5 w-44 rounded-lg bg-inherit' />
              </Skeleton>
              <Skeleton className='bg-secondary/40 rounded-lg'>
                <div className='h-5 w-44 rounded-lg bg-inherit' />
              </Skeleton>
              <Skeleton className='bg-secondary/40 rounded-lg'>
                <div className='h-5 w-36 rounded-lg bg-inherit' />
              </Skeleton>
              <Skeleton className='bg-secondary/40 rounded-lg'>
                <div className='h-5 w-40 rounded-lg bg-inherit' />
              </Skeleton>
            </div>
            <div className='mt-4 flex gap-2'>
              <Skeleton className='bg-secondary/40 rounded-lg'>
                <div className='h-9 w-32 rounded-lg bg-inherit' />
              </Skeleton>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
