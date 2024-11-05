import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string)=>{
    const confirmLink = `${process.env.NEXT_BASE_URL}auth/new-verification?token=${token}`;
    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Confim your email",
        html: `
            <p>Click <a href="${confirmLink}">here</a>to confirm your email</p>
        `
    })
}



export const sendPasswordResetEmail = async (email: string, token: string)=>{
    const resetLink = `${process.env.NEXT_BASE_URL}auth/new-password?token=${token}`;
    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Reset your password",
        html: `
            <p>Click <a href="${resetLink}">here</a>to reset your password</p>
        `
    })
}