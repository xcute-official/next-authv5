import { cn } from '@/lib/utils';
import React from 'react'
import { BACKGROUND } from '../constants';
import { Navbar } from './_components/navbar';

const layout = ({children}:{children: React.ReactNode;}) => {
  return (
    <div className={cn(
        'h-full w-full flex flex-col gap-y-10 items-center justify-center',
        BACKGROUND
    )}>
        <Navbar />
        {children}
    </div>
  )
}

export default layout