'use client';

import { usePathname } from 'next/navigation';
import React from 'react';

type Props = {
  children: React.ReactNode;
};

export default function HomeOnly({ children }: Props) {
  const pathname = usePathname();
  if (pathname !== '/') return null;
  return <>{children}</>;
}

