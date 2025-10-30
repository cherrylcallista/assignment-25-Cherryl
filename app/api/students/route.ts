import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
        const response = await fetch(
            'https://course.summitglobal.id/students',
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {
        throw new Error('Failed to fetch data');
        }

        const data = await response.json();

        return NextResponse.json(data, { status: 200 });
  } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch users' },
            { status: 500 }
        );
  }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const response = await fetch('https://course.summitglobal.id/students', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        

        const data = await response.json();

        if (response.status !== 201) {
             console.error('External API Failed Response Status:', response.status);
             console.error('External API Failed Response Body:', data); // <--- THIS IS THE KEY LOG
        }

        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Failed to create user' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const id = searchParams.get('id') || '';
        const body = await request.json();

        const response = await fetch(
            `https://course.summitglobal.id/students?id=${id}`,
            {
                method: 'PUT',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            }
        );

        if (!response.ok) {
        throw new Error('Failed to fetch data');
        }

        const data = await response.json();

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
        { error: 'Failed to fetch users' },
        { status: 500 }
        );
    }
}