import Nav from '@/components/Nav';
import ExitIcon from '../public/assets/svgs/ExitIcon';
import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image';
export default function Layout({ children }) {
  const { data: session } = useSession();
  //   const session = true;
  if (!session) {
    return (
      <div className="bg-blue-900 w-screen h-screen flex items-center justify-center">
        <div className="w-full flex items-center justify-center">
          <button className="bg-white p-2 px-4 rounded-lg" onClick={() => signIn('google')}>
            Login with google
          </button>
          <button className="bg-white p-2 px-4 rounded-lg flex mx-1" onClick={() => signOut()}>
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
      <Nav />
      <div className=" w-full ">
        <div className="flex justify-around items-center p-4 text-center bg-blue-500">
          {/* <p className="text-white h-7">logged in as {session.user.name}</p>
                    <div className="flex bg-white rounded-3xl items-center">
                        <Image className="rounded-full mr-2" src={session.user?.image} alt={session.user?.name} width='40' height='40' />
                        <p className="mr-3 h-7 text-blue-600">{session.user.email}</p>
                    </div> */}
          <button
            className="bg-blue-900 h-10 pt-1 pb-2 px-4 rounded-lg text-white flex items-center"
            onClick={() => signOut('google')}
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
