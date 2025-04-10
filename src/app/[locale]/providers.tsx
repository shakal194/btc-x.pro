'use client';

import { HeroUIProvider } from '@heroui/react';
import { ReactNode } from 'react';

export function NextUIProviders({ children }: { children: ReactNode }) {
  return <HeroUIProvider className='dark'>{children}</HeroUIProvider>;
}
