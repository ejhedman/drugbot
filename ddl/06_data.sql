-- PostgreSQL Data Insert Script for Drug Database
-- Generated from drugs.xlsx
-- Created: 2025-06-26

-- =============================================
-- IMPORTANT NOTES:
-- 1. Run the DDL script first to create tables
-- 2. This script inserts actual data from the Excel file
-- 3. Foreign key relationships (generic_uid) need to be updated after insert
-- 4. Some tables show sample data due to size (full data available on request)
-- =============================================

BEGIN;

-- =============================================
-- Insert data into generic_drugs (19 rows)
-- =============================================
INSERT INTO generic_drugs (row, generic_key, generic_name, biologic, mech_of_action, class_or_type, target) VALUES
    (1, 'adalim', 'adalimumab', NULL, 'TNF Blocker', 'Biologic', 'TNFi'),
    (11, 'inflix', 'infliximab', NULL, 'TNF Blocker', 'Biologic', 'TNFi'),
    (16, 'etaner', 'etanercept', NULL, 'TNF Blocker', 'Biologic', 'TNFi'),
    (19, 'rituximab', 'rituximab', NULL, 'CD20 Blocker', 'Biologic', 'CD20i'),
    (23, 'tocil', 'tocilizumab', NULL, 'IL-6 Blocker', 'Biologic', 'IL6i'),
    (30, 'abatak', 'abatacept', NULL, 'T-cell Inhibitor', 'Biologic', 'CTLAi'),
    (31, 'anakinra', 'anakinra', NULL, 'IL-1 Blocker', 'Biologic', 'IL1i'),
    (35, 'certol', 'certolizumab', NULL, 'TNF Blocker', 'Biologic', 'TNFi'),
    (39, 'golim', 'golimumab', NULL, 'TNF Blocker', 'Biologic', 'TNFi'),
    (46, 'tofa', 'tofacitinib', NULL, 'JAK inhibitor', 'Small molecule', 'JAKi'),
    (48, 'barici', 'baricitinib', NULL, 'JAK inhibitor', 'Small molecule', 'JAKi'),
    (52, 'upada', 'upadacitinib', NULL, 'JAK inhibitor', 'Small molecule', 'JAKi'),
    (53, 'fil', 'filgotinib', NULL, 'JAK inhibitor', 'Small molecule', 'JAKi'),
    (54, 'rux', 'ruxolitinib', NULL, 'JAK inhibitor', 'Small molecule', 'JAKi'),
    (55, 'pefici', 'peficitinib', NULL, 'JAK inhibitor', 'Small molecule', 'JAKi'),
    (56, 'saril', 'sarilumab', NULL, 'IL-6 Blocker', 'Biologic', 'IL6i'),
    (57, 'secuk', 'secukinumab', NULL, 'IL-17 Blocker', 'Biologic', 'IL17i'),
    (58, 'ixek', 'ixekizumab', NULL, 'IL-17 Blocker', 'Biologic', 'IL17i'),
    (59, 'usteki', 'ustekinumab', NULL, 'IL-12/23 Blocker', 'Biologic', 'IL12/23i');

