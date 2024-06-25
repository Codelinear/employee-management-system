"use client";

import EmailAssignForm from "@/components/email-assign-form";
import EmployeeDetailsForm from "@/components/employee-details-form";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { navLinkItems } from "@/constants/array";
import { useStore } from "@/store";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const { screen } = useStore();

  return (
    <main className="h-screen w-full flex flex-col items-center justify-center">
      <NavigationMenu className="border mb-10 px-5 py-3 rounded-lg">
        <NavigationMenuList>
          {navLinkItems.map((element) => (
            <NavigationMenuItem key={uuidv4()}>
              <Link href={element.url} legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  {element.name}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      {screen === "details" ? <EmployeeDetailsForm /> : <EmailAssignForm />}
    </main>
  );
}
