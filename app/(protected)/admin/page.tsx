"use client";
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { useCurrentRole } from '@/hooks/use-current-role';
import React from 'react'
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { RoleGate } from '@/components/auth/role-gate';
import { UserRole } from '@prisma/client';
import { FormSuccess } from '@/components/form-success';
import { admin } from '@/actions/admin';

const page = () => {
  const role = useCurrentRole();
  const onApiRouteClick = ()=>{
    fetch('/api/admin').then((response)=>{
      if(response.ok){
        toast.success('Allowed api route!');
      }else{
        toast.error('Forbidden API Route');
      }
    })
  }
  const onServerActionClick = ()=>{
    admin().then((response)=>{
      if(response.error){
        toast.error(response.error);
      }
      if(response.success){
        toast.success(response.success);
      }
    })
  }
  return (
    <Card className='w-[600px]'>
      <CardHeader>
        <p className="text-2xl font-semibold text-center">
          Admin
        </p>
      </CardHeader>
      <CardContent className='space-y-4'>
        <RoleGate allowedRole={UserRole.ADMIN}>
          <FormSuccess message='You are allowed to see this content'/>
        </RoleGate>
        <div className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-md'>
          <p className='text-sm font-medium'>Admin only api route</p>
          <Button onClick={onApiRouteClick}>Click to test</Button>
        </div>
        <div className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-md'>
          <p className='text-sm font-medium'>Admin only Server action</p>
          <Button onClick={onServerActionClick}>Click to test</Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default page