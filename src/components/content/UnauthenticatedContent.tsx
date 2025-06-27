import { LoginForm } from '@/components/auth/LoginForm';

interface UnauthenticatedContentProps {
  onLogin: () => void;
  onLoginHelp: () => void;
}

export function UnauthenticatedContent({ onLogin, onLoginHelp }: UnauthenticatedContentProps) {
  return (
    <div className="flex items-center justify-center flex-1 bg-gradient-to-br from-indigo-50 via-white to-indigo-100 p-4">
      <div className="w-full max-w-6xl">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Welcome to Your
                <span className="text-indigo-600"> Data Dashboard</span>
              </h1>
              <p className="text-lg text-gray-600">
                Explore and manage your entities with our modern, intuitive interface. 
                Get started by logging in with any email address.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                <span className="text-gray-700">Modern and responsive design</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                <span className="text-gray-700">Real-time data management</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                <span className="text-gray-700">Intuitive entity relationships</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="flex flex-col items-center space-y-4">
              <LoginForm onSuccess={onLogin} />
              <button
                onClick={onLoginHelp}
                className="text-sm text-indigo-600 hover:text-indigo-700 hover:underline transition-colors"
              >
                I need help logging in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 