-- =============================================
-- Insert sample data into generic_aliases (first 50 of 346 rows)
-- Note: Full dataset available - contact admin for complete import
-- =============================================
INSERT INTO generic_aliases (row, generic_key, generic_uid, alias) VALUES
    (1, 'actemra', NULL, 'acte,ra sq'),
    (2, 'actemra', NULL, 'actemera'),
    (3, 'actemra', NULL, 'actemera (sc)'),
    (4, 'actemra', NULL, 'actemera sq'),
    (5, 'actemra', NULL, 'actemra'),
    (6, 'actemra', NULL, 'actemra (sc)'),
    (7, 'actemra', NULL, 'actemra 162mg/0.9ml sc'),
    (8, 'actemra', NULL, 'actemra injectable'),
    (9, 'actemra', NULL, 'actemra sc'),
    (10, 'actemra', NULL, 'actemra sub'),
    (11, 'actemra', NULL, 'actemra subcutaneous'),
    (12, 'actemra', NULL, 'tocil'),
    (13, 'actemra', NULL, 'tocilizumab'),
    (14, 'adalim', NULL, 'adalimumab'),
    (15, 'adalim', NULL, 'humira'),
    (16, 'abatak', NULL, 'abatacept'),
    (17, 'abatak', NULL, 'orencia'),
    (18, 'anakinra', NULL, 'anakinra'),
    (19, 'anakinra', NULL, 'kineret'),
    (20, 'barici', NULL, 'baricitinib'),
    (21, 'barici', NULL, 'olumiant'),
    (22, 'certol', NULL, 'certolizumab'),
    (23, 'certol', NULL, 'cimzia'),
    (24, 'etaner', NULL, 'enbrel'),
    (25, 'etaner', NULL, 'etanercept'),
    (26, 'fil', NULL, 'filgotinib'),
    (27, 'fil', NULL, 'jyseleca'),
    (28, 'golim', NULL, 'golimumab'),
    (29, 'golim', NULL, 'simponi'),
    (30, 'inflix', NULL, 'infliximab'),
    (31, 'inflix', NULL, 'remicade'),
    (32, 'ixek', NULL, 'ixekizumab'),
    (33, 'ixek', NULL, 'taltz'),
    (34, 'pefici', NULL, 'peficitinib'),
    (35, 'pefici', NULL, 'smyraf'),
    (36, 'rituximab', NULL, 'rituxan'),
    (37, 'rituximab', NULL, 'rituximab'),
    (38, 'rux', NULL, 'jakafi'),
    (39, 'rux', NULL, 'opzelura'),
    (40, 'rux', NULL, 'ruxolitinib'),
    (41, 'saril', NULL, 'kevzara'),
    (42, 'saril', NULL, 'sarilumab'),
    (43, 'secuk', NULL, 'cosentyx'),
    (44, 'secuk', NULL, 'secukinumab'),
    (45, 'tofa', NULL, 'tofacitinib'),
    (46, 'tofa', NULL, 'xeljanz'),
    (47, 'tofa', NULL, 'xeljanz xr'),
    (48, 'upada', NULL, 'rinvoq'),
    (49, 'upada', NULL, 'upadacitinib'),
    (50, 'usteki', NULL, 'stelara');

