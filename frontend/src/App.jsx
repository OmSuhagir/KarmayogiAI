import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layouts
import EmployeeLayout from './layouts/EmployeeLayout';
import AdminLayout from './layouts/AdminLayout';

// Auth Pages
import EmployeeLogin from './pages/auth/EmployeeLogin';
import AdminLogin from './pages/auth/AdminLogin';

// Employee Portal Pages
import Dashboard from './pages/employee/Dashboard';
import MyCompetencies from './pages/employee/MyCompetencies';
import Assessments from './pages/employee/Assessments';
import TakeAssessment from './pages/employee/TakeAssessment';
import AssessmentResult from './pages/employee/AssessmentResult';
import SkillGaps from './pages/employee/SkillGaps';
import Recommendations from './pages/employee/Recommendations';
import LearningHub from './pages/employee/LearningHub';
import ProgressTracking from './pages/employee/ProgressTracking';

// Admin Portal Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import EmployeesList from './pages/admin/EmployeesList';
import Departments from './pages/admin/Departments';
import Positions from './pages/admin/Positions';
import Roles from './pages/admin/Roles';
import Competencies from './pages/admin/Competencies';
import AdminAssessments from './pages/admin/AdminAssessments';
import AdminQuestions from './pages/admin/AdminQuestions';
import LearningCatalogue from './pages/admin/LearningCatalogue';
import AIQuestionReview from './pages/admin/AIQuestionReview';
import WorkforceAnalytics from './pages/admin/WorkforceAnalytics';

// Design Reference
import DesignSystemShowcase from './pages/DesignSystemShowcase';

/**
 * Route Guard for Employee Portal
 */
function ProtectedEmployeeRoute({ children }) {
  const { isAuthenticated, userType, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen ambient-canvas bg-canvas flex items-center justify-center">
        <div className="p-6 rounded-2xl bg-white/75 backdrop-blur-md border border-white/80 shadow-glass text-xs font-semibold text-slate-600">
          Loading officer session...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login/employee" replace />;
  }

  if (userType === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
}

/**
 * Route Guard for Administrator Portal
 */
function ProtectedAdminRoute({ children }) {
  const { isAuthenticated, userType, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen ambient-canvas bg-canvas flex items-center justify-center">
        <div className="p-6 rounded-2xl bg-white/75 backdrop-blur-md border border-white/80 shadow-glass text-xs font-semibold text-slate-600">
          Loading administrator session...
        </div>
      </div>
    );
  }

  if (!isAuthenticated || userType !== 'admin') {
    return <Navigate to="/login/admin" replace />;
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Default entry point */}
          <Route path="/" element={<Navigate to="/login/employee" replace />} />

          {/* Authentication Routes (Separate Portals) */}
          <Route path="/login/employee" element={<EmployeeLogin />} />
          <Route path="/login/admin" element={<AdminLogin />} />

          {/* EMPLOYEE PORTAL (Protected via EmployeeLayout) */}
          <Route
            path="/employee"
            element={
              <ProtectedEmployeeRoute>
                <EmployeeLayout />
              </ProtectedEmployeeRoute>
            }
          >
            <Route index element={<Navigate to="/employee/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="competencies" element={<MyCompetencies />} />
            <Route path="assessments" element={<Assessments />} />
            <Route path="assessments/:id" element={<TakeAssessment />} />
            <Route path="assessments/:id/result" element={<AssessmentResult />} />
            <Route path="skill-gaps" element={<SkillGaps />} />
            <Route path="recommendations" element={<Recommendations />} />
            <Route path="learning" element={<LearningHub />} />
            <Route path="progress" element={<ProgressTracking />} />
          </Route>

          {/* ADMINISTRATOR PORTAL (Protected via AdminLayout) */}
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminLayout />
              </ProtectedAdminRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="employees" element={<EmployeesList />} />
            <Route path="departments" element={<Departments />} />
            <Route path="positions" element={<Positions />} />
            <Route path="roles" element={<Roles />} />
            <Route path="competencies" element={<Competencies />} />
            <Route path="assessments" element={<AdminAssessments />} />
            <Route path="questions" element={<AdminQuestions />} />
            <Route path="question-bank" element={<AdminQuestions />} />
            <Route path="learning" element={<LearningCatalogue />} />
            <Route path="learning-resources" element={<LearningCatalogue />} />
            <Route path="ai-question-review" element={<AIQuestionReview />} />
            <Route path="analytics" element={<WorkforceAnalytics />} />
            <Route path="workforce-analytics" element={<WorkforceAnalytics />} />
          </Route>

          {/* Reference Design System */}
          <Route path="/showcase" element={<DesignSystemShowcase />} />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/login/employee" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
