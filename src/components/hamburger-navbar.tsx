import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import HamburgerIcon from "@/components/ui/hamburger-icon";
import { Button } from "./ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";
import { navLinkItems } from "@/constants/array";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const HamburgerNavbar = () => {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="bg-transparent hover:bg-[F7F7F7]" size={"icon"}>
          <HamburgerIcon />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <NavigationMenu>
          <NavigationMenuList className="mt-10 flex flex-col gap-x-4 gap-y-2">
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
      </SheetContent>
    </Sheet>
  );
};

export default HamburgerNavbar;
