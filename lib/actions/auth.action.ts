'use server';

import {db, auth} from "@/firebase/admin";
import {cookies} from "next/headers";

const ONE_WEEK = 60*60*24*7;

export async function signUp(params: SignUpParams)  {
    const { uid, name, email } = params;
    try {
        const userRecord = await db.collection('users').doc(uid).get();

        if (userRecord.exists) {
            return {
                success: false,
                message: `User already exists`,
            }
        }
        await db.collection('users').doc(uid).set({
            name, email
        })
        return {
            success: true,
            message: `Account creadted successfully. please sign in.`,
        }

    } catch (e: any) {
        console.error('Error creating a user', e);

        if(e.code === 'auth/email-already-exists') {
            return {
                success: false,
                message: 'User already exists',
            }
        }
        return {
            success: false,
            message: 'failed creating user',
        }
    }
}

export async function signIn(params: SignInParams)  {
    const { email, idToken } = params;

    try {
        const userRecord = await auth.getUserByEmail(email);

    }catch (e){
        console.log(e);

        return {
            success: false,
            message: 'Failed to login into an account',
        }

    }
    await setSessionCookie(idToken);

}

export async function setSessionCookie(idToken: string) {
    const cookieStore = await cookies();

    const sessioCookie = await auth.createSessionCookie(idToken, {
        expiresIn: ONE_WEEK * 1000,
    })
    cookieStore.set('session', sessioCookie, {
        maxAge: ONE_WEEK,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax'
    })
}

export async function getCurrentUser(): Promise<User | null>{
    const cookieStore = await cookies();

    const sessionCookie = cookieStore.get('session')?.value;

    if(!sessionCookie) return null;

    try{
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

        const userRecord = await db.
            collection('users')
            .doc(decodedClaims.uid)
            .get();

        if(!userRecord.exists) return null;

        return {
            ...userRecord.data(),
            id: userRecord.id,
        } as User;

    }catch (e){
        console.log(e);
        return null;
    }

}

export async function isAuthenticated() {
    const user = await getCurrentUser();
    return !!user;
}

export async function getInterviewsByUserId(userId: string): Promise<Interview[] | null> {
    const interviews = await db
        .collection('interviews')
        .where('userid', '==', 'userId')
        .orderBy('createdAt', 'desc')
        .get();

    return interviews.docs.map((doc)=>({
        id: doc.id,
        ...doc.data()

    }))as Interview[];
}

export async function getLatestInterviews(params : GetLatestInterviewsParams): Promise<Interview[] | null> {

    const { userId, limit = 20 } = params;

    const interviews = await db
        .collection('interviews')
        .orderBy('createdAt', 'desc')
        .where('finalized', '==', true )
        .where('userid', '==', 'userId')
        .limit(limit)
        .get();

    return interviews.docs.map((doc)=>({
        id: doc.id,
        ...doc.data()

    }))as Interview[];
}