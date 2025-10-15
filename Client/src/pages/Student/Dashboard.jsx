import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  FileText,
  Video,
  Book,
  Bell,
  MessageSquare,
  Heart,
  Download,
  Bookmark,
  Calendar,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { resourceService } from "../../services/resourceService";
import { adminService } from "../../services/adminService";
import { commonService } from "../../services/commonService";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [recentResources, setRecentResources] = useState({
    notes: [],
    pyqs: [],
    videos: [],
  });
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch recent resources
        const [notes, pyqs, videos, announcements] = await Promise.all([
          resourceService.getNotes(),
          resourceService.getPYQs(),
          resourceService.getVideos(),
          commonService.getAnnouncements(),
        ]);

        setRecentResources({
          notes: notes.slice(0, 3),
          pyqs: pyqs.slice(0, 3),
          videos: videos.slice(0, 2),
        });

        setAnnouncements(announcements);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="pb-8"
    >
      {/* Welcome section */}
      <motion.section variants={itemVariants} className="mb-8">
        <div className="glass-card p-6 sm:p-8 rounded-xl bg-gradient-to-r from-indigo-500/90 to-purple-600/90 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                Welcome back, {user?.name || "Student"}!
              </h1>
              <p className="text-indigo-100">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="glass py-2 px-4 rounded-lg text-sm font-medium">
              <div className="flex items-center">
                <Calendar size={16} className="mr-2" />
                <span>
                  {user?.branch || "Computer Science"} | Year{" "}
                  {user?.year || "3"} | Semester {user?.semester || "5"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Quick Access Cards */}
      <motion.section variants={itemVariants} className="mb-8">
        <h2 className="section-title">Quick Access</h2>
        {/* Quick Access Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            key="quick-access-notes"
            to="/student/notes"
            className="glass-card p-4 text-center hover:shadow-lg transition-shadow"
          >
            <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3">
              <BookOpen size={24} />
            </div>
            <h3 className="font-medium">Notes</h3>
          </Link>

          <Link
            key="quick-access-videos"
            to="/student/videos"
            className="glass-card p-4 text-center hover:shadow-lg transition-shadow"
          >
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto mb-3">
              <Video size={24} />
            </div>
            <h3 className="font-medium">Videos</h3>
          </Link>

          <Link
            key="quick-access-syllabus"
            to="/student/syllabus"
            className="glass-card p-4 text-center hover:shadow-lg transition-shadow"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
              <Book size={24} />
            </div>
            <h3 className="font-medium">Syllabus</h3>
          </Link>

          <Link
            key="quick-access-pyqs"
            to="/student/pyqs"
            className="glass-card p-4 text-center hover:shadow-lg transition-shadow"
          >
            <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-3">
              <FileText size={24} />
            </div>
            <h3 className="font-medium">PYQs</h3>
          </Link>
        </div>
      </motion.section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Notes and PYQs */}
        <motion.section variants={itemVariants} className="lg:col-span-2">
          <div className="glass-card p-6 rounded-xl h-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Uploads</h2>
              <Link
                to="/student/notes"
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                View All
              </Link>
            </div>

            {loading ? (
              <div className="flex justify-center py-10">
                <div className="w-10 h-10 border-4 border-indigo-200 dark:border-indigo-900 border-t-indigo-500 rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3 flex items-center">
                    <BookOpen size={18} className="mr-2" /> Latest Notes
                  </h3>
                  <div className="space-y-2">
                    {recentResources.notes.map((note) => (
                      <Link
                        key={note.id}
                        to={`/student/preview?type=notes&id=${note.id}`}
                        className="flex items-center p-3 glass rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <div className="w-10 h-10 rounded overflow-hidden mr-3 hidden sm:block">
                          <img
                            src={note.thumbnail}
                            alt={note.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-1">
                            {note.title}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {note.subject} • {note.uploadDate}
                          </p>
                        </div>
                        <div className="flex space-x-3 text-slate-500 dark:text-slate-400">
                          <span className="flex items-center text-xs">
                            <Heart size={12} className="mr-1" /> {note.likes}
                          </span>
                          <span className="flex items-center text-xs">
                            <Download size={12} className="mr-1" />{" "}
                            {note.downloads}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3 flex items-center">
                    <FileText size={18} className="mr-2" /> Latest PYQs
                  </h3>
                  <div className="space-y-2">
                    {recentResources.pyqs.map((pyq) => (
                      <Link
                        key={pyq.id}
                        to={`/student/preview?type=pyqs&id=${pyq.id}`}
                        className="flex items-center p-3 glass rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <div className="w-10 h-10 rounded overflow-hidden mr-3 hidden sm:block">
                          <img
                            src={pyq.thumbnail}
                            alt={pyq.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-1">
                            {pyq.title}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {pyq.subject} • {pyq.examType} • {pyq.examDate}
                          </p>
                        </div>
                        <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                          <Download size={12} className="mr-1" />{" "}
                          {pyq.downloads}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3 flex items-center">
                    <Video size={18} className="mr-2" /> Latest Videos
                  </h3>
                  <div className="space-y-2">
                    {recentResources.videos.map((video) => (
                      <Link
                        key={video.id}
                        to={`/student/preview?type=videos&id=${video.id}`}
                        className="flex items-center p-3 glass rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <div className="w-14 h-10 rounded overflow-hidden mr-3 hidden sm:block">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-1">
                            {video.title}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            By {video.instructor} • {video.duration}
                          </p>
                        </div>
                        <div className="flex space-x-3 text-slate-500 dark:text-slate-400">
                          <span className="flex items-center text-xs">
                            <Heart size={12} className="mr-1" /> {video.likes}
                          </span>
                          <span className="flex items-center text-xs">
                            <Bookmark size={12} className="mr-1" />{" "}
                            {video.bookmarks}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.section>

        {/* Announcements and Community */}
        <motion.section variants={itemVariants} className="space-y-6">
          {/* Announcements */}
          <div className="glass-card p-6 rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center">
                <Bell size={18} className="mr-2" /> Announcements
              </h2>
            </div>

            {loading ? (
              <div className="flex justify-center py-10">
                <div className="w-8 h-8 border-3 border-indigo-200 dark:border-indigo-900 border-t-indigo-500 rounded-full animate-spin"></div>
              </div>
            ) : announcements.length > 0 ? (
              <div className="space-y-3" key='student-announcements'>
                {announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className={`p-3 rounded-lg ${
                      announcement.pinned
                        ? "bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800"
                        : "glass"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium text-sm">
                        {announcement.pinned && (
                          <span className="inline-block px-2 py-0.5 bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 text-xs rounded-full mr-2">
                            Pinned
                          </span>
                        )}
                        {announcement.title}
                      </h4>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {announcement.date}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                      {announcement.content}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                      By {announcement.author}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-500 dark:text-slate-400">
                <p>No announcements available</p>
              </div>
            )}
          </div>

          {/* Community Quick Access */}
          <div className="glass-card p-6 rounded-xl">
            <h2 className="text-xl font-semibold flex items-center mb-4">
              <MessageSquare size={18} className="mr-2" /> Community
            </h2>

            {/* Community Quick Access*/}
            <div className="space-y-3">
              <Link
                key="community-student"
                to="/student/community?tab=student"
                className="block p-4 glass rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <h3 className="font-medium mb-1">Student Discussions</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Connect with fellow students, share notes, and discuss
                  coursework
                </p>
              </Link>

              <Link
                key="community-teacher"
                to="/student/community?tab=teacher"
                className="block p-4 glass rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <h3 className="font-medium mb-1">Teacher Consultations</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Reach out to your professors for guidance and academic support
                </p>
              </Link>
            </div>
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
};

export default StudentDashboard;
