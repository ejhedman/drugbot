'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const UnauthenticatedContent: React.FC = () => {
  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center text-blue-600">
              Welcome to DrugBot Healthcare
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-lg text-gray-700 mb-4">
                A comprehensive drug management system for healthcare professionals
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">System Features</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Comprehensive drug database management</li>
                  <li>• Generic drug information tracking</li>
                  <li>• Manufacturer drug details and relationships</li>
                  <li>• Drug approval history and regulatory information</li>
                  <li>• Drug alias management and search</li>
                  <li>• Advanced filtering and search capabilities</li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Getting Started</h3>
                <div className="space-y-3 text-gray-600">
                  <p>To access the drug management system:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Click the "Login" button in the top right corner</li>
                    <li>Enter your email address</li>
                    <li>Access the full drug database and management tools</li>
                  </ol>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Need Help?</h4>
              <p className="text-blue-700">
                If you're having trouble logging in, click the "Login Help" button in the footer 
                to request assistance from our support team.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 