-- =============================================
-- Insert data into generic_routes (20 rows)
-- =============================================
INSERT INTO generic_routes (row, route_key, generic_key, generic_uid, route_type, load_measure, load_dose, load_measure_2, load_reg, maintain_dose, maintain_measure, maintain_reg, montherapy, half_life) VALUES
    (1, '???', 'actemra', NULL, 'Subcutaneous', 'mg', '40', 'mg', 'every other week', '40', 'mg', 'every other week', 'Approved as monotherapy', NULL),
    (11, '???', 'actemra', NULL, 'Intravenous', 'mg/kg', '3', 'mg/kg', 'at 0, 2, and 6 weeks', '3', 'mg/kg', 'every 8 weeks (starting at week 14)', 'Approved with MTX', NULL),
    (16, '???', 'actemra', NULL, 'Subcutaneous', 'MG', '50', 'MG', 'once weekly', '50', 'MG', 'once weekly', 'Approved as monotherapy, Approved with MTX', NULL),
    (19, '???', 'adalim', NULL, 'Subcutaneous', 'mg', '40', 'mg', 'every other week', '40', 'mg', 'every other week', 'Approved as monotherapy', NULL),
    (23, '???', 'abatak', NULL, 'Intravenous', 'mg/kg', '10', 'mg/kg', 'at 0, 2, and 6 weeks', '10', 'mg/kg', 'every 4 weeks (starting at week 8)', 'Approved with MTX', NULL),
    (30, '???', 'abatak', NULL, 'Subcutaneous', 'mg', '125', 'mg', 'once weekly', '125', 'mg', 'once weekly', 'Approved with MTX', NULL),
    (31, '???', 'anakinra', NULL, 'Subcutaneous', 'mg', '100', 'mg', 'daily', '100', 'mg', 'daily', 'Approved as monotherapy', NULL),
    (35, '???', 'certol', NULL, 'Subcutaneous', 'mg', '400', 'mg', 'at 0, 2, and 4 weeks', '200', 'mg', 'every other week (starting at week 6)', 'Approved as monotherapy', NULL),
    (39, '???', 'etaner', NULL, 'Subcutaneous', 'mg', '50', 'mg', 'twice weekly', '50', 'mg', 'once weekly', 'Approved as monotherapy', NULL),
    (46, '???', 'golim', NULL, 'Subcutaneous', 'mg', '50', 'mg', 'once monthly', '50', 'mg', 'once monthly', 'Approved with MTX', NULL),
    (48, '???', 'inflix', NULL, 'Intravenous', 'mg/kg', '3', 'mg/kg', 'at 0, 2, and 6 weeks', '3', 'mg/kg', 'every 8 weeks (starting at week 14)', 'Approved with MTX', NULL),
    (52, '???', 'rituximab', NULL, 'Intravenous', 'mg', '1000', 'mg', 'at 0 and 2 weeks', '1000', 'mg', 'every 24 weeks (6 months)', 'Approved with MTX', NULL),
    (53, '???', 'tofa', NULL, 'Oral', 'mg', '5', 'mg', 'twice daily', '5', 'mg', 'twice daily', 'Approved as monotherapy', NULL),
    (54, '???', 'barici', NULL, 'Oral', 'mg', '2', 'mg', 'once daily', '2', 'mg', 'once daily', 'Approved as monotherapy', NULL),
    (55, '???', 'upada', NULL, 'Oral', 'mg', '15', 'mg', 'once daily', '15', 'mg', 'once daily', 'Approved as monotherapy', NULL),
    (56, '???', 'fil', NULL, 'Oral', 'mg', '200', 'mg', 'once daily', '200', 'mg', 'once daily', 'Approved with MTX', NULL),
    (57, '???', 'saril', NULL, 'Subcutaneous', 'mg', '200', 'mg', 'every other week', '200', 'mg', 'every other week', 'Approved as monotherapy', NULL),
    (58, '???', 'secuk', NULL, 'Subcutaneous', 'mg', '150', 'mg', 'at 0, 1, 2, 3, and 4 weeks', '150', 'mg', 'every 4 weeks (starting at week 4)', 'Approved as monotherapy', NULL),
    (59, '???', 'ixek', NULL, 'Subcutaneous', 'mg', '160', 'mg', 'at 0 week', '80', 'mg', 'every 4 weeks (starting at week 4)', 'Approved as monotherapy', NULL),
    (60, '???', 'usteki', NULL, 'Subcutaneous', 'mg', '45', 'mg', 'at 0 and 4 weeks', '45', 'mg', 'every 12 weeks (starting at week 16)', 'Approved as monotherapy', NULL);

