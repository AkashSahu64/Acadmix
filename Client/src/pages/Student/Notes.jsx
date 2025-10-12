import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { resourceService } from '../../services/resourceService';
import FilterBar from '../../components/common/FilterBar';
import ResourceCard from '../../components/student/ResourceCard';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    branch: '',
    year: '',
    semester: '',
    subject: '',
    search: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      try {
        const data = await resourceService.getNotes(filters);
        setNotes(data);
      } catch (error) {
        console.error('Error fetching notes:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotes();
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleResourceAction = async (resourceId, action) => {
    try {
      await resourceService.updateResourceStats(resourceId, 'notes', action);
      // Update local state to reflect the action
      setNotes(prevNotes => 
        prevNotes.map(note => {
          if (note.id === resourceId) {
            const updatedNote = { ...note };
            if (action === 'like') updatedNote.likes += 1;
            if (action === 'view') updatedNote.views += 1;
            if (action === 'bookmark') updatedNote.bookmarks += 1;
            if (action === 'download') updatedNote.downloads += 1;
            return updatedNote;
          }
          return note;
        })
      );
    } catch (error) {
      console.error(`Error updating ${action} stats:`, error);
    }
  };

  const handlePreview = (resource) => {
    navigate(`/student/preview?type=notes&id=${resource.id}`);
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
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Notes Library</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Access and download lecture notes and study materials
        </p>
      </div>

      <FilterBar onFilterChange={handleFilterChange} />

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-indigo-200 dark:border-indigo-900 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
      ) : notes.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="card-container"
        >
          {notes.map(note => (
            <ResourceCard
              key={note.id}
              resource={note}
              type="notes"
              onPreview={handlePreview}
              onAction={handleResourceAction}
            />
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-16 glass-card">
          <h3 className="text-xl font-semibold mb-2">No Notes Found</h3>
          <p className="text-slate-500 dark:text-slate-400">
            No notes match your current filters. Try changing your filter criteria.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default Notes;