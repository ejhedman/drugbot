export interface GenericDrug {
  row: number;
  generic_key: string;
  drug_discon_date: string;
  mech_of_action: string;
  class: string;
  rheum_pharm_type: string;
  load_dose: string;
  load_measure: string;
  load_reg: string;
  maintain_dose: string;
  maintain_measure: string;
  maintain_reg: string;
  montherapy: string;
  half_life: string;
  registry: string;
}

export interface ManufacturerDrug {
  row: number;
  manufacturer_drug_key: string;
  generic_key: string;
  generickey: string;
  drug_full_name: string;
  manufacturer: string;
  brandkey: string;
  biosimilar_suffix: string;
  biosimilar: boolean;
  orig_drug_name: string;
  drug_discon_date: string;
  maintain_dose: string;
  maintain_measure: string;
  maintain_reg: string;
  montherapy: string;
  half_life: string;
  registry: string;
}

export interface DrugAlias {
  row: number;
  generic_key: string;
  drug_brand_name: string;
  alias: string;
}

export interface DrugApproval {
  row: number;
  generic_key: string;
  drug_brand_name: string;
  route: string;
  country: string;
  approval_date: string;
  foreign_alt_name: string;
  box_warning: string;
  box_warning_date: string;
}

export interface DrugRepository {
  getGenericDrugs(): Promise<GenericDrug[]>;
  getGenericDrugsBySearch(searchTerm: string): Promise<GenericDrug[]>;
  getManufacturerDrugsByGenericKey(genericKey: string): Promise<ManufacturerDrug[]>;
  getDrugAliasesByGenericKey(genericKey: string): Promise<DrugAlias[]>;
  getDrugApprovalsByGenericKey(genericKey: string): Promise<DrugApproval[]>;
  getManufacturerDrugByKey(manufacturerDrugKey: string): Promise<ManufacturerDrug | null>;
} 