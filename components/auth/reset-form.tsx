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

export const ResetForm = ()=>{

    const[isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | undefined>('');
    const [success, setSuccess] = useState<string | undefined>('');

    const form = useForm<z.infer<typeof ResetSchema>>({
        resolver: zodResolver(ResetSchema),
        defaultValues: {
            email: '',
        }
    });
    const onSubmit = (values: z.infer<typeof ResetSchema>)=>{
        setError("");
        setSuccess("");
        startTransition(()=>{
            reset(values).then((data)=>{
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
            headerLabel="Forgot your password"
            backButtonHref="/auth/login"
            backButtonLabel="Back to login"
        >
            <Form {...form}>
                <form className="space-y-6" onSubmit={form.handleSubmit(()=>{})}>
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({field})=>(
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input disabled={isPending} {...field} placeholder="john.doe@example.com" type="email" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                    </div>
                    <FormSuccess message={success} />
                    <FormError message={error} />
                    <Button type="submit" disabled={isPending} className="w-full">Send reset email</Button>
                </form>
            </Form>
        </CardWrapper>
    )
}