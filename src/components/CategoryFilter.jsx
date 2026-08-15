import React from 'react';
import { CATEGORIES, getCategoryMeta } from '../utils/categories';
import { Filter, CheckCircle2, AlertCircle, SortAsc } from 'lucide-react';

export default function CategoryFilter({
  selectedCategory,
  setSelectedCategory,
  descFilter,
  setDescFilter,
  sortBy,
  setSortBy,
  categoryCounts,
  language,
  t
}) {
  return (
    <div className="space-y-3 mb-5">
      
      {/* Category Pills Grid */}
      <div className="flex flex-wrap items-center gap-1.5">
        {CATEGORIES.map((cat) => {
          const meta = getCategoryMeta(cat.id, language);
          const Icon = meta.icon;
          const isSelected = selectedCategory === meta.id;
          const count = categoryCounts[meta.id] || 0;

          return (
            <button
              key={meta.id}
              onClick={() => setSelectedCategory(meta.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-emerald-500 text-black font-bold shadow-sm'
                  : 'bg-[#161b22] text-gray-300 hover:bg-[#21262d] hover:text-white border border-[#30363d]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-black' : 'text-gray-400'}`} />
              <span>{meta.label}</span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                isSelected ? 'bg-black/20 text-black font-bold' : 'bg-gray-800 text-gray-400'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Sub-filters & Sorting toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#30363d]/60 text-xs">
        
        {/* Status Filter */}
        <div className="flex items-center gap-1 bg-[#161b22] p-1 rounded-lg border border-[#30363d]">
          <button
            onClick={() => setDescFilter('all')}
            className={`px-2.5 py-1 rounded transition-all ${
              descFilter === 'all'
                ? 'bg-[#21262d] text-white font-semibold'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {t.statusFilter.all}
          </button>

          <button
            onClick={() => setDescFilter('has_desc')}
            className={`px-2.5 py-1 rounded transition-all flex items-center gap-1 ${
              descFilter === 'has_desc'
                ? 'bg-emerald-950 text-emerald-400 font-semibold border border-emerald-800/60'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>{t.statusFilter.hasDesc}</span>
          </button>

          <button
            onClick={() => setDescFilter('no_desc')}
            className={`px-2.5 py-1 rounded transition-all flex items-center gap-1 ${
              descFilter === 'no_desc'
                ? 'bg-amber-950 text-amber-400 font-semibold border border-amber-800/60'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <AlertCircle className="w-3 h-3 text-amber-400" />
            <span>{t.statusFilter.noDesc}</span>
          </button>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-xs flex items-center gap-1">
            <SortAsc className="w-3.5 h-3.5" /> {t.sorting.label}
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#161b22] border border-[#30363d] text-gray-200 py-1 px-2.5 rounded-lg text-xs cursor-pointer focus:outline-none focus:border-emerald-500"
          >
            <option value="popular">{t.sorting.popular}</option>
            <option value="name_asc">{t.sorting.nameAsc}</option>
            <option value="name_desc">{t.sorting.nameDesc}</option>
            <option value="category">{t.sorting.category}</option>
          </select>
        </div>

      </div>

    </div>
  );
}
