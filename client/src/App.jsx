import { Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout.jsx';
import ProtectedRoute from './components/routes/ProtectedRoute.jsx';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/auth/LoginPage.jsx';
import RegisterPage from './pages/auth/RegisterPage.jsx';
import StudentDashboardPage from './pages/student/StudentDashboardPage.jsx';
import CreateTopicPage from './pages/student/CreateTopicPage.jsx';
import TopicDetailsPage from './pages/student/TopicDetailsPage.jsx';
import QuizPage from './pages/student/QuizPage.jsx';
import StatisticsPage from './pages/student/StatisticsPage.jsx';
import AdminDashboardPage from './pages/admin/AdminDashboardPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import OfflinePage from './pages/OfflinePage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import LibraryPage from './pages/student/LibraryPage.jsx';
import FolderDetailsPage from './pages/student/FolderDetailsPage.jsx';
import ArchivedTopicsPage from './pages/student/ArchivedTopicsPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']} />}>
          <Route path="/dashboard" element={<StudentDashboardPage />} />
          <Route path="/topics/create" element={<CreateTopicPage />} />
          <Route path="/topics/:id" element={<TopicDetailsPage />} />
          <Route path="/topics/:id/quiz" element={<QuizPage />} />
          <Route path="/statistics" element={<StatisticsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/library/folders/:id" element={<FolderDetailsPage />} />
          <Route path="/library/archive" element={<ArchivedTopicsPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
        </Route>

        <Route path="/offline" element={<OfflinePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}