import { auth } from "@/lib/firebase";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    try {
        const token = req.headers.get('authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json({
                error: 'Unauthorized'
            }, { status: 401 });
        }

        const user = await auth.verifyIdToken(token);
        const groups = await 
    } catch (error) {
        
    }
}