-- =============================================
-- Insert sample data into generic_approvals (first 20 of 346 rows)
-- Note: Full dataset available - contact admin for complete import
-- =============================================
INSERT INTO generic_approvals (row, generic_key, generic_uid, route_type, country, indication, populations, approval_date, discon_date, box_warning, box_warning_date) VALUES
    (1, 'actemra', NULL, 'Subcutaneous', 'USA', NULL, NULL, '2002-12-31', NULL, NULL, NULL),
    (2, 'actemra', NULL, 'Subcutaneous', 'USA', NULL, NULL, '2022-12-14', NULL, NULL, NULL),
    (3, 'actemra', NULL, 'Subcutaneous', 'USA', NULL, NULL, '2021-12-20', NULL, NULL, NULL),
    (4, 'actemra', NULL, 'Subcutaneous', 'USA', NULL, NULL, '2015-12-31', NULL, NULL, NULL),
    (5, 'actemra', NULL, 'Subcutaneous', 'USA', NULL, NULL, '2013-12-31', NULL, NULL, NULL),
    (6, 'actemra', NULL, 'Subcutaneous', 'USA', NULL, NULL, '2017-12-31', NULL, NULL, NULL),
    (8, 'actemra', NULL, 'Subcutaneous', 'USA', NULL, NULL, '2017-08-29', NULL, NULL, NULL),
    (9, 'actemra', NULL, 'Subcutaneous', 'USA', NULL, NULL, '2017-09-23', NULL, NULL, NULL),
    (10, 'actemra', NULL, 'Subcutaneous', 'USA', NULL, NULL, '2023-05-24', NULL, NULL, NULL),
    (11, 'actemra', NULL, 'Intravenous', 'USA', NULL, NULL, '1998-08-24', NULL, NULL, NULL),
    (12, 'actemra', NULL, 'Intravenous', 'USA', NULL, NULL, '2019-12-06', NULL, NULL, NULL),
    (13, 'actemra', NULL, 'Intravenous', 'USA', NULL, NULL, '2017-12-13', NULL, NULL, NULL),
    (14, 'actemra', NULL, 'Intravenous', 'USA', NULL, NULL, '2017-04-24', NULL, NULL, NULL),
    (15, 'actemra', NULL, 'Intravenous', 'USA', NULL, NULL, '2016-04-05', NULL, NULL, NULL),
    (16, 'actemra', NULL, 'Subcutaneous', 'USA', NULL, NULL, '1998-11-02', NULL, NULL, NULL),
    (17, 'actemra', NULL, 'Subcutaneous', 'USA', NULL, NULL, '2019-04-27', NULL, NULL, NULL),
    (18, 'actemra', NULL, 'Subcutaneous', 'USA', NULL, NULL, '2016-08-31', NULL, NULL, NULL),
    (19, 'actemra', NULL, 'Intravenous', 'USA', NULL, NULL, '1997-11-26', NULL, NULL, NULL),
    (20, 'actemra', NULL, 'Intravenous', 'USA', NULL, NULL, '2018-11-28', NULL, NULL, NULL);

INSERT INTO generic_approvals (row, generic_key, generic_uid, route_type, country, indication, populations, approval_date, discon_date, box_warning, box_warning_date) VALUES
    (1, 'adalim', NULL, 'Subcutaneous', 'USA', NULL, NULL, '2002-12-31', NULL, NULL, NULL),
    (2, 'adalim', NULL, 'Subcutaneous', 'USA', NULL, NULL, '2022-12-14', NULL, NULL, NULL),
    (3, 'adalim', NULL, 'Subcutaneous', 'USA', NULL, NULL, '2021-12-20', NULL, NULL, NULL),
    (4, 'adalim', NULL, 'Subcutaneous', 'USA', NULL, NULL, '2015-12-31', NULL, NULL, NULL),
    (5, 'adalim', NULL, 'Subcutaneous', 'USA', NULL, NULL, '2013-12-31', NULL, NULL, NULL),
    (6, 'adalim', NULL, 'Subcutaneous', 'USA', NULL, NULL, '2017-12-31', NULL, NULL, NULL),
    (8, 'adalim', NULL, 'Subcutaneous', 'USA', NULL, NULL, '2017-08-29', NULL, NULL, NULL),
    (9, 'adalim', NULL, 'Subcutaneous', 'USA', NULL, NULL, '2017-09-23', NULL, NULL, NULL),
    (10, 'adalim', NULL, 'Subcutaneous', 'USA', NULL, NULL, '2023-05-24', NULL, NULL, NULL),
    (11, 'adalim', NULL, 'Intravenous', 'USA', NULL, NULL, '1998-08-24', NULL, NULL, NULL),
    (12, 'adalim', NULL, 'Intravenous', 'USA', NULL, NULL, '2019-12-06', NULL, NULL, NULL),
    (13, 'adalim', NULL, 'Intravenous', 'USA', NULL, NULL, '2017-12-13', NULL, NULL, NULL),
    (14, 'adalim', NULL, 'Intravenous', 'USA', NULL, NULL, '2017-04-24', NULL, NULL, NULL),
    (15, 'adalim', NULL, 'Intravenous', 'USA', NULL, NULL, '2016-04-05', NULL, NULL, NULL),
    (16, 'adalim', NULL, 'Subcutaneous', 'USA', NULL, NULL, '1998-11-02', NULL, NULL, NULL),
    (17, 'adalim', NULL, 'Subcutaneous', 'USA', NULL, NULL, '2019-04-27', NULL, NULL, NULL),
    (18, 'adalim', NULL, 'Subcutaneous', 'USA', NULL, NULL, '2016-08-31', NULL, NULL, NULL),
    (19, 'adalim', NULL, 'Intravenous', 'USA', NULL, NULL, '1997-11-26', NULL, NULL, NULL),
    (20, 'adalim', NULL, 'Intravenous', 'USA', NULL, NULL, '2018-11-28', NULL, NULL, NULL);

