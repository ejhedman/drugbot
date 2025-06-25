'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Plus } from 'lucide-react';
import { GenericDrug, DrugApproval, DrugAlias } from '@/types/drug';

interface GenericDrugDetailsProps {
  drug: GenericDrug | null;
}

export const GenericDrugDetails: React.FC<GenericDrugDetailsProps> = ({ drug }) => {
  const [approvals, setApprovals] = useState<DrugApproval[]>([]);
  const [aliases, setAliases] = useState<DrugAlias[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (drug) {
      loadDrugData(drug.generic_key);
    } else {
      setApprovals([]);
      setAliases([]);
    }
  }, [drug]);

  const loadDrugData = async (genericKey: string) => {
    setLoading(true);
    try {
      const [approvalsResponse, aliasesResponse] = await Promise.all([
        fetch(`/api/drug-approvals?genericKey=${encodeURIComponent(genericKey)}`),
        fetch(`/api/drug-aliases?genericKey=${encodeURIComponent(genericKey)}`)
      ]);

      if (approvalsResponse.ok) {
        const approvalsData = await approvalsResponse.json();
        setApprovals(approvalsData);
      }

      if (aliasesResponse.ok) {
        const aliasesData = await aliasesResponse.json();
        setAliases(aliasesData);
      }
    } catch (error) {
      console.error('Failed to load drug data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditDrug = () => {
    // TODO: Implement edit drug functionality
    console.log('Edit drug clicked');
  };

  const handleDeleteDrug = () => {
    // TODO: Implement delete drug functionality
    console.log('Delete drug clicked');
  };

  const handleAddApproval = () => {
    // TODO: Implement add approval functionality
    console.log('Add approval clicked');
  };

  const handleEditApproval = (approval: DrugApproval) => {
    // TODO: Implement edit approval functionality
    console.log('Edit approval clicked', approval);
  };

  const handleDeleteApproval = (approval: DrugApproval) => {
    // TODO: Implement delete approval functionality
    console.log('Delete approval clicked', approval);
  };

  const handleAddAlias = () => {
    // TODO: Implement add alias functionality
    console.log('Add alias clicked');
  };

  const handleEditAlias = (alias: DrugAlias) => {
    // TODO: Implement edit alias functionality
    console.log('Edit alias clicked', alias);
  };

  const handleDeleteAlias = (alias: DrugAlias) => {
    // TODO: Implement delete alias functionality
    console.log('Delete alias clicked', alias);
  };

  if (!drug) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Select a drug to see details
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-4">
      {/* Drug Details Card */}
      <Card className="rounded-t-lg">
        <CardHeader className="flex flex-row items-center justify-between py-3 bg-blue-50 border-b border-gray-200">
          <CardTitle className="font-bold">Drug Details</CardTitle>
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
              <label className="text-sm font-medium text-gray-500">Generic Key</label>
              <p className="text-sm">{drug.generic_key}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Class</label>
              <p className="text-sm">{drug.class}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Mechanism of Action</label>
              <p className="text-sm">{drug.mech_of_action}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Rheum Pharm Type</label>
              <p className="text-sm">{drug.rheum_pharm_type}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Load Dose</label>
              <p className="text-sm">{drug.load_dose} {drug.load_measure}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Maintain Dose</label>
              <p className="text-sm">{drug.maintain_dose} {drug.maintain_measure}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Monotherapy</label>
              <p className="text-sm">{drug.montherapy}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Registry</label>
              <p className="text-sm">{drug.registry}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Approvals Card */}
      <Card className="rounded-t-lg mt-6">
        <CardHeader className="flex flex-row items-center justify-between py-3 bg-blue-50 border-b border-gray-200">
          <CardTitle className="font-bold">Approvals</CardTitle>
          <Button size="sm" variant="outline" onClick={handleAddApproval}>
            <Plus className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3 font-bold text-gray-700">Generic</th>
                    <th className="text-left py-2 px-3 font-bold text-gray-700">Route</th>
                    <th className="text-left py-2 px-3 font-bold text-gray-700">Country</th>
                    <th className="text-left py-2 px-3 font-bold text-gray-700">Date</th>
                    <th className="w-16"></th>
                    <th className="w-16"></th>
                  </tr>
                </thead>
                <tbody>
                  {approvals.length > 0 ? (
                    approvals.map((approval) => (
                      <tr key={approval.row} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-3">{approval.drug_brand_name}</td>
                        <td className="py-2 px-3">{approval.route}</td>
                        <td className="py-2 px-3">{approval.country}</td>
                        <td className="py-2 px-3">{approval.approval_date}</td>
                        <td className="py-2 px-1 w-16">
                          <Button size="sm" variant="outline" onClick={() => handleEditApproval(approval)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                        </td>
                        <td className="py-2 px-1 w-16">
                          <Button size="sm" variant="outline" onClick={() => handleDeleteApproval(approval)} className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-4 text-gray-500">No approvals found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Aliases Card */}
      <Card className="rounded-t-lg mt-6">
        <CardHeader className="flex flex-row items-center justify-between py-3 bg-blue-50 border-b border-gray-200">
          <CardTitle className="font-bold">Aliases</CardTitle>
          <Button size="sm" variant="outline" onClick={handleAddAlias}>
            <Plus className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3 font-bold text-gray-700">Alias</th>
                    <th className="text-left py-2 px-3 font-bold text-gray-700">Brand Name</th>
                    <th className="w-16"></th>
                    <th className="w-16"></th>
                  </tr>
                </thead>
                <tbody>
                  {aliases.length > 0 ? (
                    aliases.map((alias) => (
                      <tr key={alias.row} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-3">{alias.alias}</td>
                        <td className="py-2 px-3">{alias.drug_brand_name}</td>
                        <td className="py-2 px-1 w-16">
                          <Button size="sm" variant="outline" onClick={() => handleEditAlias(alias)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                        </td>
                        <td className="py-2 px-1 w-16">
                          <Button size="sm" variant="outline" onClick={() => handleDeleteAlias(alias)} className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center py-4 text-gray-500">No aliases found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 