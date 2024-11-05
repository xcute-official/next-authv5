"use server";

import { getPasswordResetTokenByEmail, getPasswordResetTokenByToken } from "@/data/password-reset-token";
import bcrypt from 'bcryptjs';
import { getUserByEmail } from "@/data/user";
import { NewPasswordSchema, ResetSchema } from "@/schemas";
import { validate } from "uuid";
import * as z from 'zod';
import { db } from "@/lib/db";
export const newPassword = async (values: z.infer<typeof NewPasswordSchema>, token?: string | null)=>{
    if(!token){
        return {error: "Missing token"};
    }
    const validatedFields = NewPasswordSchema.safeParse(values);
    if(!validatedFields.success){
        return {
            error: 'Invalid fields'
        }
    }
    const {password} = validatedFields.data;
    const existingToken = await getPasswordResetTokenByToken(token);
    if(!existingToken){
        return {
            error: "Invalid token!"
        }
    }
    const hasExpired = new Date(existingToken.expires)<new Date();
    if(hasExpired){
        return {
            error: 'Error, token has expired'
        }
    }
    const existingUser = await getUserByEmail(existingToken.email);
    if(!existingUser){
        return {
            error: "Email doesn't exists"
        }
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.user.update({
        where: {
            id: existingUser.id
        },
        data: {
            password: hashedPassword
        }
    });
    await db.passwordResetToken.delete({
        where: {
            id: existingToken.id
        }
    });
    return {
        success: "Password reset success"
    }

}