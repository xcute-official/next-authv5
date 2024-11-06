"use client";
import {
  Card,
  CardContent,
  CardHeader
} from '@/components/ui/card';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { useState, useTransition } from 'react';
import { settings } from '@/actions/settings';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormDescription,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SettingsSchema } from '@/schemas';
import { useCurrentUser } from '@/hooks/use-current-user';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { UserRole } from '@prisma/client';
import { Switch } from '@/components/ui/switch';

const page = () => {
  const user = useCurrentUser();
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();
  const {update} = useSession();
  const onSubmit = (values: z.infer<typeof SettingsSchema>)=>{
    startTransition(()=>{
      settings(values).then((data)=>{
        if(data.error){
          setError(data.error)
        }
        if(data.success){
          update();
          setSuccess(data.success);
        }
      }).catch(()=>setError("Something went wrong"))
    })
  }
  const form = useForm<z.infer<typeof SettingsSchema>>({
    defaultValues: {
      name: user?.name || undefined,
      email: user?.email || undefined,
      password: undefined,
      role: user?.role || undefined,
      newPassword: undefined,
      isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined
    },
    resolver: zodResolver(SettingsSchema)
  })
  return (
    <Card className='w-[600px]'>
      <CardHeader>
        <p className="text-2xl font-semibold text-center">Settings</p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className='space-y-4'>
              <FormField
                control={form.control}
                name="name"
                render={({field})=>(
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input disabled={isPending} {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
              />
              {user?.isOAuth === false && (
                <>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({field})=>(
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                              <Input disabled={isPending} placeholder='john.doe@example.com' {...field} type="email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({field})=>(
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input disabled={isPending} {...field} type="password" placeholder='********'/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({field})=>(
                        <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                                <Input disabled={isPending} {...field} type="password" placeholder='********'/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                  />
                </>
              )}
              
              <FormField
                control={form.control}
                name="role"
                render={({field})=>(
                    <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select
                          disabled={isPending}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={UserRole.ADMIN}>
                              Admin
                            </SelectItem>
                            <SelectItem value={UserRole.USER}>
                              User
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
              />
              {user?.isOAuth === false && (
                <FormField
                  control={form.control}
                  name="isTwoFactorEnabled"
                  render={({field})=>(
                    <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
                        <div className="space-y-0 5">
                          <FormLabel>Two factor authentication</FormLabel>
                          <FormDescription>
                            Enable two factor authentication for your account
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch disabled={isPending} checked={field.value} onCheckedChange={field.onChange}/>
                        </FormControl>
                    </FormItem>
                  )}
                />
              )}
            </div>
            <FormError message={error}/>
            <FormSuccess message={success}/>
            <Button disabled={isPending} type='submit'>save</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default page