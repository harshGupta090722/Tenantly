import React from 'react';

interface FilterOption {
  label: string;
  value: string;
}

interface ComplaintFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  filters?: FilterOption[];
}

const defaultFilters: FilterOption[] = [
  { label: 'All', value: 'all' },
  { label: 'Open', value: 'open' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Resolved', value: 'resolved' },
];

function ComplaintFilters({ activeFilter, onFilterChange, filters = defaultFilters }: ComplaintFiltersProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {filters.map((f) => (
        <button
          key={f.value}
          onClick={() => onFilterChange(f.value)}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-full border transition-all duration-200 ${
            activeFilter === f.value
              ? 'bg-[#3b82f6] text-white border-[#3b82f6] shadow-sm'
              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}

export default ComplaintFilters;
