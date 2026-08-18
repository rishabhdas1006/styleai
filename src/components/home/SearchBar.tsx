import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function SearchBar() {
    return (
        <div className="relative w-full max-w-sm">
            <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
                strokeWidth={1.5}
            />

            <Input
                type="search"
                placeholder="Search"
                className="pl-10 pr-4 h-10 bg-[#ebe9e4] border-none rounded-md text-sm placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
            />
        </div>
    );
}