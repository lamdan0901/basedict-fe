import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib";
import { Search, X } from "lucide-react";

type Props = {
  id?: string;
  value: string;
  placeholder?: string;
  onSearch(val: string): void;
};

export function Searchbar({ id, value, placeholder, onSearch }: Props) {
  return (
    <div id={id} className="relative w-full">
      <Input
        value={value}
        placeholder={placeholder}
        onChange={(e) => {
          onSearch(e.target.value);
        }}
        type="text"
        autoFocus
      />
      <Search
        className={cn(
          "absolute size-4 right-3 top-1/2 -translate-y-1/2",
          value && "hidden"
        )}
      />
      <Button
        variant={"ghost"}
        onClick={() => {
          onSearch("");
        }}
        className={cn(
          "rounded-full px-1 h-7 absolute right-2 top-1/2 -translate-y-1/2",
          value ? "flex" : "hidden"
        )}
      >
        <X className="size-5" />
      </Button>
    </div>
  );
}
