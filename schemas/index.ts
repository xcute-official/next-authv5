import * as z from 'zod';
export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string()
})
export const RegisterSchema = LoginSchema.extend({
    name: z.string()
})

export const ResetSchema = z.object({
    email: z.string().email({
        message: "Email is required"
    })
})


export const NewPasswordSchema = z.object({
    password: z.string()
})