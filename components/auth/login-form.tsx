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
import { login } from "@/actions/login";
import { useSearchParams } from "next/navigation";


export const LoginForm = ()=>{

    
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl');
    const urlError = searchParams.get('error') === 'OAuthAccountNotLinked' ? "Email already in used with different provider" : "";

    const [showTwoFactor, setShowTwoFactor] = useState<boolean>(false);

    const[isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | undefined>('');
    const [success, setSuccess] = useState<string | undefined>('');

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: '',
            password: '',
            code: ''
        }
    });
    const onSubmit = (values: z.infer<typeof LoginSchema>)=>{
        setError("");
        setSuccess("");
        startTransition(()=>{
            login(values, callbackUrl).then((data)=>{
                if(data?.error){
                    form.reset();
                    setError(data.error);
                }else if(data?.success){
                    form.reset();
                    setSuccess(data.success);
                }else if(data?.twoFactor){
                    setShowTwoFactor(true);
                }else{
                    setError("Unknown Error");
                }
            }).catch(()=>{
                setError("Something went wrong");
            })
        })
    }
    return (
        <CardWrapper
            headerLabel="Welcome Back"
            backButtonHref="/auth/register"
            backButtonLabel="Don't have an account?"
            showSocial
        >
            <Form {...form}>
                <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        {showTwoFactor && (
                            <FormField
                                control={form.control}
                                name="code"
                                render={({field})=>(
                                    <FormItem>
                                        <FormLabel>Two factor Code</FormLabel>
                                        <FormControl>
                                            <Input disabled={isPending} {...field} placeholder="123456" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                        {!showTwoFactor && (
                            <>
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
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({field})=>(
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input disabled={isPending} {...field} placeholder="******" type="password" />
                                            </FormControl>
                                            <Button
                                                size="sm"
                                                variant={"link"}
                                                asChild
                                                className="px-0 font-normal"
                                            >
                                                <Link href="/auth/reset">
                                                    Forgot password
                                                </Link>
                                            </Button>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}
                    </div>
                    <FormSuccess message={success} />
                    <FormError message={error || urlError} />
                    <Button type="submit" disabled={isPending} className="w-full">{
                        showTwoFactor ? "Confirm" : "Login"
                    }</Button>
                </form>
            </Form>
        </CardWrapper>
    )
}