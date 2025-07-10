# 🎓 AI Learning Hub

A fully AI-generated, frontend-only personalized learning SPA powered by OpenAI GPT-4. No backend server or database required - everything runs in the browser with AI-generated content, quizzes, and tutoring.

## ✨ Features

- **🤖 AI Tutor Chatbot** - Conversational learning with GPT-4
- **🎯 Dynamic Quizzes** - AI-generated quizzes on any topic
- **📊 Gamification** - XP tracking, badges, and level progression
- **⚙️ Customizable Prompts** - Edit AI behavior for different features
- **💾 Local Storage** - Progress saved locally, no backend needed
- **🎨 Modern UI** - Beautiful, responsive design with Tailwind CSS
- **📱 Mobile Friendly** - Works on all devices

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. **Clone and install dependencies:**
   ```bash
   cd learning-spa
   npm install
   ```

2. **Set up your OpenAI API key:**
   - Create a `.env` file in the root directory
   - Add your API key: `VITE_OPENAI_KEY=sk-your-key-here`
   - Or enter it in the app when prompted

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173`

## 🎯 How to Use

### AI Tutor
- Select a subject from the dropdown (Math, Science, Programming, etc.)
- Start chatting with your AI tutor
- Ask questions, request explanations, or practice concepts

### Quizzes
- Click "Quizzes" in the navigation
- Enter any topic you want to test
- Choose difficulty level (Easy, Medium, Hard)
- Answer questions and get instant feedback with XP rewards

### Progress Tracking
- View your learning progress, XP, and badges
- Track level progression and achievements
- Monitor learning goals and analytics

### Settings
- Customize AI behavior for different features
- Edit system prompts for tutor, quiz, and evaluator
- Experiment with different AI personalities

## 🏗️ Architecture

### Frontend-Only Design
- **React + Vite** - Fast development and building
- **Tailwind CSS** - Utility-first styling
- **Local Storage** - Data persistence without backend
- **OpenAI API** - Direct integration for AI features

### Key Components
- `ChatBox.jsx` - AI tutor conversation interface
- `QuizCard.jsx` - Dynamic quiz generation and evaluation
- `XPTracker.jsx` - Gamification and progress tracking
- `PromptEditor.jsx` - AI behavior customization
- `openai.js` - API integration with streaming support

### Data Flow
1. User interacts with components
2. Components call OpenAI API directly
3. Responses are streamed in real-time
4. Progress saved to localStorage
5. UI updates with new data

## 🔧 Customization

### Adding New Subjects
Edit the `subjects` array in `App.jsx`:
```javascript
const subjects = [
  "Mathematics",
  "Science",
  "History",
  // Add your subjects here
];
```

### Customizing AI Behavior
Use the Prompt Editor in Settings to modify:
- **Tutor Personality** - How the AI tutor responds
- **Quiz Generation** - Question style and format
- **Answer Evaluation** - Feedback and scoring criteria

### Styling
- Modify `src/style.css` for custom styles
- Update Tailwind classes in components
- Add new CSS components in the `@layer components` section

## 🛡️ Security

- API keys are stored locally in localStorage
- No data is sent to external servers except OpenAI
- All processing happens client-side
- Environment variables are properly ignored in git

## 📱 Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy Options
- **Netlify** - Drag and drop the `dist` folder
- **Vercel** - Connect your GitHub repository
- **GitHub Pages** - Use the `dist` folder
- **Any static hosting** - The app is completely self-contained

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for learning and development.

## 🆘 Troubleshooting

### API Key Issues
- Ensure your OpenAI API key is valid and has credits
- Check that the key starts with `sk-`
- Verify the key is properly set in the app

### Build Issues
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version`
- Ensure all dependencies are installed

### Performance Issues
- The app uses streaming for better UX
- Large responses may take time to generate
- Consider using GPT-3.5-turbo for faster responses

## 🎉 Features in Detail

### Adaptive Learning
- AI remembers conversation context
- Quizzes adapt to user performance
- Personalized feedback and suggestions

### Real-Time Streaming
- See AI responses as they're generated
- Smooth, responsive user experience
- No waiting for complete responses

### Gamification System
- 10 levels of progression
- 6 different badges to earn
- XP-based reward system
- Visual progress indicators

### No Backend Required
- Completely self-contained
- Works offline (except for AI calls)
- Easy to deploy and maintain
- No server costs or maintenance

---

**Built with ❤️ using React, OpenAI GPT-4, and Tailwind CSS** 