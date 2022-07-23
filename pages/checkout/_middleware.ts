import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { getToken } from 'next-auth/jwt';
import { jwt } from "../../utils";

export async function middleware( req: NextRequest, ev: NextFetchEvent ) {
  
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if ( !session )  {
    const requestedPage = req.page.name;
    
    const url = req.nextUrl.clone();
    url.pathname = '/auth/login';
    url.search = `?p=${requestedPage}`;
    
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
  
  // const { token = '' } = req.cookies;
  // // 401 estatus: no autorizado
  // // return new Response('Token: ' + token);
  // try {
  //   // await jwt.isValidToken( token );
  //   return NextResponse.next();
  // } catch (error) {
  //   return NextResponse.redirect(`/auth/login?p=${ req.page.name }`);
  // }
}