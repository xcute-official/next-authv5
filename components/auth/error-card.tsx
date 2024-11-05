import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import { Card, CardHeader, CardFooter } from "../ui/card"
import { BackButton } from "./back-button"
import { CardWrapper } from "./card-wrapper"
import { Header } from "./header"

export const ErrorCard = ()=>{
    return (
        <CardWrapper 
            headerLabel="Oops! something went wrong"
            backButtonHref="/auth/login"
            backButtonLabel="Back to login"
        >
            <div className="w-full flex justify-center items-center">
                <ExclamationTriangleIcon className="text-destructive"/>
            </div>
        </CardWrapper>
    )
}