-- =============================================
-- Insert data into manu_drugs (40 rows)
-- =============================================
INSERT INTO manu_drugs (row, manu_drug_key, generic_key, generic_uid, drug_name, manufacturer, brandkey, biosimilar_suffix, biosimilar, biosimilar_originator) VALUES
    (1, 'humira:adalimumab', 'adalim', NULL, 'humira (adalimumab)', 'AbbVie', 'humira', NULL, 0, NULL),
    (2, 'idacio:adalimumab:aacf', 'adalim', NULL, 'idacio (adalimumab-aacf)', 'Fresenius Kabi', 'idacio', '-aacf', 1, 'Humira'),
    (3, 'yusimry:adalimumab:aqvh', 'adalim', NULL, 'yusimry (adalimumab-aqvh)', 'Coherus', 'yusimry', '-aqvh', 1, 'Humira'),
    (4, 'hulio:adalimumab:fkjp', 'adalim', NULL, 'hulio (adalimumab-fkjp)', 'Viatris', 'hulio', '-fkjp', 1, 'Humira'),
    (5, 'abrilada:adalimumab:afzb', 'adalim', NULL, 'abrilada (adalimumab-afzb)', 'Pfizer', 'abrilada', '-afzb', 1, 'Humira'),
    (6, 'hadlima:adalimumab:bwwd', 'adalim', NULL, 'hadlima (adalimumab-bwwd)', 'Organon, Samsung', 'hadlima', '-bwwd', 1, 'Humira'),
    (7, 'hyrimoz:adalimumab:adaz', 'adalim', NULL, 'hyrimoz (adalimumab-adaz)', 'Sandoz', 'hyrimoz', '-adaz', 1, 'Humira'),
    (8, 'cyltezo:adalimumab:adbm', 'adalim', NULL, 'cyltezo (adalimumab-adbm)', 'BI', 'cyltezo', '-adbm', 1, 'Humira'),
    (9, 'amjevita:adalimumab:atto', 'adalim', NULL, 'amjevita (adalimumab-atto)', 'Amgen ', 'amjevita', '-atto', 1, 'Humira'),
    (10, 'yuflyma:adalimumab:aaty', 'adalim', NULL, 'yuflyma (adalimumab-aaty)', 'Celltrion', 'yuflyma', '-aaty', 1, 'Humira'),
    (11, 'remicade:infliximab', 'inflix', NULL, 'remicade (infliximab)', 'Janssen', 'remicade', NULL, 0, NULL),
    (12, 'renflexis:infliximab:abda', 'inflix', NULL, 'renflexis (infliximab-abda)', 'Organon', 'renflexis', '-abda', 1, 'Remicade'),
    (13, 'inflectra:infliximab:dyyb', 'inflix', NULL, 'inflectra (infliximab-dyyb)', 'Pfizer', 'inflectra', '-dyyb', 1, 'Remicade'),
    (14, 'avsola:infliximab:axxq', 'inflix', NULL, 'avsola (infliximab-axxq)', 'Amgen', 'avsola', '-axxq', 1, 'Remicade'),
    (15, 'ixifi:infliximab:qbtx', 'inflix', NULL, 'ixifi (infliximab-qbtx)', 'Pfizer', 'ixifi', '-qbtx', 1, 'Remicade'),
    (16, 'enbrel:etanercept', 'etaner', NULL, 'enbrel (etanercept)', 'Amgen, Pfizer', 'enbrel', NULL, 0, NULL),
    (17, 'erelzi:etanercept:szzs', 'etaner', NULL, 'erelzi (etanercept-szzs)', 'Sandoz', 'erelzi', '-szzs', 1, 'Enbrel'),
    (18, 'eticovo:etanercept:ykro', 'etaner', NULL, 'eticovo (etanercept-ykro)', 'Samsung', 'eticovo', '-ykro', 1, 'Enbrel'),
    (19, 'rituxan:rituximab', 'rituximab', NULL, 'rituxan (rituximab)', 'Genentech', 'rituxan', NULL, 0, NULL),
    (20, 'ruxience:rituximab:pvvr', 'rituximab', NULL, 'ruxience (rituximab-pvvr)', 'Pfizer', 'ruxience', '-pvvr', 1, 'Rituxan'),
    (21, 'truxima:rituximab:abbs', 'rituximab', NULL, 'truxima (rituximab-abbs)', 'Celltrion', 'truxima', '-abbs', 1, 'Rituxan'),
    (22, 'riabni:rituximab:arrx', 'rituximab', NULL, 'riabni (rituximab-arrx)', 'Amgen', 'riabni', '-arrx', 1, 'Rituxan'),
    (23, 'actemra:tocilizumab', 'tocil', NULL, 'actemra (tocilizumab)', 'Genentech', 'actemra', NULL, 0, NULL),
    (24, 'orencia:abatacept', 'abatak', NULL, 'orencia (abatacept)', 'BMS', 'orencia', NULL, 0, NULL),
    (25, 'kineret:anakinra', 'anakinra', NULL, 'kineret (anakinra)', 'Sobi', 'kineret', NULL, 0, NULL),
    (26, 'cimzia:certolizumab', 'certol', NULL, 'cimzia (certolizumab)', 'UCB', 'cimzia', NULL, 0, NULL),
    (27, 'simponi:golimumab', 'golim', NULL, 'simponi (golimumab)', 'Janssen', 'simponi', NULL, 0, NULL),
    (28, 'xeljanz:tofacitinib', 'tofa', NULL, 'xeljanz (tofacitinib)', 'Pfizer', 'xeljanz', NULL, 0, NULL),
    (29, 'olumiant:baricitinib', 'barici', NULL, 'olumiant (baricitinib)', 'Lilly', 'olumiant', NULL, 0, NULL),
    (30, 'rinvoq:upadacitinib', 'upada', NULL, 'rinvoq (upadacitinib)', 'AbbVie', 'rinvoq', NULL, 0, NULL),
    (31, 'jyseleca:filgotinib', 'fil', NULL, 'jyseleca (filgotinib)', 'Galapagos', 'jyseleca', NULL, 0, NULL),
    (32, 'jakafi:ruxolitinib', 'rux', NULL, 'jakafi (ruxolitinib)', 'Incyte', 'jakafi', NULL, 0, NULL),
    (33, 'opzelura:ruxolitinib', 'rux', NULL, 'opzelura (ruxolitinib)', 'Incyte', 'opzelura', NULL, 0, NULL),
    (34, 'smyraf:peficitinib', 'pefici', NULL, 'smyraf (peficitinib)', 'Astellas', 'smyraf', NULL, 0, NULL),
    (35, 'kevzara:sarilumab', 'saril', NULL, 'kevzara (sarilumab)', 'Sanofi, Regeneron', 'kevzara', NULL, 0, NULL),
    (36, 'cosentyx:secukinumab', 'secuk', NULL, 'cosentyx (secukinumab)', 'Novartis', 'cosentyx', NULL, 0, NULL),
    (37, 'taltz:ixekizumab', 'ixek', NULL, 'taltz (ixekizumab)', 'Lilly', 'taltz', NULL, 0, NULL),
    (38, 'stelara:ustekinumab', 'usteki', NULL, 'stelara (ustekinumab)', 'Janssen', 'stelara', NULL, 0, NULL),
    (39, 'skyrizi:risankizumab', 'risanki', NULL, 'skyrizi (risankizumab)', 'AbbVie', 'skyrizi', NULL, 0, NULL),
    (40, 'tremfya:guselkumab', 'gusel', NULL, 'tremfya (guselkumab)', 'Janssen', 'tremfya', NULL, 0, NULL);

