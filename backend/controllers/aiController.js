const { OpenAI } = require('openai');
const Content = require('../models/Content');
const { filterAIPrompt } = require('../services/aiService');

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Store AI conversation history (in production, use Redis or database)
const conversationHistory = new Map();

// @desc    Chat with AI assistant
// @route   POST /api/ai/chat
// @access  Private
const chatWithAI = async (req, res, next) => {
  try {
    const { message, contentId, context } = req.body;
    const userId = req.user._id.toString();

    // Filter and validate the prompt
    const filteredPrompt = await filterAIPrompt(message, contentId);
    
    if (!filteredPrompt.isValid) {
      return res.status(400).json({
        success: false,
        message: filteredPrompt.reason || 'Your question is not related to academic content. Please ask questions about your study materials.',
        type: 'invalid_prompt'
      });
    }

    let contentContext = '';
    
    // If contentId is provided, get content details for context
    if (contentId) {
      const content = await Content.findById(contentId);
      if (content) {
        contentContext = `
Content Title: ${content.title}
Subject: ${content.subject || 'N/A'}
Branch: ${content.branch}
Type: ${content.type}
Description: ${content.description || 'No description available'}
`;
      }
    }

    // Get or create conversation history for user
    if (!conversationHistory.has(userId)) {
      conversationHistory.set(userId, []);
    }
    
    const userHistory = conversationHistory.get(userId);
    
    // Limit history to last 10 messages to manage token usage
    if (userHistory.length > 10) {
      userHistory.splice(0, userHistory.length - 10);
    }

    // Prepare messages for OpenAI
    const messages = [
      {
        role: 'system',
        content: `You are an AI study assistant for Smart College platform. Your role is to help students understand their academic materials and answer questions related to their coursework.

IMPORTANT GUIDELINES:
1. ONLY answer questions related to academic content, study materials, and educational topics
2. If asked about non-academic topics, politely redirect to academic content
3. Be helpful, clear, and educational in your responses
4. Provide explanations that help students learn and understand concepts
5. If you don't have enough context about specific content, ask for clarification
6. Keep responses concise but informative
7. Encourage good study practices and critical thinking

${contentContext ? `CURRENT CONTENT CONTEXT:\n${contentContext}` : ''}
${context ? `ADDITIONAL CONTEXT:\n${context}` : ''}`
      },
      ...userHistory,
      {
        role: 'user',
        content: filteredPrompt.cleanedMessage
      }
    ];

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: 500,
      temperature: 0.7,
      presence_penalty: 0.1,
      frequency_penalty: 0.1
    });

    const aiResponse = completion.choices[0].message.content;

    // Update conversation history
    userHistory.push(
      { role: 'user', content: filteredPrompt.cleanedMessage },
      { role: 'assistant', content: aiResponse }
    );

    res.status(200).json({
      success: true,
      data: {
        message: aiResponse,
        contentId: contentId || null,
        timestamp: new Date().toISOString(),
        tokensUsed: completion.usage?.total_tokens || 0
      }
    });

  } catch (error) {
    console.error('AI chat error:', error);
    
    // Handle specific OpenAI errors
    if (error.code === 'insufficient_quota') {
      return res.status(503).json({
        success: false,
        message: 'AI service is temporarily unavailable. Please try again later.',
        type: 'service_unavailable'
      });
    }
    
    if (error.code === 'rate_limit_exceeded') {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please wait a moment before asking another question.',
        type: 'rate_limit'
      });
    }

    res.status(500).json({
      success: false,
      message: 'AI assistant is temporarily unavailable. Please try again later.',
      type: 'server_error'
    });
  }
};

// @desc    Get AI conversation history
// @route   GET /api/ai/history
// @access  Private
const getAIHistory = async (req, res, next) => {
  try {
    const userId = req.user._id.toString();
    const { limit = 20 } = req.query;

    const userHistory = conversationHistory.get(userId) || [];
    
    // Format history for frontend
    const formattedHistory = [];
    for (let i = 0; i < userHistory.length; i += 2) {
      if (userHistory[i] && userHistory[i + 1]) {
        formattedHistory.push({
          id: `${userId}-${i}`,
          userMessage: userHistory[i].content,
          aiResponse: userHistory[i + 1].content,
          timestamp: new Date().toISOString() // In production, store actual timestamps
        });
      }
    }

    // Return most recent conversations first
    const limitedHistory = formattedHistory
      .reverse()
      .slice(0, parseInt(limit));

    res.status(200).json({
      success: true,
      count: limitedHistory.length,
      data: limitedHistory
    });

  } catch (error) {
    console.error('Get AI history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching AI history'
    });
  }
};

// @desc    Clear AI conversation history
// @route   DELETE /api/ai/history
// @access  Private
const clearAIHistory = async (req, res, next) => {
  try {
    const userId = req.user._id.toString();
    
    conversationHistory.delete(userId);

    res.status(200).json({
      success: true,
      message: 'AI conversation history cleared successfully'
    });

  } catch (error) {
    console.error('Clear AI history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while clearing AI history'
    });
  }
};

module.exports = {
  chatWithAI,
  getAIHistory,
  clearAIHistory
};