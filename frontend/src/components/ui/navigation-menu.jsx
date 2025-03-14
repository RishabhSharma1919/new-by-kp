import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";

export function NavigationMenu({ children }) {
  return (
    <NavigationMenuPrimitive.Root className="flex gap-5 text-sm text-gray-700">
      {children}
    </NavigationMenuPrimitive.Root>
  );
}

export function NavigationMenuList({ children }) {
  return <NavigationMenuPrimitive.List className="flex gap-5">{children}</NavigationMenuPrimitive.List>;
}

export function NavigationMenuItem({ children }) {
  return <NavigationMenuPrimitive.Item>{children}</NavigationMenuPrimitive.Item>;
}

export function NavigationMenuLink({ children, href }) {
  return (
    <NavigationMenuPrimitive.Link asChild>
      <a href={href} className="hover:underline">
        {children}
      </a>
    </NavigationMenuPrimitive.Link>
  );
}
