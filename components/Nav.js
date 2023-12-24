import DashboardIcon from "@/public/assets/svgs/DashboardIcon";
import ListIcon from "@/public/assets/svgs/ListIcon";
import ProductsIcon from "@/public/assets/svgs/ProductsIcon";
import SettingsIcons from "@/public/assets/svgs/SettingsIcon";
import QeueListIcon from "@/public/assets/svgs/QeueListIcon";
import ShopIcon from "@/public/assets/svgs/ShopIcon";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavigationItems = [
    { URL: '/', title: 'Dashboard', icon: DashboardIcon },
    { URL: '/products', title: 'Products', icon: ProductsIcon },
    { URL: '/categories', title: 'Categories', icon: ListIcon },
    { URL: '/orders', title: 'Orders', icon: QeueListIcon },
    { URL: '/settings', title: 'Settings', icon: SettingsIcons },
]
const GetIcon = (Icon) => {
    return <Icon />
}
export default function Nav({ showNav }) {
    const inactiveLink = 'flex gap-6 p-4'
    const activeLink = inactiveLink + ' bg-white text-primary'
    const pathname = usePathname()
    const CheckClassName = (item) => {
        if (item.URL === '/') {
            if (pathname === '/') {
                return activeLink
            }
            return inactiveLink
        } else if (pathname?.includes(item.URL)) {
            return activeLink
        } else {
            return inactiveLink
        }

    }
    return (
        <aside className={`text-gray-500 bg-gray-200 fixed w-full md:w-auto md:static h-[100vh]
          ${showNav ? '' : '-left-full'} transition-all`}
        >
            <Link href={'/'} className="flex gap-1 mb-12 w-full bg-gray-300  p-6">
                <ShopIcon />
                <span className="min-w-max">Next Shop Admin</span>
            </Link>
            <nav className="flex flex-col gap-4 ">
                {NavigationItems.map(item => {
                    return (
                        <Link
                            href={item.URL}
                            className={CheckClassName(item)}
                            key={item.title}>
                            {GetIcon(item.icon)}
                            {item.title}
                        </Link>
                    )
                })}
            </nav>
        </aside >
    )
}