// Sidebar.tsx
"use client";

import Image, { StaticImageData } from "next/image";
import DashboardIcon from "@/assets/icons/dashboard_sidebar_icon.svg";
import InvoicesIcon from "@/assets/icons/invoices_sidebar_icon.svg";
import PaymentsIcon from "@/assets/icons/payemnts_sidebar_icon.svg";
import ExpensesIcon from "@/assets/icons/expenses_sidebar_icon.svg";
import ClientsIcon from "@/assets/icons/clients_sidebar_icon.svg";
import SettingsIcon from "@/assets/icons/settings_sidebar_icon.svg";
import { usePathname, useRouter } from "next/navigation";
import { SideBarMenuItemType } from "@/lib/types";

interface SidebarProps {
  onLinkClick?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLinkClick }) => {
  const pathname = usePathname();
  const router = useRouter();


  const menuItems: SideBarMenuItemType[] = [
    { title: "Dashboard", icon: DashboardIcon, path: "/" },
    { title: "Invoices", icon: InvoicesIcon, path: "/invoices" },
    { title: "Payments", icon: PaymentsIcon, path: "/payments" },
    { title: "Expenses", icon: ExpensesIcon, path: "/expenses" },
    { title: "Clients", icon: ClientsIcon, path: "/clients" },
    // { title: "Reports", icon: ReportsIcon, path: "/reports" },
    { title: "Settings", icon: SettingsIcon, path: "/settings" },
  ];

  const handleLinkClick = (clickedPath: string) => {
    if (pathname === clickedPath) return; // avoid re-routing if already on same path

    // Optional: Notify topbar or handle sidebar behavior
    window.dispatchEvent(new Event("topbar-start"));
    if (onLinkClick && window.innerWidth < 768) {
      onLinkClick();
    }

    router.push(clickedPath);
  };

  return (
    <div className=" h-full w-[250px] bg-white shadow-md py-5  font-['Archivo',sans-serif] flex flex-col justify-between relative">
      <div>
        <h2 className=" text-xl font-bold text-gray-800 ml-5 mb-8">Financea</h2>
        <nav className=" flex flex-col ">
          {menuItems.map(item => (
            <div
              key={item.path}
              role="link"
              aria-current={pathname === item.path ? "page" : undefined}
              onClick={() => handleLinkClick(item.path)}
              className={` cursor-pointer pl-5 flex justify-between text-gray-700 h-[50px]
                ${pathname === item.path ? "bg-[#7a9dfe2c]" : "hover:bg-gray-50"}`}
            >

              <div className="flex items-center space-x-4">
                <Image src={item.icon} alt={`${item.title} icon`} width={20} />
                <span className="text-base font-medium">{item.title}</span>
              </div>

              {/* To show the current tab */}
              <div className={`w-[3px]  ${pathname === item.path ? "bg-[#5E84EC]" : ""} `} />
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
