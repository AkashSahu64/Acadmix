import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { resourceService } from '../../services/resourceService';
import FilterBar from '../../components/common/FilterBar';
import ResourceCard from '../../components/student/ResourceCard';

const PYQs = () => {
  const [pyqs, setPyqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    branch: '',
    year: '',
    semester: '',
    subject: '',
    examType: '',
    search: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPYQs = async () => {
      setLoading(true);
      try {
        const data = await resourceService.getPYQs(filters);
        setPyqs(data);
      } catch (error) {
        console.error('Error fetching PYQs:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPYQs();
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleResourceAction = async (resourceId, action) => {
    try {
      await resourceService.updateResourceStats(resourceId, 'pyqs', action);
      // Update local state to reflect the action
      setPyqs(prevPyqs => 
        prevPyqs.map(pyq => {
          if (pyq.id === resourceId) {
            const updatedPyq = { ...pyq };
            if (action === 'like') updatedPyq.likes += 1;
            if (action === 'download') updatedPyq.downloads += 1;
            return updatedPyq;
          }
          return pyq;
        })
      );
    } catch (error) {
      console.error(`Error updating ${action} stats:`, error);
    }
  };

  const handlePreview = (resource) => {
    navigate(`/student/preview?type=pyqs&id=${resource.id}`);
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
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Previous Year Questions</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Access previous years' question papers with solutions to prepare for exams
        </p>
      </div>

      <FilterBar onFilterChange={handleFilterChange} />

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-indigo-200 dark:border-indigo-900 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
      ) : pyqs.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="card-container"
        >
          {pyqs.map(pyq => (
            <ResourceCard
              key={pyq.id}
              resource={pyq}
              type="pyqs"
              onPreview={handlePreview}
              onAction={handleResourceAction}
            />
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-16 glass-card">
          <h3 className="text-xl font-semibold mb-2">No PYQs Found</h3>
          <p className="text-slate-500 dark:text-slate-400">
            No previous year questions match your current filters. Try changing your filter criteria.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default PYQs;