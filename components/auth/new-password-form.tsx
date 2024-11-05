"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { LoginSchema } from "@/schemas";
import Link from "next/link";
import * as z from 'zod';
import { CardWrapper } from "./card-wrapper";
import { Input } from "../ui/input";
import {
    Form,
    FormControl,
    FormMessage,
    FormField,
    FormItem,
    FormLabel
} from '@/components/ui/form';
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { useState, useTransition } from "react";
import { ResetSchema } from "@/schemas";
import { login } from "@/actions/login";
import { useSearchParams } from "next/navigation";
import { reset } from "@/actions/reset";
import { NewPasswordSchema } from "@/schemas";
import { newPassword } from "@/actions/new-password";

export const NewPasswordForm = ()=>{

    const[isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | undefined>('');
    const [success, setSuccess] = useState<string | undefined>('');

    const searchParams = useSearchParams();

    const token = searchParams.get("token");



    const form = useForm<z.infer<typeof NewPasswordSchema>>({
        resolver: zodResolver(NewPasswordSchema),
        defaultValues: {
            password: '',
        }
    });
    const onSubmit = (values: z.infer<typeof NewPasswordSchema>)=>{
        setError("");
        setSuccess("");
        startTransition(()=>{
            newPassword(values).then((data)=>{
                if(data?.error){
                    setError(data.error);
                }else if(data?.success){
                    setSuccess(data.success);
                }else{
                    setError("Unknown Error");
                }
            })
        })
    }
    return (
        <CardWrapper
            headerLabel="Enter a new password"
            backButtonHref="/auth/login"
            backButtonLabel="Back to login"
        >
            <Form {...form}>
                <form className="space-y-6" onSubmit={form.handleSubmit(()=>{})}>
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({field})=>(
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input disabled={isPending} {...field} placeholder="********" type="password" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                    </div>
                    <FormSuccess message={success} />
                    <FormError message={error} />
                    <Button type="submit" disabled={isPending} className="w-full">Reset password</Button>
                </form>
            </Form>
        </CardWrapper>
    )
}