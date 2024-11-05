"use server";
import { RegisterSchema } from '@/schemas';
import * as z from 'zod';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { getUserByEmail } from '@/data/user';
import { generateVerificationToken } from '@/lib/tokens';
import { sendVerificationEmail } from '@/lib/mail';
export const register = async (values: z.infer<typeof RegisterSchema>)=>{
    const validatedFields = RegisterSchema.safeParse(values);
    if(!validatedFields.success){
        return {
            error: "Invalid fields!"
        }
    }
    const { email, password, name } = validatedFields.data;
    
    const existingUser = await getUserByEmail(email);
    
    if(existingUser){
        return {
            error: "Email already in use"
        }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.user.create({
        data: {
            name,
            email,
            password: hashedPassword
        }
    })

    const verificationToken = await generateVerificationToken(email);
    sendVerificationEmail(verificationToken.email, verificationToken.token);



    return {
        success: "verification email sent, check your email!"
    }
}