(function() {
  const fs = require('fs');
  const path = require('path');

  // Paths
  const GENERIC_DRUGS_PATH_ALIASES = path.join(__dirname, '../ddl/07a_generic_drugs.sql');
  const MANU_DRUGS_PATH_ALIASES = path.join(__dirname, '../ddl/07b_manu_drugs.sql');
  const OUTPUT_PATH_ALIASES = path.join(__dirname, '../ddl/07c_generic_aliases.sql');

  function randomIntAliases(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function randomChoiceAliases<T>(arr: T[]): T {
    return arr[randomIntAliases(0, arr.length - 1)];
  }

  // Common character swaps and replacements for realistic misspellings
  const VOWEL_SWAPS: { [key: string]: string[] } = {
    'a': ['e', 'i', 'o', 'u'],
    'e': ['a', 'i', 'o', 'u'],
    'i': ['a', 'e', 'o', 'u'],
    'o': ['a', 'e', 'i', 'u'],
    'u': ['a', 'e', 'i', 'o']
  };

  const CONSONANT_SWAPS: { [key: string]: string[] } = {
    'b': ['p', 'v'],
    'c': ['k', 's'],
    'd': ['t', 'th'],
    'f': ['ph', 'v'],
    'g': ['j', 'k'],
    'h': [''],
    'j': ['g', 'y'],
    'k': ['c', 'q'],
    'l': ['r'],
    'm': ['n'],
    'n': ['m'],
    'p': ['b', 'ph'],
    'q': ['k'],
    'r': ['l'],
    's': ['c', 'z'],
    't': ['d', 'th'],
    'v': ['b', 'f'],
    'w': [''],
    'x': ['ks'],
    'y': ['i'],
    'z': ['s']
  };

  const COMMON_DOUBLES = ['ll', 'mm', 'nn', 'pp', 'rr', 'ss', 'tt'];
  const COMMON_SINGLES = ['l', 'm', 'n', 'p', 'r', 's', 't'];

  function generateMisspellings(name: string): string[] {
    const misspellings: string[] = [];
    const maxMisspellings = randomIntAliases(3, 7);
    
    for (let i = 0; i < maxMisspellings; i++) {
      let misspelled = name;
      
      // Apply 1-3 random transformations
      const numTransformations = randomIntAliases(1, 3);
      
      for (let j = 0; j < numTransformations; j++) {
        const transformation = randomIntAliases(1, 4);
        
        switch (transformation) {
          case 1: // Vowel swap
            const vowels = 'aeiou';
            const vowelIndex = misspelled.search(/[aeiou]/i);
            if (vowelIndex !== -1) {
              const vowel = misspelled[vowelIndex].toLowerCase();
              const replacement = randomChoiceAliases(VOWEL_SWAPS[vowel] || [vowel]);
              misspelled = misspelled.slice(0, vowelIndex) + replacement + misspelled.slice(vowelIndex + 1);
            }
            break;
            
          case 2: // Consonant swap
            const consonants = 'bcdfghjklmnpqrstvwxyz';
            const consonantIndex = misspelled.search(/[bcdfghjklmnpqrstvwxyz]/i);
            if (consonantIndex !== -1) {
              const consonant = misspelled[consonantIndex].toLowerCase();
              const replacement = randomChoiceAliases(CONSONANT_SWAPS[consonant] || [consonant]);
              misspelled = misspelled.slice(0, consonantIndex) + replacement + misspelled.slice(consonantIndex + 1);
            }
            break;
            
          case 3: // Double to single
            const doubleIndex = misspelled.search(/ll|mm|nn|pp|rr|ss|tt/i);
            if (doubleIndex !== -1) {
              const double = misspelled.slice(doubleIndex, doubleIndex + 2).toLowerCase();
              const single = double[0];
              misspelled = misspelled.slice(0, doubleIndex) + single + misspelled.slice(doubleIndex + 2);
            }
            break;
            
          case 4: // Single to double
            const singleIndex = misspelled.search(/[lmnpst]/i);
            if (singleIndex !== -1) {
              const single = misspelled[singleIndex].toLowerCase();
              const double = single + single;
              misspelled = misspelled.slice(0, singleIndex) + double + misspelled.slice(singleIndex + 1);
            }
            break;
        }
      }
      
      // Ensure the misspelling is different from the original and not already generated
      if (misspelled.toLowerCase() !== name.toLowerCase() && !misspellings.includes(misspelled)) {
        misspellings.push(misspelled);
      }
    }
    
    return misspellings;
  }

  interface GenericDrugAliases {
    row: number;
    generic_key: string;
    generic_name: string;
    biologic: string;
    mech_of_action: string;
    class_or_type: string;
    target: string;
  }

  interface ManuDrugAliases {
    row: number;
    manu_drug_key: string;
    generic_key: string;
    generic_uid: string;
    drug_name: string;
    manufacturer: string;
    brandkey: string;
    biosimilar_suffix: string;
    biosimilar: number;
    biosimilar_originator: string;
  }

  function parseGenericDrugsAliases(sql: string): GenericDrugAliases[] {
    const regex = /\((\d+), '([^']+)', '([^']+)', '([^']+)', '([^']+)', '([^']+)', '([^']+)'\)/g;
    const drugs: GenericDrugAliases[] = [];
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

  function parseManuDrugsAliases(sql: string): ManuDrugAliases[] {
    const regex = /\((\d+), '([^']+)', '([^']+)', ([^,]+), '([^']+)', '([^']+)', '([^']+)', ([^,]+), (\d+), ([^)]+)\)/g;
    const drugs: ManuDrugAliases[] = [];
    let match: RegExpExecArray | null;
    while ((match = regex.exec(sql)) !== null) {
      drugs.push({
        row: Number(match[1]),
        manu_drug_key: match[2],
        generic_key: match[3],
        generic_uid: match[4],
        drug_name: match[5],
        manufacturer: match[6],
        brandkey: match[7],
        biosimilar_suffix: match[8],
        biosimilar: Number(match[9]),
        biosimilar_originator: match[10],
      });
    }
    return drugs;
  }

  type AliasRow = {
    row: number;
    generic_key: string;
    generic_uid: string;
    alias: string;
  };

  function generateAliasRows(drug: GenericDrugAliases, manuDrugs: ManuDrugAliases[], startRow: number): AliasRow[] {
    const rows: AliasRow[] = [];
    let rowCounter = startRow;
    
    // 1. Add the generic name as an alias
    rows.push({
      row: rowCounter++,
      generic_key: drug.generic_key,
      generic_uid: 'NULL',
      alias: drug.generic_name,
    });
    
    // 2. Add brand names for this generic
    const brandNames = manuDrugs
      .filter(md => md.generic_key === drug.generic_key)
      .map(md => md.brandkey);
    
    for (const brandName of brandNames) {
      rows.push({
        row: rowCounter++,
        generic_key: drug.generic_key,
        generic_uid: 'NULL',
        alias: brandName.charAt(0).toUpperCase() + brandName.slice(1), // Capitalize
      });
    }
    
    // 3. Generate misspellings
    const misspellings = generateMisspellings(drug.generic_name);
    for (const misspelling of misspellings) {
      rows.push({
        row: rowCounter++,
        generic_key: drug.generic_key,
        generic_uid: 'NULL',
        alias: misspelling,
      });
    }
    
    return rows;
  }

  function toSqlValueAliases(val: string | number): string {
    if (val === 'NULL' || val === '') return 'NULL';
    if (typeof val === 'number') return val.toString();
    return `'${val.replace(/'/g, "''")}'`;
  }

  function mainAliases(): void {
    const genericSql: string = fs.readFileSync(GENERIC_DRUGS_PATH_ALIASES, 'utf8');
    const manuSql: string = fs.readFileSync(MANU_DRUGS_PATH_ALIASES, 'utf8');
    
    const drugs: GenericDrugAliases[] = parseGenericDrugsAliases(genericSql);
    const manuDrugs: ManuDrugAliases[] = parseManuDrugsAliases(manuSql);
    
    let allRows: AliasRow[] = [];
    let rowCounter: number = 1;
    
    for (const drug of drugs) {
      const rows = generateAliasRows(drug, manuDrugs, rowCounter);
      allRows = allRows.concat(rows);
      rowCounter += rows.length;
    }
    
    const columns = [
      'row',
      'generic_key',
      'generic_uid',
      'alias',
    ];
    
    const values = allRows.map(row => `  (${columns.map(col => toSqlValueAliases(row[col as keyof AliasRow])).join(', ')})`).join(',\n');
    const insert = `INSERT INTO generic_aliases (${columns.join(', ')})\nVALUES\n${values};\n`;
    
    fs.writeFileSync(OUTPUT_PATH_ALIASES, insert, 'utf8');
    console.log(`Wrote ${allRows.length} rows to ${OUTPUT_PATH_ALIASES}`);
  }

  mainAliases();
})(); 