"use client";

import { AppLayout } from '@/components/layout/app-layout';
import { UnauthenticatedContent } from '@/components/content/unauthenticated-content';
import { DrugList } from '@/components/content/drug-list';
import { ManufacturerDrugList } from '@/components/content/manufacturer-drug-list';
import { GenericDrugDetails } from '@/components/content/generic-drug-details';
import { ManufacturerDrugDetails } from '@/components/content/manufacturer-drug-details';
import { useAuth } from '@/contexts/auth-context';
import React, { useState } from 'react';
import { GenericDrug, ManufacturerDrug } from '@/types/drug';

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const [selectedGenericDrug, setSelectedGenericDrug] = useState<GenericDrug | null>(null);
  const [selectedManufacturerDrug, setSelectedManufacturerDrug] = useState<ManufacturerDrug | null>(null);

  const handleGenericDrugSelect = (drug: GenericDrug) => {
    setSelectedGenericDrug(drug);
    setSelectedManufacturerDrug(null); // Reset manufacturer drug selection
  };

  const handleManufacturerDrugSelect = (drug: ManufacturerDrug) => {
    setSelectedManufacturerDrug(drug);
  };

  return (
    <AppLayout>
      {!isAuthenticated ? (
        <UnauthenticatedContent />
      ) : (
        <div className="flex-1 flex flex-row min-h-0 h-full">
          {/* Column 1: Generic Drugs */}
          <div className="w-80 h-full min-h-0 p-0 m-0">
            <DrugList 
              selectedDrug={selectedGenericDrug} 
              onDrugSelect={handleGenericDrugSelect} 
            />
          </div>
          
          {/* Column 2: Manufacturer Drugs */}
          <div className="w-80 h-full min-h-0">
            <ManufacturerDrugList
              selectedGenericDrug={selectedGenericDrug}
              selectedManufacturerDrug={selectedManufacturerDrug}
              onManufacturerDrugSelect={handleManufacturerDrugSelect}
            />
          </div>
          
          {/* Column 3: Details */}
          <div className="flex-1 h-full min-h-0">
            {selectedManufacturerDrug ? (
              <ManufacturerDrugDetails drug={selectedManufacturerDrug} />
            ) : (
              <GenericDrugDetails drug={selectedGenericDrug} />
            )}
          </div>
        </div>
      )}
    </AppLayout>
  );
}
