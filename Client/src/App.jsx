import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './router/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ChatProvider } from './context/ChatContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <ChatProvider>
            <AppRoutes />
          </ChatProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;