"use client"

import Link from 'next/link'
import Image from 'next/image'
import { useState,useEffect } from 'react';
import {signIn, signOut, useSession, getProviders} from 'react';
const Nav = () => {
    const isUserLogedIn=true;
  return (
    <nav className='flex-between w-full mb-16 pt-13'>
       <Link href='/' className='flex gap-2 flex-center'>
        <Image src='/assets/images/logo.svg' alt='Promptopia Logo' width={30} height={30}
        className='object-contain'/>
        <p className='logo_text'>Promptopia</p>
        <div className='sm:flex hidden'>
        {isUserLogedIn ? (
            <div className='flex gap-3 md:gap-5'>
                <Link href="/create-prompt"  className='black_btn'>Create Post</Link>
            </div>
        ) : (
            <>

            </>
        )}
        </div>
       </Link>
    </nav>
  )
}

export default Nav