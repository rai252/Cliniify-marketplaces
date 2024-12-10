"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { BsChevronRight } from "react-icons/bs";
import { Separator } from "@/components/ui/separator";

interface SidebarNavItem {
  title: string;
  href?: string;
  onClick?: () => void;
}

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: SidebarNavItem[];
}

export function Sidebar({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "flex flex-wrap",
        "sm:flex-col sm:space-x-0 sm:space-y-1",
        "md:flex-col md:space-x-0 md:space-y-1",
        "lg:flex-col lg:space-x-0 lg:space-y-1",
        className
      )}
      {...props}
    >
      {items.map((item, index) => (
        <div key={index}>
          {item.href ? (
            <Link href={item.href}>
              <div
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  pathname === item.href && "bg-teal-800 text-white",
                  "flex items-center my-2",
                  "w-full py-2 px-4"
                )}
              >
                <>
                  <span className="flex-grow   text-base hover:text-teal-900">
                    {item.title}
                  </span>
                  <BsChevronRight className="text-sm hover:text-teal-900 ml-auto" />
                </>
              </div>
            </Link>
          ) : (
            <div
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "flex items-center my-2",
                "w-full py-2 px-4",
                item.onClick ? "cursor-pointer" : ""
              )}
              onClick={item.onClick}
            >
              <span className="flex-grow   text-base hover:text-teal-900">
                {item.title}
              </span>
              <BsChevronRight className="text-sm hover:text-teal-900 ml-auto" />
            </div>
          )}
          <Separator />
        </div>
      ))}
    </nav>
  );
}
