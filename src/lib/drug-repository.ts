import { GenericDrug, ManufacturerDrug, DrugAlias, DrugApproval } from '@/types/drug';
import fs from 'fs';
import path from 'path';

// Parse CSV data into structured objects
const parseCSV = (csvText: string): any[] => {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map((line, index) => {
    const values = line.split(',');
    const obj: any = { row: index + 1 };
    
    headers.forEach((header, i) => {
      let value = values[i] || '';
      // Remove quotes if present
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      
      // Special handling for biosimilar field
      if (header.trim() === 'biosimilar') {
        obj[header.trim()] = value === '1';
      } else {
        obj[header.trim()] = value;
      }
    });
    
    return obj;
  });
};

// Read CSV files synchronously (for server-side)
const readCSVFile = (filename: string): string => {
  const filePath = path.join(process.cwd(), 'data', filename);
  return fs.readFileSync(filePath, 'utf-8');
};

export async function getGenericDrugs(): Promise<GenericDrug[]> {
  return parseCSV(readCSVFile('generic_drugs.csv')) as GenericDrug[];
}

export async function getGenericDrugsBySearch(searchTerm: string): Promise<GenericDrug[]> {
  const drugs = await getGenericDrugs();
  if (!searchTerm.trim()) return drugs;
  
  return drugs.filter(drug => 
    drug.generic_key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    drug.mech_of_action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    drug.class.toLowerCase().includes(searchTerm.toLowerCase())
  );
}

export async function getManufacturerDrugsByGenericKey(genericKey: string): Promise<ManufacturerDrug[]> {
  const manufacturerDrugs = parseCSV(readCSVFile('manufacturer_drugs.csv'));
  return manufacturerDrugs.filter(drug => 
    drug.generic_key === genericKey
  ) as ManufacturerDrug[];
}

export async function getDrugAliasesByGenericKey(genericKey: string): Promise<DrugAlias[]> {
  const drugAliases = parseCSV(readCSVFile('drug_aliases.csv'));
  return drugAliases.filter(alias => 
    alias.generic_key === genericKey
  ) as DrugAlias[];
}

export async function getDrugApprovalsByGenericKey(genericKey: string): Promise<DrugApproval[]> {
  const drugApprovals = parseCSV(readCSVFile('drug_approvals.csv'));
  return drugApprovals.filter(approval => 
    approval.generic_key === genericKey
  ) as DrugApproval[];
}

export async function getManufacturerDrugByKey(manufacturerDrugKey: string): Promise<ManufacturerDrug | null> {
  const manufacturerDrugs = parseCSV(readCSVFile('manufacturer_drugs.csv'));
  const drug = manufacturerDrugs.find(drug => 
    drug.manufacturer_drug_key === manufacturerDrugKey
  );
  return drug ? (drug as ManufacturerDrug) : null;
} 