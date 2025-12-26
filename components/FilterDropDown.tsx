"use client";

import { Filter, Crown, Sparkles, VenetianMask } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function FilterDropdown({ defaultValue }: { defaultValue?: string }) {
  const router = useRouter();
  const [selectedValue, setSelectedValue] = useState(defaultValue || "mix");

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedValue(value);
    router.push(`?filter=${value}`);
  };

  useEffect(() => {
    setSelectedValue(defaultValue || "mix");
  }, [defaultValue]);

  const getIcon = () => {
    switch (selectedValue) {
      case "male-first":
        return <Crown className="w-4 h-4 text-candidate-male-600" />;
      case "female-first":
        return <VenetianMask className="w-4 h-4 text-candidate-female-500" />;
      default:
        return <Filter className="w-4 h-4 text-candidate-male-600" />;
    }
  };

  return (
    <div className="flex items-center gap-2">
      {getIcon()}
      <select
        name="filter"
        value={selectedValue}
        className="bg-transparent border-none outline-none text-sm font-medium text-candidate-male-700 cursor-pointer focus:ring-0 appearance-none pr-7 py-1 hover:text-candidate-male-800 transition-colors"
        onChange={handleChange}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%232563eb' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 0.25rem center',
          backgroundSize: '1.25em 1.25em',
        }}
      >
        <option value="mix">Mix</option>
        <option value="male-first">Male first</option>
        <option value="female-first">Female first</option>
      </select>
    </div>
  );
}