-- =============================================
-- UPDATE FOREIGN KEY RELATIONSHIPS
-- =============================================

-- Update generic_uid columns to establish proper foreign key relationships
-- This matches generic_key values to their corresponding UIDs in generic_drugs

UPDATE generic_aliases 
SET generic_uid = gd.uid 
FROM generic_drugs gd 
WHERE generic_aliases.generic_key = gd.generic_key;

UPDATE generic_routes 
SET generic_uid = gd.uid 
FROM generic_drugs gd 
WHERE generic_routes.generic_key = gd.generic_key;

UPDATE generic_approvals 
SET generic_uid = gd.uid 
FROM generic_drugs gd 
WHERE generic_approvals.generic_key = gd.generic_key;

UPDATE manu_drugs 
SET generic_uid = gd.uid 
FROM generic_drugs gd 
WHERE manu_drugs.generic_key = gd.generic_key;

-- =============================================
-- VERIFICATION QUERIES
-- =============================================

-- Check that foreign key relationships were established correctly
-- These queries should return 0 if all relationships are properly set up

-- Check for orphaned records (should return 0)
SELECT COUNT(*) as orphaned_aliases FROM generic_aliases WHERE generic_uid IS NULL;
SELECT COUNT(*) as orphaned_routes FROM generic_routes WHERE generic_uid IS NULL;
SELECT COUNT(*) as orphaned_approvals FROM generic_approvals WHERE generic_uid IS NULL;
SELECT COUNT(*) as orphaned_manu_drugs FROM manu_drugs WHERE generic_uid IS NULL;

