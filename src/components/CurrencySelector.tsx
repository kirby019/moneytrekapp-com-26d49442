import { useState, useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { currencies } from "@/lib/currency";
import { Search } from "lucide-react";

interface CurrencySelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

export default function CurrencySelector({ value, onValueChange }: CurrencySelectorProps) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return currencies;
    const q = search.toLowerCase();
    return currencies.filter(
      (c) => c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q) || c.symbol.includes(q)
    );
  }, [search]);

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select currency" />
      </SelectTrigger>
      <SelectContent>
        <div className="px-2 pb-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search currencies…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-9"
              onKeyDown={(e) => e.stopPropagation()}
            />
          </div>
        </div>
        {filtered.map((c) => (
          <SelectItem key={c.code} value={c.code}>
            {c.symbol} {c.code} — {c.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
