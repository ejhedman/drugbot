// export {}; // Make this file a module to avoid global scope conflicts

// const fs = require('fs');
// const path = require('path');

// interface ParsedColumn {
//   name: string;
//   sqlType: string;
//   isId: boolean;
//   isKey: boolean;
//   isRequired: boolean;
//   isForeignKey: boolean;
//   referencesTable?: string;
//   referencesColumn?: string;
//   comment?: string;
// }

// interface ParsedTable {
//   name: string;
//   columns: ParsedColumn[];
//   comment?: string;
// }

// interface RelationshipInfo {
//   fromTable: string;
//   fromColumn: string;
//   toTable: string;
//   toColumn: string;
// }

// class DDLParser {
//   private ddlContent: string;
//   private tables: ParsedTable[] = [];
//   private relationships: RelationshipInfo[] = [];

//   constructor(ddlPath: string) {
//     this.ddlContent = fs.readFileSync(ddlPath, 'utf-8');
//   }

//   parse(): { tables: ParsedTable[], relationships: RelationshipInfo[] } {
//     this.parseTables();
//     this.parseRelationships();
//     return { tables: this.tables, relationships: this.relationships };
//   }

//   private parseTables(): void {
//     // Match CREATE TABLE statements
//     const tableRegex = /CREATE TABLE\s+(\w+)\s*\(([\s\S]*?)\);/gi;
//     let match;

//     while ((match = tableRegex.exec(this.ddlContent)) !== null) {
//       const tableName = match[1];
//       const columnDefinitions = match[2];
      
//       const table: ParsedTable = {
//         name: tableName,
//         columns: this.parseColumns(columnDefinitions)
//       };

//       // Look for table comment
//       const tableCommentRegex = new RegExp(`COMMENT ON TABLE ${tableName} IS '([^']*)'`, 'i');
//       const commentMatch = this.ddlContent.match(tableCommentRegex);
//       if (commentMatch) {
//         table.comment = commentMatch[1];
//       }

//       this.tables.push(table);
//     }
//   }

//   private parseColumns(columnDefinitions: string): ParsedColumn[] {
//     const columns: ParsedColumn[] = [];
    
//     // Split by comma, but be careful with commas inside DEFAULT expressions
//     const columnLines = columnDefinitions.split(/,(?=\s*\w+\s+)/);
    
//     for (const line of columnLines) {
//       const trimmed = line.trim();
//       if (!trimmed || trimmed.startsWith('--')) continue;

//       const column = this.parseColumn(trimmed);
//       if (column) {
//         columns.push(column);
//       }
//     }

//     return columns;
//   }

//   private parseColumn(columnDefinition: string): ParsedColumn | null {
//     // Match column definition: column_name TYPE [constraints]
//     const match = columnDefinition.match(/(\w+)\s+([\w\s\(\)]+)(\s+.*)?/);
//     if (!match) return null;

//     const [, name, baseType, constraints = ''] = match;
//     const fullDefinition = `${baseType}${constraints}`.trim();

//     const column: ParsedColumn = {
//       name,
//       sqlType: fullDefinition,
//       isId: false,
//       isKey: false,
//       isRequired: false,
//       isForeignKey: false
//     };

//     // Check for primary key
//     if (constraints.includes('PRIMARY KEY')) {
//       column.isId = true;
//     }

//     // Check for NOT NULL
//     if (constraints.includes('NOT NULL')) {
//       column.isRequired = true;
//     }

//     // Check for UNIQUE
//     if (constraints.includes('UNIQUE')) {
//       column.isKey = true;
//     }

//     // Check for foreign key references
//     const referencesMatch = constraints.match(/REFERENCES\s+(\w+)\s*\((\w+)\)/i);
//     if (referencesMatch) {
//       column.isForeignKey = true;
//       column.referencesTable = referencesMatch[1];
//       column.referencesColumn = referencesMatch[2];
//     }

//     // Determine if this looks like a key field based on naming conventions
//     if (name.endsWith('_key') && !column.isId) {
//       column.isKey = true;
//     }

