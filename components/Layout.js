import Nav from '@/components/Nav';
import ExitIcon from '../public/assets/svgs/ExitIcon';
import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image';
import { redirect } from 'next/navigation'
import HamburgerIcon from '@/public/assets/svgs/HamburgerIcon';
import { useState } from 'react';

export default function Layout({ children }) {
  const [showNav, setShowNav] = useState(false)
  const toggleNav = () => {
    setShowNav(prevState => !prevState)
  }
  const Logout = async () => {
    await signOut()
    await redirect('/')
  }
  const { data: session } = useSession();
  //   const session = true;
  if (!session?.user?.email) {
    return (
      <div className="bg-gray-200 w-screen h-screen flex items-center justify-center">
        <div className="w-full flex items-center justify-center">
          <button className="bg-white p-2 px-4 rounded-lg" onClick={() => signIn('google')}>
            Login with google
          </button>
          <button className="bg-white p-2 px-4 rounded-lg flex mx-1" onClick={Logout}>
            <ExitIcon />
            <span className="mr-1" />
            Logout
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className=" w-screen min-h-screen flex ">

      <Nav showNav={showNav} />
      <div className=" w-full ">
        <div className="flex flex-col gap-2 md:flex-row justify-around items-center p-4 text-center bg-gray-400">
          <button onClick={toggleNav} className='md:hidden'>
            <HamburgerIcon />
          </button>
          <p className="text-gray-600 h-7">logged in as {session.user?.name}</p>
          <div className="flex bg-gray-200 rounded-3xl items-center">
            <Image className="rounded-full mr-2" src={session.user?.image} alt={session.user?.name} width='40' height='40' />
            <p className="mr-3 h-7 text-gray-600">{session.user?.email}</p>
          </div>
          <button
            className="bg-gray-300 h-10 pt-1 pb-2 px-4 rounded-lg text-gray-600 flex items-center"
            onClick={Logout}
          >
            <ExitIcon />
            <span className="mr-1" />
            Logout
          </button>
        </div>
        <div className="bg-white m-6">{children}</div>
      </div>
    </div>
  );
}
