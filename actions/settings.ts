"use server";

import { getUserByEmail, getUserById } from "@/data/user";
import bcrypt from 'bcryptjs';
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { SettingsSchema } from "@/schemas";
import { z } from "zod";
import { unstable_update } from "@/auth";

export const settings = async (values: z.infer<typeof SettingsSchema>)=>{
    const user = await currentUser();
    if(!user?.id){
        return {
            error: "Unauthorized"
        }
    }
    const dbUser = await getUserById(user.id);
    if(!dbUser){
        return {
            error: "Unauthorized"
        }
    }


    if(user.isOAuth){
        values.email = undefined;
        values.password = undefined;
        values.newPassword = undefined;
        values.isTwoFactorEnabled = undefined;
    }

    if(values.email && values.email !== user.email) {
        const existingUser = await getUserByEmail(values.email);
        if(existingUser && existingUser.id !== user.id){
            return {
                error: "Email already in use"
            }
        }
        const verificationToken = await generateVerificationToken(values.email);
        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token
        );
        return {
            success: "Email updating verification email send"
        }
    }


    if(values.password && values.newPassword && dbUser.password){
        const passwordMatch = await bcrypt.compare(
            values.password,
            dbUser.password
        );
        if(!passwordMatch){
            return {
                error: "Incorrect password!"
            }
        }
        const hashedPassword = await bcrypt.hash(
            values.newPassword,
            10
        );
        values.password = hashedPassword;
        values.newPassword = undefined;
    }



    const updatedUser = await db.user.update({
        where: {
            id: dbUser.id
        },
        data: {
            ...values
        }
    });

    // another way of updating the user sessions and tokens in real time but not a good solution because it doesn't update on client side
    // unstable_update({
    //     user: {
    //         name: updatedUser.name,
    //         email: updatedUser.email
    //     }
    // })
    return {
        success: "Updated"
    }
}