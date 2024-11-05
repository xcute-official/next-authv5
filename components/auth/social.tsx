"use client";
import { FcGoogle } from "react-icons/fc";
import { Button } from "../ui/button";
import { FaGithub } from "react-icons/fa";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";



export const Social = ()=>{

    const onClick = (provider: "google" | "github")=>{
        signIn(provider, {
            callbackUrl: DEFAULT_LOGIN_REDIRECT
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