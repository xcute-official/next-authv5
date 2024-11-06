import { cn } from '@/lib/utils'
import React from 'react'
import { BACKGROUND } from './constants'
import { Button } from '@/components/ui/button';
import { Poppins } from 'next/font/google';
import { LoginButton } from '@/components/auth/login-button';
const font = Poppins({
    subsets: ["latin"],
    weight: ["600"]
})

const page = () => {
  return (
    <main className={cn(
        'flex h-full flex-col items-center justify-center',
        BACKGROUND
    )}>
        <div className="space-y-6 text-center">
            <h1 className={cn(
                "text-6xl font-semibold text-white drop-shadow-md",
                font.className
            )}>
                Auth
            </h1>
            i
            <p className='text-white text-lg'>A simple authentication service</p>
            <div>
                {/* pass as Child if you pass mode === model else you will hydration error */}
                <LoginButton asChild>
                    <Button variant="secondary" size={"lg"}>
                        SignIn
                    </Button>
                </LoginButton>
            </div>
        </div>
    </main>
  )
}

export default page