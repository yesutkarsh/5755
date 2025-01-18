// app/api/nearby-restaurants/route.js
import { NextResponse } from 'next/server';
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server"
export async function GET(request) {

    const {getUser} = getKindeServerSession();
    const user = await getUser()
 
     return NextResponse.json(user);
}