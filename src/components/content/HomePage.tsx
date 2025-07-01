export function HomePage() {
  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Drugissimo</h1>
        <p className="text-xl text-gray-600 mb-6">Your comprehensive drug management system</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Drug Management</h3>
            <p className="text-gray-600">Manage generic drugs, manufacturers, and approvals</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Data Analysis</h3>
            <p className="text-gray-600">View and analyze drug information and relationships</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Reports</h3>
            <p className="text-gray-600">Generate comprehensive reports and insights</p>
          </div>
        </div>
      </div>
    </div>
  );
} 