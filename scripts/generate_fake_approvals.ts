(function() {
  const fs = require('fs');
  const path = require('path');

  // Paths
  const GENERIC_DRUGS_PATH_APPROVALS = path.join(__dirname, '../ddl/07a_generic_drugs.sql');
  const OUTPUT_PATH_APPROVALS = path.join(__dirname, '../ddl/07e_generic_approvals.sql');

  // Fake data pools
  const COUNTRIES = ['USA', 'CAN', 'FRA', 'UK', 'DEU', 'ITA', 'ESP', 'JPN', 'AUS', 'BRA'];
  const ROUTE_TYPES_APPROVALS = ['Oral', 'Subcutaneous', 'Intravenous', 'Topical', 'Inhalation', 'Transdermal', 'Intramuscular', 'Sublingual', 'Rectal', 'Nasal'];

  const INDICATIONS = [
    'Rheumatoid Arthritis', 'Psoriatic Arthritis', 'Ankylosing Spondylitis', 'Crohn\'s Disease', 'Ulcerative Colitis',
    'Plaque Psoriasis', 'Psoriatic Arthritis', 'Juvenile Idiopathic Arthritis', 'Systemic Lupus Erythematosus',
    'Multiple Sclerosis', 'Asthma', 'Chronic Obstructive Pulmonary Disease', 'Diabetes Mellitus Type 2',
    'Hypertension', 'Heart Failure', 'Atrial Fibrillation', 'Deep Vein Thrombosis', 'Pulmonary Embolism',
    'HIV Infection', 'Hepatitis C', 'Bacterial Infections', 'Fungal Infections', 'Viral Infections',
    'Cancer', 'Osteoporosis', 'Depression', 'Anxiety', 'Schizophrenia', 'Bipolar Disorder', 'Migraine'
  ];

  const POPULATIONS = [
    'Adults 18-65 years', 'Adults 65+ years', 'Pediatric patients 2-17 years', 'Pediatric patients 6 months-2 years',
    'Adults with moderate to severe disease', 'Adults with mild disease', 'Treatment-naive patients',
    'Patients with prior treatment failure', 'Patients with comorbidities', 'Pregnant women',
    'Patients with renal impairment', 'Patients with hepatic impairment', 'Immunocompromised patients',
    'Patients with cardiovascular disease', 'Patients with diabetes', 'Patients with obesity'
  ];

  const BOX_WARNINGS = [
    'Increased risk of serious infections', 'Increased risk of malignancy', 'Risk of tuberculosis reactivation',
    'Risk of hepatitis B reactivation', 'Risk of progressive multifocal leukoencephalopathy',
    'Risk of serious cardiovascular events', 'Risk of gastrointestinal perforation', 'Risk of anaphylaxis',
    'Risk of liver injury', 'Risk of blood disorders', 'Risk of hypersensitivity reactions',
    'Risk of central nervous system effects', 'Risk of renal impairment', 'Risk of bone loss',
    'Risk of vision changes', 'Risk of hearing loss', 'Risk of peripheral neuropathy'
  ];

  function randomIntApprovals(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function randomChoiceApprovals<T>(arr: T[]): T {
    return arr[randomIntApprovals(0, arr.length - 1)];
  }

  function randomDate(startYear: number = 1990, endYear: number = 2024): string {
    const year = randomIntApprovals(startYear, endYear);
    const month = randomIntApprovals(1, 12);
    const day = randomIntApprovals(1, 28); // Using 28 to avoid month/day issues
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }

  function randomIndications(): string {
    const count = randomIntApprovals(1, 3);
    const selected: string[] = [];
    for (let i = 0; i < count; i++) {
      const indication = randomChoiceApprovals(INDICATIONS);
      if (!selected.includes(indication)) {
        selected.push(indication);
      }
    }
    return selected.join('; ');
  }

  function randomPopulations(): string {
    const count = randomIntApprovals(1, 2);
    const selected: string[] = [];
    for (let i = 0; i < count; i++) {
      const population = randomChoiceApprovals(POPULATIONS);
      if (!selected.includes(population)) {
        selected.push(population);
      }
    }
    return selected.join('; ');
  }

  function randomBoxWarning(): string {
    if (Math.random() > 0.7) { // 30% chance of having a box warning
      return randomChoiceApprovals(BOX_WARNINGS);
    }
    return '';
  }

  interface GenericDrugApprovals {
    row: number;
    generic_key: string;
    generic_name: string;
    biologic: string;
    mech_of_action: string;
    class_or_type: string;
    target: string;
  }

  function parseGenericDrugsApprovals(sql: string): GenericDrugApprovals[] {
    const regex = /\((\d+), '([^']+)', '([^']+)', '([^']+)', '([^']+)', '([^']+)', '([^']+)'\)/g;
    const drugs: GenericDrugApprovals[] = [];
    let match: RegExpExecArray | null;
    while ((match = regex.exec(sql)) !== null) {
      drugs.push({
        row: Number(match[1]),
        generic_key: match[2],
        generic_name: match[3],
        biologic: match[4],
        mech_of_action: match[5],
        class_or_type: match[6],
        target: match[7],
      });
    }
    return drugs;
  }

  type ApprovalRow = {
    row: number;
    generic_key: string;
    generic_uid: string;
    route_type: string;
    country: string;
    indication: string;
    populations: string;
    approval_date: string;
    discon_date: string;
    box_warning: string;
    box_warning_date: string;
  };

  function generateApprovalRows(drug: GenericDrugApprovals, startRow: number): ApprovalRow[] {
    const n = randomIntApprovals(2, 30);
    const rows: ApprovalRow[] = [];
    
    for (let i = 0; i < n; i++) {
      const route_type = randomChoiceApprovals(ROUTE_TYPES_APPROVALS);
      const country = randomChoiceApprovals(COUNTRIES);
      const indication = randomIndications();
      const populations = randomPopulations();
      const approval_date = randomDate();
      
      // 10% chance of being discontinued
      const discon_date = Math.random() > 0.9 ? randomDate(2020, 2024) : '';
      
      const box_warning = randomBoxWarning();
      const box_warning_date = box_warning ? randomDate(2015, 2024) : '';
      
      rows.push({
        row: startRow + i,
        generic_key: drug.generic_key,
        generic_uid: 'NULL', // Placeholder, as we don't have the UUID
        route_type,
        country,
        indication,
        populations,
        approval_date,
        discon_date,
        box_warning,
        box_warning_date,
      });
    }
    return rows;
  }

  function toSqlValueApprovals(val: string | number): string {
    if (val === 'NULL' || val === '') return 'NULL';
    if (typeof val === 'number') return val.toString();
    return `'${val.replace(/'/g, "''")}'`;
  }

  function mainApprovals(): void {
    const sql: string = fs.readFileSync(GENERIC_DRUGS_PATH_APPROVALS, 'utf8');
    const drugs: GenericDrugApprovals[] = parseGenericDrugsApprovals(sql);
    let allRows: ApprovalRow[] = [];
    let rowCounter: number = 1;
    
    for (const drug of drugs) {
      const rows = generateApprovalRows(drug, rowCounter);
      allRows = allRows.concat(rows);
      rowCounter += rows.length;
    }
    
    const columns = [
      'row',
      'generic_key',
      'generic_uid',
      'route_type',
      'country',
      'indication',
      'populations',
      'approval_date',
      'discon_date',
      'box_warning',
      'box_warning_date',
    ];
    
    const values = allRows.map(row => `  (${columns.map(col => toSqlValueApprovals(row[col as keyof ApprovalRow])).join(', ')})`).join(',\n');
    const insert = `INSERT INTO generic_approvals (${columns.join(', ')})\nVALUES\n${values};\n`;
    
    fs.writeFileSync(OUTPUT_PATH_APPROVALS, insert, 'utf8');
    console.log(`Wrote ${allRows.length} rows to ${OUTPUT_PATH_APPROVALS}`);
  }

  mainApprovals();
})(); 