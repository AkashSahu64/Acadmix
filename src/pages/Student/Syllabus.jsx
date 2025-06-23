import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { resourceService } from '../../services/resourceService';
import FilterBar from '../../components/common/FilterBar';
import ResourceCard from '../../components/student/ResourceCard';

const Syllabus = () => {
  const [syllabus, setSyllabus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    branch: '',
    search: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSyllabus = async () => {
      setLoading(true);
      try {
        const data = await resourceService.getSyllabus(filters);
        setSyllabus(data);
      } catch (error) {
        console.error('Error fetching syllabus:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSyllabus();
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters({
      branch: newFilters.branch,
      search: newFilters.search
    });
  };

  const handleResourceAction = async (resourceId, action) => {
    try {
      await resourceService.updateResourceStats(resourceId, 'syllabus', action);
      // Update local state to reflect the action
      setSyllabus(prevSyllabus => 
        prevSyllabus.map(item => {
          if (item.id === resourceId) {
            const updatedItem = { ...item };
            if (action === 'view') updatedItem.views += 1;
            if (action === 'download') updatedItem.downloads += 1;
            return updatedItem;
          }
          return item;
        })
      );
    } catch (error) {
      console.error(`Error updating ${action} stats:`, error);
    }
  };

  const handlePreview = (resource) => {
    navigate(`/student/preview?type=syllabus&id=${resource.id}`);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pb-8"
    >
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Course Syllabus</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Browse and download detailed curriculum for all branches and semesters
        </p>
      </div>

      <FilterBar onFilterChange={handleFilterChange} />

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-indigo-200 dark:border-indigo-900 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
      ) : syllabus.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="card-container"
        >
          {syllabus.map(item => (
            <ResourceCard
              key={item.id}
              resource={item}
              type="syllabus"
              onPreview={handlePreview}
              onAction={handleResourceAction}
            />
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-16 glass-card">
          <h3 className="text-xl font-semibold mb-2">No Syllabus Found</h3>
          <p className="text-slate-500 dark:text-slate-400">
            No syllabus matches your current filters. Try changing your filter criteria.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default Syllabus;