//     return column;
//   }

//   private parseRelationships(): void {
//     // Parse ALTER TABLE ... ADD CONSTRAINT ... FOREIGN KEY statements
//     const fkRegex = /ALTER TABLE\s+(\w+)\s+ADD CONSTRAINT\s+\w+\s+FOREIGN KEY\s*\((\w+)\)\s+REFERENCES\s+(\w+)\s*\((\w+)\)/gi;
//     let match;

//     while ((match = fkRegex.exec(this.ddlContent)) !== null) {
//       this.relationships.push({
//         fromTable: match[1],
//         fromColumn: match[2],
//         toTable: match[3],
//         toColumn: match[4]
//       });
//     }
//   }

//   private getTypeMapping(sqlType: string): string {
//     const lowerType = sqlType.toLowerCase();
    
//     if (lowerType.includes('uuid')) return 'string';
//     if (lowerType.includes('varchar') || lowerType.includes('text')) return 'string';
//     if (lowerType.includes('integer') || lowerType.includes('int')) return 'number';
//     if (lowerType.includes('boolean') || lowerType.includes('bool')) return 'boolean';
//     if (lowerType.includes('date') || lowerType.includes('timestamp')) return 'date';
//     if (lowerType.includes('decimal') || lowerType.includes('numeric') || lowerType.includes('float')) return 'number';
    
//     return 'string'; // default
//   }

//   private generateDisplayName(fieldName: string): string {
//     return fieldName
//       .split('_')
//       .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//       .join(' ');
//   }

//   private getControlType(fieldName: string, sqlType: string): string {
//     const lowerType = sqlType.toLowerCase();
//     const lowerName = fieldName.toLowerCase();
    
//     if (lowerType.includes('date')) return 'date';
//     if (lowerType.includes('boolean') || lowerType.includes('bool')) return 'checkbox';
//     if (lowerType.includes('text') || lowerName.includes('description') || lowerName.includes('indication')) return 'textarea';
//     if (lowerType.includes('integer') || lowerType.includes('decimal') || lowerType.includes('numeric')) return 'number';
    
//     return 'text';
//   }

//   private getVisibility(column: ParsedColumn): 'visible' | 'hidden' | 'readonly' {
//     if (column.isId || column.name === 'row') return 'hidden';
//     if (column.isKey || column.name.endsWith('_uid')) return 'readonly';
//     return 'visible';
//   }

//   generateSchemaTemplate(): string {
//     const { tables } = this.parse();
    
//     // Filter out lookup tables for now
//     const mainTables = tables.filter(table => 
//       !['drug_classes', 'route_types', 'countries'].includes(table.name)
//     );

//     const schemas = mainTables.map(table => {
//       const entityName = table.name.replace(/s$/, ''); // Simple singularization
//       const displayName = this.generateDisplayName(entityName);
      
//       const fields = table.columns.map(column => {
//         const field = {
//           name: column.name,
//           type: this.getTypeMapping(column.sqlType),
//           sqlType: column.sqlType,
//           isId: column.isId,
//           isKey: column.isKey,
//           isRequired: column.isRequired,
//           ui: {
//             visibility: this.getVisibility(column),
//             displayName: this.generateDisplayName(column.name),
//             controlType: this.getControlType(column.name, column.sqlType),
//             placeholder: `Enter ${this.generateDisplayName(column.name).toLowerCase()}`
//           }
//         };

//         // Add validation for specific field types
//         if (column.name.endsWith('_date')) {
//           field.ui.controlType = 'date';
//         }
        
//         if (column.name === 'biosimilar') {
//           field.ui.controlType = 'checkbox';
//         }

//         return field;
//       }).filter(field => field.ui.visibility !== 'hidden' || field.isId);

//       // Determine relationships
//       const relationships = this.relationships
//         .filter(rel => rel.fromTable === table.name)
//         .map(rel => ({
//           type: '1-n' as const,
//           targetEntity: rel.toTable,
//           foreignKey: rel.fromColumn,
//           displayName: this.generateDisplayName(rel.toTable),
//           isCollection: false
//         }));

