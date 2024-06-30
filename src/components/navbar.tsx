"use client";

import React from "react";
import { Inter } from "next/font/google";
import Logo from "./logo";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { navLinkItems } from "@/constants/array";
import { v4 as uuidv4 } from "uuid";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

const Header = () => {
  const pathname = usePathname();

  const router = useRouter();

  const onLogout = useCallback(() => {
    window.sessionStorage.setItem("username", "");
    router.push("/login");
  }, [router]);

  return (
    <header
      className={cn(inter.className, "flex px-14 py-[1.3rem] bg-transparent")}
    >
      <Logo />
      {pathname !== "/login" && (
        <>
          <NavigationMenu>
            <NavigationMenuList className="ml-[7.5rem]">
              {navLinkItems.map((element) => (
                <NavigationMenuItem key={uuidv4()}>
                  <Link href={element.url} legacyBehavior passHref>
                    <NavigationMenuLink
                      active={pathname === element.url}
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "text-[12px] px-3 py-0 rounded-lg mx-[0.7rem]"
                      )}
                    >
                      {element.name}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <Link href="/login" className="ml-auto block">
            <Button
              type="button"
              onClick={onLogout}
              className="text-[#000] hover:bg-transparent bg-transparent"
            >
              Log out
            </Button>
          </Link>
        </>
      )}
    </header>
  );
};

export default Header;
