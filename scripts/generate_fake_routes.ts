const fs = require('fs');
const path = require('path');

// Paths
const GENERIC_DRUGS_PATH = path.join(__dirname, '../ddl/07a_generic_drugs.sql');
const OUTPUT_PATH = path.join(__dirname, '../ddl/07d_generic_routes.sql');

// Route types and other fake data pools
const ROUTE_TYPES = ['Oral', 'Subcutaneous', 'Intravenous', 'Topical', 'Inhalation', 'Transdermal', 'Intramuscular', 'Sublingual', 'Rectal', 'Nasal'];
const LOAD_MEASURES = ['mg', 'g', 'IU', 'mcg', 'mL'];
const MAINTAIN_MEASURES = ['mg', 'g', 'IU', 'mcg', 'mL'];
const MONOTHERAPY = ['Yes', 'No', 'Conditional'];
const HALF_LIFE = ['6h', '12h', '24h', '36h', '48h', '72h', '1 week', '2 weeks', 'Variable'];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice<T>(arr: T[]): T {
  return arr[randomInt(0, arr.length - 1)];
}

function randomDose(measure: string): string {
  switch (measure) {
    case 'mg': return randomInt(1, 1000).toString();
    case 'g': return (Math.random() * 2).toFixed(2);
    case 'IU': return randomInt(100, 10000).toString();
    case 'mcg': return randomInt(10, 1000).toString();
    case 'mL': return (Math.random() * 10).toFixed(1);
    default: return randomInt(1, 100).toString();
  }
}

function randomRegimen(): string {
  const freq = ['once daily', 'twice daily', 'every other day', 'weekly', 'monthly', 'as needed'];
  return randomChoice(freq);
}

interface GenericDrug {
  row: number;
  generic_key: string;
  generic_name: string;
  biologic: string;
  mech_of_action: string;
  class_or_type: string;
  target: string;
}

function parseGenericDrugs(sql: string): GenericDrug[] {
  const regex = /\((\d+), '([^']+)', '([^']+)', '([^']+)', '([^']+)', '([^']+)', '([^']+)'\)/g;
  const drugs: GenericDrug[] = [];
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

type RouteRow = {
  row: number;
  route_key: string;
  generic_key: string;
  generic_uid: string;
  route_type: string;
  load_measure: string;
  load_dose: string;
  load_measure_2: string;
  load_reg: string;
  maintain_dose: string;
  maintain_measure: string;
  maintain_reg: string;
  montherapy: string;
  half_life: string;
};

function generateRouteRows(drug: GenericDrug, startRow: number): RouteRow[] {
  const n = randomInt(2, 30);
  const rows: RouteRow[] = [];
  for (let i = 0; i < n; i++) {
    const route_type = randomChoice(ROUTE_TYPES);
    const load_measure = randomChoice(LOAD_MEASURES);
    const load_dose = randomDose(load_measure);
    const load_measure_2 = Math.random() > 0.7 ? randomChoice(LOAD_MEASURES) : '';
    const load_reg = randomRegimen();
    const maintain_dose = randomDose(load_measure);
    const maintain_measure = randomChoice(MAINTAIN_MEASURES);
    const maintain_reg = randomRegimen();
    const montherapy = randomChoice(MONOTHERAPY);
    const half_life = randomChoice(HALF_LIFE);
    const route_key = `${drug.generic_key}_${route_type}_${i}`;
    rows.push({
      row: startRow + i,
      route_key,
      generic_key: drug.generic_key,
      generic_uid: 'NULL', // Placeholder, as we don't have the UUID
      route_type,
      load_measure,
      load_dose,
      load_measure_2,
      load_reg,
      maintain_dose,
      maintain_measure,
      maintain_reg,
      montherapy,
      half_life,
    });
  }
  return rows;
}

function toSqlValue(val: string | number): string {
  if (val === 'NULL') return 'NULL';
  if (typeof val === 'number') return val.toString();
  return `'${val.replace(/'/g, "''")}'`;
}

function main(): void {
  const sql: string = fs.readFileSync(GENERIC_DRUGS_PATH, 'utf8');
  const drugs: GenericDrug[] = parseGenericDrugs(sql);
  let allRows: RouteRow[] = [];
  let rowCounter: number = 1;
  for (const drug of drugs) {
    const rows = generateRouteRows(drug, rowCounter);
    allRows = allRows.concat(rows);
    rowCounter += rows.length;
  }
  const columns = [
    'row',
    'route_key',
    'generic_key',
    'generic_uid',
    'route_type',
    'load_measure',
    'load_dose',
    'load_measure_2',
    'load_reg',
    'maintain_dose',
    'maintain_measure',
    'maintain_reg',
    'montherapy',
    'half_life',
  ];
  const values = allRows.map(row => `  (${columns.map(col => toSqlValue(row[col as keyof RouteRow])).join(', ')})`).join(',\n');
  const insert = `INSERT INTO generic_routes (${columns.join(', ')})\nVALUES\n${values};\n`;
  fs.writeFileSync(OUTPUT_PATH, insert, 'utf8');
  console.log(`Wrote ${allRows.length} rows to ${OUTPUT_PATH}`);
}

main(); 