"use client";
import { UserInfo } from '@/components/user-info';
import { useCurrentUser } from '@/hooks/use-current-user';
import React from 'react'

const page = () => {
    const user = useCurrentUser();
  return (
    <UserInfo label='Client component' user={user} />
  )
}

export default page