// Sidebar.tsx
"use client";

import Image, { StaticImageData } from "next/image";
import DashboardIcon from "@/assets/icons/dashboard_sidebar_icon.svg";
import InvoicesIcon from "@/assets/icons/invoices_sidebar_icon.svg";
import PaymentsIcon from "@/assets/icons/payemnts_sidebar_icon.svg";
import ExpensesIcon from "@/assets/icons/expenses_sidebar_icon.svg";
import ClientsIcon from "@/assets/icons/clients_sidebar_icon.svg";
import ReportsIcon from "@/assets/icons/reports_sidebar_icon.svg";
import SettingsIcon from "@/assets/icons/settings_sidebar_icon.svg";
import { usePathname, useRouter } from "next/navigation";

interface SidebarProps {
  onLinkClick?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLinkClick }) => {
  const pathname = usePathname();
  const router = useRouter();

  interface menuItemsTypes {
    name: string,
    icon: StaticImageData,
    path: string
  }
  const menuItems: menuItemsTypes[] = [
    { name: "Dashboard", icon: DashboardIcon, path: "/" },
    { name: "Invoices", icon: InvoicesIcon, path: "/invoices" },
    { name: "Payments", icon: PaymentsIcon, path: "/payments" },
    { name: "Expenses", icon: ExpensesIcon, path: "/expenses" },
    { name: "Clients", icon: ClientsIcon, path: "/clients" },
    // { name: "Reports", icon: ReportsIcon, path: "/reports" },
    { name: "Settings", icon: SettingsIcon, path: "/settings" },
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
          {menuItems.map((item, index) => (
            <div
              key={index}
              onClick={() => handleLinkClick(item.path)}
              className={` cursor-pointer pl-5 flex justify-between text-gray-700 h-[50px]
                ${pathname === item.path ? "bg-[#7a9dfe2c]" : "hover:bg-gray-50"}`}
            >

              <div className="flex items-center space-x-4">
                <Image src={item.icon} alt={`${item.name} idcon`} width={20} />
                <span className="text-base font-medium">{item.name}</span>
              </div>

              <div className={`w-[3px]  ${pathname === item.path ? "bg-[#5E84EC]" : ""} `}>
                {/* To show the current tab */}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
