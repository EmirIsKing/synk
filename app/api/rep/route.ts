import { NextResponse } from 'next/server'
import connectDb from '@/lib/mongodb'
import RepModel from '@/database/rep.model'



export async function POST(req: Request) {
    try {
        await connectDb()
        const body = (await req.json())

        if (!body.indexNumber || !body.password) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown'


                      /// to Insert a new rep into database ///
        // const repTemp = {
        //     name: "Emir Stormzy",
        //     indexNumber: "123456789",
        //     password: "test",
        //     attendanceStatus: false,       /// to Insert a new rep into database
        //     ipAddress: ip,
        //     programme: "Software Engineering",
        //     group: "F"
        // }
        // const response =  await RepModel.create(repTemp)


        const rep = await RepModel.findOne({ indexNumber: body.indexNumber, password: body.password })

        if (!rep) {
            return NextResponse.json({ error: 'Invalid index number or password' }, { status: 401 });
        }

        const response = await RepModel.findOneAndUpdate(
            { indexNumber: body.indexNumber, password: body.password },
            { attendanceStatus: !rep.attendanceStatus, ipAddress: ip }, 
            { new: true }   
        )

        if (!response) {
            return NextResponse.json({ error: 'Invalid index number or password' }, { status: 401 });
        }

        if (response.attendanceStatus === !rep.attendanceStatus && response.ipAddress === ip) {
            return NextResponse.json({ status: "success", attendanceStatus: response.attendanceStatus }, { status: 200 });
        } else {
            return NextResponse.json({ status: 'failed' }, { status: 500 });
        }
        

    } catch (err) {
        console.error('Attendance error', err)
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }
}