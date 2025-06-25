'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { GenericDrug } from '@/types/drug';

interface DrugListProps {
  selectedDrug: GenericDrug | null;
  onDrugSelect: (drug: GenericDrug) => void;
}

export const DrugList: React.FC<DrugListProps> = ({ selectedDrug, onDrugSelect }) => {
  const [drugs, setDrugs] = useState<GenericDrug[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDrugs();
  }, []);

  useEffect(() => {
    searchDrugs();
  }, [searchTerm]);

  const loadDrugs = async () => {
    try {
      const response = await fetch('/api/generic-drugs');
      if (!response.ok) throw new Error('Failed to fetch drugs');
      const allDrugs = await response.json();
      setDrugs(allDrugs);
    } catch (error) {
      console.error('Failed to load drugs:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchDrugs = async () => {
    try {
      const url = searchTerm 
        ? `/api/generic-drugs?search=${encodeURIComponent(searchTerm)}`
        : '/api/generic-drugs';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to search drugs');
      const filteredDrugs = await response.json();
      setDrugs(filteredDrugs);
    } catch (error) {
      console.error('Failed to search drugs:', error);
    }
  };

  const handleAddDrug = () => {
    // TODO: Implement add drug functionality
    console.log('Add drug clicked');
  };

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Generic Drugs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full rounded-none shadow-none border-r border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Generic Drugs</CardTitle>
        <Button size="sm" variant="outline" onClick={handleAddDrug}>
          <Plus className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Search drugs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <div className="space-y-1 max-h-96 overflow-y-auto">
          {drugs.map((drug) => (
            <div
              key={drug.generic_key}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                selectedDrug?.generic_key === drug.generic_key
                  ? 'bg-blue-100 border border-blue-300'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
              onClick={() => onDrugSelect(drug)}
            >
              <div className="font-medium text-gray-900">{drug.generic_key}</div>
              <div className="text-sm text-gray-600">{drug.mech_of_action}</div>
            </div>
          ))}
        </div>
        
        {drugs.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? 'No drugs found matching your search.' : 'No drugs available.'}
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 