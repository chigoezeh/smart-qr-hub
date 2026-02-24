import Link from 'next/link';
import { FileQuestion, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-blue-100 dark:bg-blue-900/20 p-6">
            <FileQuestion className="h-16 w-16 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Page not found
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/dashboard" className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all">
            <Home className="mr-2 h-4 w-4" />
            Go to Dashboard
          </Link>
          <Link href="/dashboard/qr-codes" className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
            <Search className="mr-2 h-4 w-4" />
            View QR Codes
          </Link>
        </div>

        <div className="pt-4 text-sm text-gray-500 dark:text-gray-400">
          <p>Need help? <Link href="/dashboard/settings" className="text-blue-600 dark:text-blue-400 hover:underline">Contact support</Link></p>
        </div>
      </div>
    </div>
  );
}
