'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { ManufacturerDrug } from '@/types/drug';

interface ManufacturerDrugDetailsProps {
  drug: ManufacturerDrug | null;
}

export const ManufacturerDrugDetails: React.FC<ManufacturerDrugDetailsProps> = ({ drug }) => {
  const handleEditDrug = () => {
    // TODO: Implement edit manufacturer drug functionality
    console.log('Edit manufacturer drug clicked');
  };

  const handleDeleteDrug = () => {
    // TODO: Implement delete manufacturer drug functionality
    console.log('Delete manufacturer drug clicked');
  };

  if (!drug) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Select a manufacturer drug to see details
      </div>
    );
  }

  return (
    <div className="flex-1 p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Manufacturer Drug</CardTitle>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" onClick={handleEditDrug}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={handleDeleteDrug} className="text-red-600 hover:text-red-700">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Manufacturer Drug Key</label>
              <p className="text-sm">{drug.manufacturer_drug_key}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Generic Key</label>
              <p className="text-sm">{drug.generic_key}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Drug Full Name</label>
              <p className="text-sm">{drug.drug_full_name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Manufacturer</label>
              <p className="text-sm">{drug.manufacturer}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Brand Key</label>
              <p className="text-sm">{drug.brandkey}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Biosimilar Suffix</label>
              <p className="text-sm">{drug.biosimilar_suffix || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Biosimilar</label>
              <p className="text-sm">{drug.biosimilar ? 'Yes' : 'No'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Original Drug Name</label>
              <p className="text-sm">{drug.orig_drug_name || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Drug Discontinuation Date</label>
              <p className="text-sm">{drug.drug_discon_date || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Maintain Dose</label>
              <p className="text-sm">{drug.maintain_dose} {drug.maintain_measure}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Maintain Regimen</label>
              <p className="text-sm">{drug.maintain_reg || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Monotherapy</label>
              <p className="text-sm">{drug.montherapy || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Half Life</label>
              <p className="text-sm">{drug.half_life || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Registry</label>
              <p className="text-sm">{drug.registry || 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 