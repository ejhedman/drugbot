-- =============================================
-- Setup script for select_lists table
-- Run this script to create the select_lists table and add sample data
-- =============================================

-- Run the table creation script
\i ddl/11_select_lists_table.sql

-- Insert sample select lists
INSERT INTO select_lists (name, display_name, owner_uid, is_public, items) VALUES
(
  'drug_categories',
  'Drug Categories',
  'your-user-id-here', -- Replace with actual user ID
  true,
  '[
    {"text": "Analgesic", "code": "analgesic", "ordinal": 0},
    {"text": "Antibiotic", "code": "antibiotic", "ordinal": 1},
    {"text": "Antiviral", "code": "antiviral", "ordinal": 2},
    {"text": "Antifungal", "code": "antifungal", "ordinal": 3},
    {"text": "Anti-inflammatory", "code": "anti_inflammatory", "ordinal": 4},
    {"text": "Cardiovascular", "code": "cardiovascular", "ordinal": 5},
    {"text": "Central Nervous System", "code": "cns", "ordinal": 6},
    {"text": "Endocrine", "code": "endocrin", "ordinal": 7},
    {"text": "Gastrointestinal", "code": "gi", "ordinal": 8},
    {"text": "Respiratory", "code": "respiratory", "ordinal": 9}
  ]'::jsonb
),
(
  'route_types',
  'Route Types',
  'your-user-id-here', -- Replace with actual user ID
  true,
  '[
    {"text": "Oral", "code": "oral", "ordinal": 0},
    {"text": "Intravenous", "code": "iv", "ordinal": 1},
    {"text": "Intramuscular", "code": "im", "ordinal": 2},
    {"text": "Subcutaneous", "code": "sc", "ordinal": 3},
    {"text": "Topical", "code": "topical", "ordinal": 4},
    {"text": "Inhalation", "code": "inhalation", "ordinal": 5},
    {"text": "Rectal", "code": "rectal", "ordinal": 6},
    {"text": "Ophthalmic", "code": "ophthalmic", "ordinal": 7},
    {"text": "Otic", "code": "otic", "ordinal": 8},
    {"text": "Nasal", "code": "nasal", "ordinal": 9}
  ]'::jsonb
),
(
  'manufacturers',
  'Manufacturers',
  'your-user-id-here', -- Replace with actual user ID
  false,
  '[
    {"text": "Pfizer", "code": "pfizer", "ordinal": 0},
    {"text": "Johnson & Johnson", "code": "jnj", "ordinal": 1},
    {"text": "Roche", "code": "roche", "ordinal": 2},
    {"text": "Novartis", "code": "novartis", "ordinal": 3},
    {"text": "Merck", "code": "merck", "ordinal": 4},
    {"text": "GlaxoSmithKline", "code": "gsk", "ordinal": 5},
    {"text": "AstraZeneca", "code": "astrazeneca", "ordinal": 6},
    {"text": "Sanofi", "code": "sanofi", "ordinal": 7},
    {"text": "Bayer", "code": "bayer", "ordinal": 8},
    {"text": "Eli Lilly", "code": "eli_lilly", "ordinal": 9}
  ]'::jsonb
);

-- Verify the data was inserted
SELECT 
  name, 
  display_name, 
  is_public, 
  jsonb_array_length(items) as item_count,
  created_at
FROM select_lists 
ORDER BY created_at; 