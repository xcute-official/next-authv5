import { cn } from '@/lib/utils';
import React from 'react'
import { BACKGROUND } from '../constants';

const layout = ({children}:{children: React.ReactNode;}) => {
  return (
    <div className={cn(
        'h-full flex items-center justify-center',
        BACKGROUND
    )}>
        {children}
    </div>
  )
}

export default layout