//       // Find child relationships (where this table is referenced)
//       const childRelationships = this.relationships
//         .filter(rel => rel.toTable === table.name)
//         .map(rel => ({
//           type: '1-n' as const,
//           targetEntity: rel.fromTable,
//           foreignKey: rel.fromColumn,
//           displayName: this.generateDisplayName(rel.fromTable),
//           isCollection: true
//         }));

//       // Generate tabs
//       const tabs: any[] = [
//         {
//           id: 'details',
//           displayName: 'Details',
//           type: 'properties' as const,
//           fields: fields.filter(f => f.ui.visibility === 'visible').map(f => f.name)
//         }
//       ];

//       // Add collection tabs for child relationships
//       childRelationships.forEach(rel => {
//         tabs.push({
//           id: rel.targetEntity,
//           displayName: rel.displayName,
//           type: 'collection' as const,
//           collectionEntity: rel.targetEntity
//         });
//       });

//       return {
//         name: entityName,
//         tableName: table.name,
//         displayName,
//         pluralName: this.generateDisplayName(table.name),
//         comment: table.comment,
//         fields,
//         relationships: [...relationships, ...childRelationships],
//         tabs
//       };
//     });

//     return this.formatSchemaOutput(schemas);
//   }

//   private formatSchemaOutput(schemas: any[]): string {
//     return `// Generated schema from DDL - ${new Date().toISOString()}
// // This is a template - you should review and customize the UI metadata

// export interface UIProperty {
//   name: string;
//   type: 'string' | 'number' | 'boolean' | 'date' | 'enum' | 'json';
//   sqlType?: string;
//   isId?: boolean;
//   isKey?: boolean;
//   isRequired?: boolean;
//   enumValues?: string[];
  
//   ui: {
//     visibility: 'visible' | 'hidden' | 'readonly';
//     displayName: string;
//     controlType: 'text' | 'textarea' | 'number' | 'date' | 'select' | 'checkbox';
//     placeholder?: string;
//     validation?: {
//       min?: number;
//       max?: number;
//       pattern?: string;
//       custom?: string;
//     };
//   };
// }

// export interface EntityRelationship {
//   type: '1-n' | 'm-n';
//   targetEntity: string;
//   foreignKey?: string;
//   junctionTable?: string;
//   displayName: string;
//   isCollection: boolean;
// }

// export interface EntityTab {
//   id: string;
//   displayName: string;
//   type: 'properties' | 'collection' | 'custom';
//   collectionEntity?: string;
//   fields?: string[];
//   customComponent?: string;
// }

// export interface EntitySchema {
//   name: string;
//   tableName: string;
//   displayName: string;
//   pluralName: string;
//   comment?: string;
//   fields: UIProperty[];
//   relationships: EntityRelationship[];
//   tabs: EntityTab[];
//   hierarchical?: {
//     parentField: string;
//     maxDepth?: number;
//   };
// }

// export const ENTITY_SCHEMAS: Record<string, EntitySchema> = {
// ${schemas.map(schema => `  ${uiEntity.name}: ${JSON.stringify(schema, null, 4).replace(/^/gm, '  ')}`).join(',\n')}
// };
// `;
//   }
// }

// // Usage
// function generateSchemaFromDDL() {
//   const ddlPath = path.join(process.cwd(), 'ddl/table_ddl.sql');
//   const parser = new DDLParser(ddlPath);
//   const schemaTemplate = parser.generateSchemaTemplate();
  
//   const outputPath = path.join(process.cwd(), 'src/lib/schema-generated.ts');
//   fs.writeFileSync(outputPath, schemaTemplate);
  
//   console.log(`Schema template generated at: ${outputPath}`);
//   console.log('Please review and customize the UI metadata before using.');
// }

// if (require.main === module) {
//   generateSchemaFromDDL();
// }

// module.exports = { DDLParser, generateSchemaFromDDL }; 