'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { GenericDrug, ManufacturerDrug } from '@/types/drug';

interface ManufacturerDrugListProps {
  selectedGenericDrug: GenericDrug | null;
  selectedManufacturerDrug: ManufacturerDrug | null;
  onManufacturerDrugSelect: (drug: ManufacturerDrug) => void;
}

export const ManufacturerDrugList: React.FC<ManufacturerDrugListProps> = ({
  selectedGenericDrug,
  selectedManufacturerDrug,
  onManufacturerDrugSelect,
}) => {
  const [manufacturerDrugs, setManufacturerDrugs] = useState<ManufacturerDrug[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedGenericDrug) {
      loadManufacturerDrugs(selectedGenericDrug.generic_key);
    } else {
      setManufacturerDrugs([]);
    }
  }, [selectedGenericDrug]);

  const loadManufacturerDrugs = async (genericKey: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/manufacturer-drugs?genericKey=${encodeURIComponent(genericKey)}`);
      if (!response.ok) throw new Error('Failed to fetch manufacturer drugs');
      const drugs = await response.json();
      setManufacturerDrugs(drugs);
    } catch (error) {
      console.error('Failed to load manufacturer drugs:', error);
      setManufacturerDrugs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddManufacturerDrug = () => {
    // TODO: Implement add manufacturer drug functionality
    console.log('Add manufacturer drug clicked');
  };

  if (!selectedGenericDrug) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Manufacturer Drugs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            Select a generic drug to see manufacturer drugs
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full rounded-none shadow-none border-l border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Manufacturer Drugs</CardTitle>
        <Button size="sm" variant="outline" onClick={handleAddManufacturerDrug}>
          <Plus className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {manufacturerDrugs.map((drug) => (
              <div
                key={drug.manufacturer_drug_key}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedManufacturerDrug?.manufacturer_drug_key === drug.manufacturer_drug_key
                    ? 'bg-blue-100 border border-blue-300'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => onManufacturerDrugSelect(drug)}
              >
                <div className="font-medium text-gray-900">{drug.drug_full_name}</div>
                <div className="text-sm text-gray-600">{drug.manufacturer}</div>
                {drug.biosimilar && (
                  <div className="text-xs text-blue-600">Biosimilar</div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {!loading && manufacturerDrugs.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No manufacturer drugs found for {selectedGenericDrug.generic_key}
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 