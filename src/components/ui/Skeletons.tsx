import { Card, Skeleton, CardBody, Button } from '@heroui/react';

export function EquipmentSkeleton() {
  return (
    <Card
      className='border-b-1 border-secondary bg-transparent p-4 dark'
      radius='lg'
    >
      <CardBody>
        <div className='flex flex-col items-center gap-4 md:flex-row'>
          <div className='mr-4 space-y-3'>
            <Skeleton className='bg-secondary/40 rounded-lg'>
              <div className='h-6 w-full rounded-lg bg-inherit md:w-48' />
            </Skeleton>
            <Skeleton className='bg-secondary/40 rounded-lg'>
              <div className='h-[350px] w-[350px] rounded-lg bg-inherit' />
            </Skeleton>
          </div>
          <div className='flex w-full flex-col gap-2'>
            <div className='space-y-3'>
              <Skeleton className='bg-secondary/40 rounded-lg'>
                <div className='h-5 w-full rounded-lg bg-inherit md:w-36' />
              </Skeleton>
              <Skeleton className='bg-secondary/40 rounded-lg'>
                <div className='h-5 w-full rounded-lg bg-inherit md:w-32' />
              </Skeleton>
              <Skeleton className='bg-secondary/40 rounded-lg'>
                <div className='h-5 w-full rounded-lg bg-inherit md:w-28' />
              </Skeleton>
              <Skeleton className='bg-secondary/40 rounded-lg'>
                <div className='h-5 w-full rounded-lg bg-inherit md:w-40' />
              </Skeleton>
              <Skeleton className='bg-secondary/40 rounded-lg'>
                <div className='h-5 w-full rounded-lg bg-inherit md:w-40' />
              </Skeleton>
              <Skeleton className='bg-secondary/40 rounded-lg'>
                <div className='h-5 w-full rounded-lg bg-inherit md:w-36' />
              </Skeleton>
              <Skeleton className='bg-secondary/40 rounded-lg'>
                <div className='h-5 w-full rounded-lg bg-inherit md:w-40' />
              </Skeleton>
              <Skeleton className='bg-secondary/40 rounded-lg'>
                <div className='h-5 w-full rounded-lg bg-inherit md:w-56' />
              </Skeleton>
            </div>
            <div className='mt-4 flex justify-between gap-2'>
              <Skeleton className='bg-secondary/40 rounded-lg'>
                <Button
                  size='md'
                  className='h-9 rounded-lg bg-inherit md:w-24'
                />
              </Skeleton>
              <Skeleton className='bg-secondary/40 rounded-lg'>
                <Button
                  size='md'
                  className='h-9 rounded-lg bg-inherit md:w-24'
                />
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
