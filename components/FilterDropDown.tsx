"use client";

import { Filter } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FilterDropdown({ defaultValue }: { defaultValue?: string }) {
  const router = useRouter();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    router.push(`?filter=${selectedValue}`);
  };

  return (
    <div className="flex items-center space-x-2">
      <select
        name="filter"
        defaultValue={defaultValue || "mix"}
        className="p-2 border rounded-md"
        onChange={handleChange}
      >
        <option value="mix">Mix</option>
        <option value="male-first">Male first</option>
        <option value="female-first">Female first</option>
      </select>
      <Filter className="w-8 h-8 text-Cprimary" />
      
    </div>
  );
}
