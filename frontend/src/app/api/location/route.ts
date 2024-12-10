import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('query')

  const res = await fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&key=AIzaSyAqHdFUKdgoJ-TpoxDT209W1kDp84oEdRk&components=country:in`)
  const data = await res.json()

  return NextResponse.json(data, { status: 200 });
}