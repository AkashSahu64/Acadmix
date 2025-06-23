import { useState } from 'react';
import { Search, ChevronDown, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FilterBar = ({ onFilterChange }) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    branch: '',
    year: '',
    semester: '',
    subject: ''
  });

  // Sample filter options
  const filterOptions = {
    branch: ['Computer Science', 'Electrical', 'Mechanical', 'Civil', 'Electronics', 'Chemistry', 'Mathematics', 'Economics'],
    year: ['1', '2', '3', '4'],
    semester: ['1', '2', '3', '4', '5', '6', '7', '8'],
    subject: ['Algorithms', 'Data Structures', 'Operating Systems', 'Database Management', 'Computer Networks', 'Machine Learning', 'Calculus', 'Organic Chemistry']
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onFilterChange({ ...filters, search: e.target.value });
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange({ ...newFilters, search: searchTerm });
  };

  const clearFilters = () => {
    setFilters({
      branch: '',
      year: '',
      semester: '',
      subject: ''
    });
    setSearchTerm('');
    onFilterChange({ branch: '', year: '', semester: '', subject: '', search: '' });
  };

  const hasActiveFilters = Object.values(filters).some(Boolean) || searchTerm;

  // Animation variants
  const dropdownVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto', transition: { duration: 0.3 } }
  };

  return (
    <div className="w-full mb-6">
      <div className="flex flex-col md:flex-row gap-3 items-center">
        <div className="relative w-full md:w-1/3">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search resources..."
            className="w-full pl-10 pr-4 py-2 glass rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="flex items-center gap-2 glass-button"
          >
            <span>Filters</span>
            <ChevronDown size={16} className={`transform transition-transform ${isFiltersOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <X size={16} />
              <span className="text-sm">Clear</span>
            </button>
          )}
        </div>
      </div>
      
      <AnimatePresence>
        {isFiltersOpen && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="mt-3 glass-card p-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(filterOptions).map(([key, options]) => (
                <div key={key} className="flex flex-col">
                  <label className="text-sm font-medium mb-1 capitalize">{key}</label>
                  <select
                    value={filters[key]}
                    onChange={(e) => handleFilterChange(key, e.target.value)}
                    className="glass rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="">All {key}s</option>
                    {options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            
            <div className="flex mt-4">
              {Object.entries(filters).map(([key, value]) => (
                value && (
                  <div key={key} className="mr-2 flex items-center glass px-2 py-1 rounded-full text-xs">
                    <span className="capitalize">{key}: {value}</span>
                    <button
                      onClick={() => handleFilterChange(key, '')}
                      className="ml-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )
              ))}
              {searchTerm && (
                <div className="mr-2 flex items-center glass px-2 py-1 rounded-full text-xs">
                  <span>Search: {searchTerm}</span>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      onFilterChange({ ...filters, search: '' });
                    }}
                    className="ml-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterBar;