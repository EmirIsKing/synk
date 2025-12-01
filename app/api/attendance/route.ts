import { NextResponse } from 'next/server'
import connectDb from '@/lib/mongodb'
import RepModel from '@/database/rep.model'


export async function POST(req: Request) {
    try {
        await connectDb()
        const body = (await req.json())


        if (!body.indexNumber || !body.name ) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const ip = req.headers.get('x-forwarded-for') || 'unknown'
        const rep = await RepModel.findOne({ ipAddress: ip})

        if (!rep) {
            return NextResponse.json({ error: 'Invalid index number or password' }, { status: 401 });
        }

        if (rep.attendanceStatus === true) {
            return NextResponse.json({ attendanceRegisteration: 'success' }, { status: 200 });
        } else {
            return NextResponse.json({ error: 'Attendance is closed', attendanceRegisteration: 'closed' }, { status: 400 })
        }



    } catch (err) {
        console.error('Attendance error', err)
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }
}