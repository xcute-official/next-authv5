"use client";
import { FcGoogle } from "react-icons/fc";
import { Button } from "../ui/button";
import { FaGithub } from "react-icons/fa";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { useSearchParams } from "next/navigation";




export const Social = ()=>{

    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl');


    const onClick = (provider: "google" | "github")=>{
        signIn(provider, {
            callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT
        })
    }

    return (
        <div className="flex items-center w-full gap-x-2">
            <Button
                className="w-full"
                variant={"outline"}
                onClick={()=>onClick("google")}
                size="lg"
            >
                <FcGoogle className="h-5 w-5"/>
            </Button>
            <Button
                className="w-full"
                variant={"outline"}
                onClick={()=>onClick("github")}
                size="lg"
            >
                <FaGithub className="h-5 w-5"/>
            </Button>
        </div>
    )
}