import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";

export function DropdownMenu({ children }) {
  return <DropdownMenuPrimitive.Root>{children}</DropdownMenuPrimitive.Root>;
}

export function DropdownMenuTrigger({ children }) {
  return <DropdownMenuPrimitive.Trigger asChild>{children}</DropdownMenuPrimitive.Trigger>;
}

export function DropdownMenuContent({ children }) {
  return (
    <DropdownMenuPrimitive.Content className="bg-white shadow-md p-2 rounded-md">
      {children}
    </DropdownMenuPrimitive.Content>
  );
}

export function DropdownMenuItem({ children, onClick }) {
  return (
    <DropdownMenuPrimitive.Item
      onClick={onClick}
      className="cursor-pointer px-3 py-2 hover:bg-gray-100 rounded-md"
    >
      {children}
    </DropdownMenuPrimitive.Item>
  );
}
