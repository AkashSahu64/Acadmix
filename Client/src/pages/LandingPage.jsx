import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Users, Video, FileText, Download, MessageSquare, Star, Shield, Zap, ArrowRight, CheckCircle } from 'lucide-react';
import Footer from '../components/common/Footer';

const LandingPage = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6 } }
  };

  const features = [
    {
      icon: <BookOpen size={32} />,
      title: "Comprehensive Notes",
      description: "Access detailed lecture notes and study materials from top professors across all subjects and branches."
    },
    {
      icon: <Video size={32} />,
      title: "Video Lectures",
      description: "Watch high-quality video tutorials and recorded lectures to enhance your understanding of complex topics."
    },
    {
      icon: <FileText size={32} />,
      title: "Previous Year Papers",
      description: "Practice with solved previous year question papers to ace your examinations with confidence."
    },
    {
      icon: <MessageSquare size={32} />,
      title: "AI Study Assistant",
      description: "Get instant help from our AI-powered chatbot that can answer questions about any study material."
    }
  ];

  const benefits = [
    {
      icon: <Zap size={24} />,
      title: "Lightning Fast",
      description: "Access thousands of resources instantly with our optimized search and filtering system."
    },
    {
      icon: <Shield size={24} />,
      title: "Trusted Content",
      description: "All materials are verified by experienced educators and updated regularly for accuracy."
    },
    {
      icon: <Users size={24} />,
      title: "Community Driven",
      description: "Connect with peers and teachers in our vibrant academic community for collaborative learning."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-indigo-900 dark:to-purple-900">
      {/* Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-card sticky top-0 z-50 p-4"
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="hidden md:flex w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 items-center justify-center">
              <BookOpen size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Acadmix
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link 
              to="/auth/login" 
              className="px-4 py-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
            >
              Sign In
            </Link>
            <Link 
              to="/auth/register" 
              className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Get Started
            </Link>
          </div>
        </div>
      </motion.nav>

      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Hero Section */}
        <motion.section variants={itemVariants} className="py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold lg:mb-10 mb-6">
              Your Ultimate
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> Academic </span>
              Resource Platform
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Access thousands of study materials, video lectures, and previous year papers. 
              Connect with peers and get instant help from our AI study assistant.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 lg:mt-16 justify-center items-center">
              <Link 
                to="/auth/register" 
                className="group px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center"
              >
                Start Learning Today
                <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/auth/login" 
                className="px-8 py-4 glass-button border border-indigo-200 dark:border-indigo-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300"
              >
                Sign In to Continue
              </Link>
            </div>
            
            <div className="lg:mt-16 mt-12 flex justify-center items-center space-x-8 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center">
                <CheckCircle size={16} className="mr-2 text-green-500" />
                Free to Join
              </div>
              <div className="flex items-center">
                <CheckCircle size={16} className="mr-2 text-green-500" />
                Verified Content
              </div>
              <div className="flex items-center">
                <CheckCircle size={16} className="mr-2 text-green-500" />
                AI Powered
              </div>
            </div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section variants={itemVariants} className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> Excel </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Our comprehensive platform provides all the tools and resources you need for academic success
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-card p-6 rounded-xl hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Stats Section */}
        <motion.section variants={itemVariants} className="py-20">
          <div className="glass-card p-8 md:p-12 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-600/10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl md:text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">10K+</div>
                <div className="text-slate-600 dark:text-slate-300">Study Materials</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">5K+</div>
                <div className="text-slate-600 dark:text-slate-300">Active Students</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-teal-600 dark:text-teal-400 mb-2">500+</div>
                <div className="text-slate-600 dark:text-slate-300">Video Lectures</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">50+</div>
                <div className="text-slate-600 dark:text-slate-300">Universities</div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Why Choose Us Section */}
        <motion.section variants={itemVariants} className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Students
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> Choose Us </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Join thousands of students who have transformed their academic journey with our platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center justify-center mx-auto mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Testimonials Section */}
        <motion.section variants={itemVariants} className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Students
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> Say </span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Priya Sharma",
                role: "Computer Science Student",
                content: "This platform has been a game-changer for my studies. The AI assistant helps me understand complex algorithms instantly!",
                rating: 5
              },
              {
                name: "Rahul Kumar",
                role: "Mechanical Engineering Student", 
                content: "The video lectures are incredibly detailed and the previous year papers helped me ace my exams. Highly recommended!",
                rating: 5
              },
              {
                name: "Ananya Patel",
                role: "Electronics Student",
                content: "Love the community feature! Being able to discuss problems with peers and get help from teachers is amazing.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-card p-6 rounded-xl"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-300 mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section variants={itemVariants} className="py-20">
          <div className="glass-card p-8 md:p-12 rounded-2xl text-center bg-gradient-to-r from-indigo-500/10 to-purple-600/10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> Academic Journey? </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
              Join thousands of students who are already using Smart College to excel in their studies. 
              Start your journey today - it's completely free!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                to="/auth/register" 
                className="group px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center"
              >
                Create Free Account
                <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/auth/login" 
                className="px-8 py-4 glass-button border border-indigo-200 dark:border-indigo-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300"
              >
                Already have an account?
              </Link>
            </div>
          </div>
        </motion.section>
      </motion.main>

      <Footer />
    </div>
  );
};

export default LandingPage;