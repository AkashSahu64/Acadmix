const Content = require('../models/Content');

// Keywords that indicate academic/educational content
const ACADEMIC_KEYWORDS = [
  // General academic terms
  'study', 'learn', 'understand', 'explain', 'definition', 'concept', 'theory',
  'homework', 'assignment', 'project', 'exam', 'test', 'quiz', 'grade',
  'lecture', 'notes', 'textbook', 'chapter', 'lesson', 'course', 'subject',
  'research', 'analysis', 'solution', 'problem', 'example', 'practice',
  
  // Math and Science
  'equation', 'formula', 'calculate', 'solve', 'proof', 'theorem', 'algorithm',
  'function', 'variable', 'graph', 'matrix', 'derivative', 'integral',
  'chemistry', 'physics', 'biology', 'mathematics', 'calculus', 'algebra',
  'geometry', 'statistics', 'probability', 'experiment', 'hypothesis',
  
  // Computer Science
  'programming', 'code', 'software', 'database', 'algorithm', 'data structure',
  'computer', 'network', 'system', 'application', 'development', 'debugging',
  'java', 'python', 'javascript', 'html', 'css', 'sql', 'api', 'framework',
  
  // Engineering
  'engineering', 'design', 'circuit', 'mechanical', 'electrical', 'civil',
  'structure', 'material', 'process', 'system', 'analysis', 'simulation',
  
  // Business and Economics
  'economics', 'business', 'management', 'finance', 'accounting', 'marketing',
  'strategy', 'analysis', 'market', 'investment', 'profit', 'cost',
  
  // General academic verbs
  'analyze', 'compare', 'contrast', 'evaluate', 'summarize', 'describe',
  'discuss', 'examine', 'investigate', 'demonstrate', 'illustrate'
];

// Keywords that indicate non-academic content
const NON_ACADEMIC_KEYWORDS = [
  'weather', 'sports', 'entertainment', 'celebrity', 'gossip', 'politics',
  'news', 'current events', 'personal', 'relationship', 'dating', 'food',
  'recipe', 'cooking', 'travel', 'vacation', 'movie', 'music', 'game',
  'shopping', 'fashion', 'beauty', 'health', 'fitness', 'workout',
  'joke', 'funny', 'meme', 'social media', 'instagram', 'facebook',
  'twitter', 'tiktok', 'youtube', 'netflix', 'streaming'
];

// Inappropriate content keywords
const INAPPROPRIATE_KEYWORDS = [
  'hack', 'cheat', 'plagiarize', 'copy', 'steal', 'illegal', 'fraud',
  'violence', 'harm', 'hurt', 'kill', 'weapon', 'drug', 'alcohol',
  'inappropriate', 'offensive', 'hate', 'discrimination', 'harassment'
];

/**
 * Filter and validate AI prompts to ensure they are academic-related
 * @param {string} message - The user's message
 * @param {string} contentId - Optional content ID for context
 * @returns {Object} - Validation result with cleaned message
 */