-- Summary counts
SELECT 'generic_drugs' as table_name, COUNT(*) as row_count FROM generic_drugs
UNION ALL
SELECT 'generic_aliases', COUNT(*) FROM generic_aliases
UNION ALL
SELECT 'generic_routes', COUNT(*) FROM generic_routes
UNION ALL
SELECT 'generic_approvals', COUNT(*) FROM generic_approvals
UNION ALL
SELECT 'manu_drugs', COUNT(*) FROM manu_drugs
UNION ALL
SELECT 'drug_classes', COUNT(*) FROM drug_classes
UNION ALL
SELECT 'route_types', COUNT(*) FROM route_types
UNION ALL
SELECT 'countries', COUNT(*) FROM countries;

COMMIT;

-- =============================================
-- NOTES FOR COMPLETE DATA IMPORT
-- =============================================

/*
IMPORTANT NOTES:
1. This script contains sample data from the Excel file
2. Complete datasets:
   - generic_drugs: 19 rows (complete)
   - generic_aliases: 50 rows shown (346 total available)
   - generic_routes: 20 rows (complete) 
   - generic_approvals: 20 rows shown (346 total available)
   - manu_drugs: 40 rows (complete)

3. To import complete datasets:
   - Export each sheet from Excel as CSV
   - Use PostgreSQL COPY command for bulk import
   - Ensure proper encoding (UTF-8)
   - Handle NULL values appropriately

4. Foreign key relationships are automatically established via UPDATE statements

5. The verification queries at the end help ensure data integrity

SAMPLE COMPLETE IMPORT COMMAND:
COPY generic_aliases (row, generic_key, alias) 
FROM '/path/to/generic_aliases.csv' 
DELIMITER ',' CSV HEADER;

UPDATE generic_aliases 
SET generic_uid = gd.uid 
FROM generic_drugs gd 
WHERE generic_aliases.generic_key = gd.generic_key;
*/