const filterAIPrompt = async (message, contentId = null) => {
  try {
    const cleanedMessage = message.trim().toLowerCase();
    
    // Check for empty or very short messages
    if (cleanedMessage.length < 3) {
      return {
        isValid: false,
        reason: 'Please provide a more detailed question.',
        cleanedMessage: message
      };
    }

    // Check for inappropriate content
    const hasInappropriateContent = INAPPROPRIATE_KEYWORDS.some(keyword => 
      cleanedMessage.includes(keyword)
    );
    
    if (hasInappropriateContent) {
      return {
        isValid: false,
        reason: 'Please keep your questions appropriate and academic-focused.',
        cleanedMessage: message
      };
    }

    // If contentId is provided, the question is likely academic
    if (contentId) {
      const content = await Content.findById(contentId);
      if (content) {
        return {
          isValid: true,
          cleanedMessage: message,
          context: `Related to: ${content.title} (${content.subject})`
        };
      }
    }

    // Check for academic keywords
    const hasAcademicKeywords = ACADEMIC_KEYWORDS.some(keyword => 
      cleanedMessage.includes(keyword)
    );

    // Check for non-academic keywords
    const hasNonAcademicKeywords = NON_ACADEMIC_KEYWORDS.some(keyword => 
      cleanedMessage.includes(keyword)
    );

    // Question words that might indicate academic inquiry
    const questionWords = ['what', 'how', 'why', 'when', 'where', 'which', 'who'];
    const hasQuestionWord = questionWords.some(word => 
      cleanedMessage.startsWith(word) || cleanedMessage.includes(` ${word} `)
    );

    // Academic subjects and topics
    const academicSubjects = [
      'math', 'science', 'physics', 'chemistry', 'biology', 'computer',
      'engineering', 'economics', 'business', 'history', 'literature',
      'philosophy', 'psychology', 'sociology', 'statistics', 'calculus',
      'algebra', 'geometry', 'programming', 'database', 'algorithm'
    ];
    
    const hasAcademicSubject = academicSubjects.some(subject => 
      cleanedMessage.includes(subject)
    );

    // Determine if the message is academic
    let isAcademic = false;
    let confidence = 0;

    if (hasAcademicKeywords) {
      confidence += 0.4;
    }

    if (hasAcademicSubject) {
      confidence += 0.3;
    }

    if (hasQuestionWord && !hasNonAcademicKeywords) {
      confidence += 0.2;
    }

    if (hasNonAcademicKeywords) {
      confidence -= 0.5;
    }

    // Check for academic patterns
    const academicPatterns = [
      /how to (solve|calculate|find|determine|analyze)/,
      /what is (the|a) (definition|meaning|concept|theory)/,
      /explain (the|this|how|why)/,
      /can you help me (understand|with|solve)/,
      /i don't understand/,
      /homework|assignment|project|exam|test/
    ];

    const hasAcademicPattern = academicPatterns.some(pattern => 
      pattern.test(cleanedMessage)
    );

    if (hasAcademicPattern) {
      confidence += 0.3;
    }

    isAcademic = confidence > 0.3;

    if (!isAcademic) {
      return {
        isValid: false,
        reason: 'I can only help with academic questions related to your study materials. Please ask about your coursework, assignments, or educational content.',
        cleanedMessage: message
      };
    }

    return {
      isValid: true,
      cleanedMessage: message,
      confidence: confidence
    };

  } catch (error) {
    console.error('Error filtering AI prompt:', error);
    return {
      isValid: false,
      reason: 'Unable to process your question. Please try again.',
      cleanedMessage: message
    };
  }
};

/**
 * Generate context from content for AI responses
 * @param {Object} content - Content object from database
 * @returns {string} - Formatted context string
 */
const generateContentContext = (content) => {
  if (!content) return '';

  let context = `Content: ${content.title}\n`;
  
  if (content.subject) {
    context += `Subject: ${content.subject}\n`;
  }
  
  if (content.branch) {
    context += `Branch: ${content.branch}\n`;
  }
  
  if (content.type) {
    context += `Type: ${content.type}\n`;
  }
  
  if (content.description) {
    context += `Description: ${content.description}\n`;
  }

  return context;
};

/**
 * Validate if a question is appropriate for the given content
 * @param {string} question - User's question
 * @param {Object} content - Content object
 * @returns {boolean} - Whether question is relevant to content
 */
const isQuestionRelevantToContent = (question, content) => {
  if (!content) return true; // Allow general academic questions

  const questionLower = question.toLowerCase();
  const contentKeywords = [
    content.title?.toLowerCase(),
    content.subject?.toLowerCase(),
    content.branch?.toLowerCase(),
    content.description?.toLowerCase()
  ].filter(Boolean);

  // Check if question contains any content-related keywords
  return contentKeywords.some(keyword => 
    questionLower.includes(keyword) || 
    keyword.split(' ').some(word => questionLower.includes(word))
  );
};

module.exports = {
  filterAIPrompt,
  generateContentContext,
  isQuestionRelevantToContent,
  ACADEMIC_KEYWORDS,
  NON_ACADEMIC_KEYWORDS,
  INAPPROPRIATE_KEYWORDS
};