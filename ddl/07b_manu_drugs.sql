-- Demo Data: Manufactured Drugs (1-20 per generic drug)
-- Run after generic_drugs insert

BEGIN;

-- Adalimumab manufactured drugs
INSERT INTO manu_drugs (row, manu_drug_key, generic_key, generic_uid, drug_name, manufacturer, brandkey, biosimilar_suffix, biosimilar, biosimilar_originator) VALUES
    (1, 'humira:adalimumab', 'adalimumab', NULL, 'Humira (adalimumab)', 'AbbVie', 'humira', NULL, 0, NULL),
    (2, 'idacio:adalimumab:aacf', 'adalimumab', NULL, 'Idacio (adalimumab-aacf)', 'Fresenius Kabi', 'idacio', '-aacf', 1, 'Humira'),
    (3, 'yusimry:adalimumab:aqvh', 'adalimumab', NULL, 'Yusimry (adalimumab-aqvh)', 'Coherus', 'yusimry', '-aqvh', 1, 'Humira'),
    (4, 'hulio:adalimumab:fkjp', 'adalimumab', NULL, 'Hulio (adalimumab-fkjp)', 'Viatris', 'hulio', '-fkjp', 1, 'Humira'),
    (5, 'abrilada:adalimumab:afzb', 'adalimumab', NULL, 'Abrilada (adalimumab-afzb)', 'Pfizer', 'abrilada', '-afzb', 1, 'Humira'),
    (6, 'hadlima:adalimumab:bwwd', 'adalimumab', NULL, 'Hadlima (adalimumab-bwwd)', 'Organon', 'hadlima', '-bwwd', 1, 'Humira'),
    (7, 'hyrimoz:adalimumab:adaz', 'adalimumab', NULL, 'Hyrimoz (adalimumab-adaz)', 'Sandoz', 'hyrimoz', '-adaz', 1, 'Humira'),
    (8, 'cyltezo:adalimumab:adbm', 'adalimumab', NULL, 'Cyltezo (adalimumab-adbm)', 'BI', 'cyltezo', '-adbm', 1, 'Humira'),
    (9, 'amjevita:adalimumab:atto', 'adalimumab', NULL, 'Amjevita (adalimumab-atto)', 'Amgen', 'amjevita', '-atto', 1, 'Humira'),
    (10, 'yuflyma:adalimumab:aaty', 'adalimumab', NULL, 'Yuflyma (adalimumab-aaty)', 'Celltrion', 'yuflyma', '-aaty', 1, 'Humira');

-- Infliximab manufactured drugs
INSERT INTO manu_drugs (row, manu_drug_key, generic_key, generic_uid, drug_name, manufacturer, brandkey, biosimilar_suffix, biosimilar, biosimilar_originator) VALUES
    (11, 'remicade:infliximab', 'infliximab', NULL, 'Remicade (infliximab)', 'Janssen', 'remicade', NULL, 0, NULL),
    (12, 'renflexis:infliximab:abda', 'infliximab', NULL, 'Renflexis (infliximab-abda)', 'Organon', 'renflexis', '-abda', 1, 'Remicade'),
    (13, 'inflectra:infliximab:dyyb', 'infliximab', NULL, 'Inflectra (infliximab-dyyb)', 'Pfizer', 'inflectra', '-dyyb', 1, 'Remicade'),
    (14, 'avsola:infliximab:axxq', 'infliximab', NULL, 'Avsola (infliximab-axxq)', 'Amgen', 'avsola', '-axxq', 1, 'Remicade'),
    (15, 'ixifi:infliximab:qbtx', 'infliximab', NULL, 'Ixifi (infliximab-qbtx)', 'Pfizer', 'ixifi', '-qbtx', 1, 'Remicade');

-- Etanercept manufactured drugs
INSERT INTO manu_drugs (row, manu_drug_key, generic_key, generic_uid, drug_name, manufacturer, brandkey, biosimilar_suffix, biosimilar, biosimilar_originator) VALUES
    (16, 'enbrel:etanercept', 'etanercept', NULL, 'Enbrel (etanercept)', 'Amgen', 'enbrel', NULL, 0, NULL),
    (17, 'erelzi:etanercept:szzs', 'etanercept', NULL, 'Erelzi (etanercept-szzs)', 'Sandoz', 'erelzi', '-szzs', 1, 'Enbrel'),
    (18, 'eticovo:etanercept:ykro', 'etanercept', NULL, 'Eticovo (etanercept-ykro)', 'Samsung', 'eticovo', '-ykro', 1, 'Enbrel');

-- Rituximab manufactured drugs
INSERT INTO manu_drugs (row, manu_drug_key, generic_key, generic_uid, drug_name, manufacturer, brandkey, biosimilar_suffix, biosimilar, biosimilar_originator) VALUES
    (19, 'rituxan:rituximab', 'rituximab', NULL, 'Rituxan (rituximab)', 'Genentech', 'rituxan', NULL, 0, NULL),
    (20, 'ruxience:rituximab:pvvr', 'rituximab', NULL, 'Ruxience (rituximab-pvvr)', 'Pfizer', 'ruxience', '-pvvr', 1, 'Rituxan'),
    (21, 'truxima:rituximab:abbs', 'rituximab', NULL, 'Truxima (rituximab-abbs)', 'Celltrion', 'truxima', '-abbs', 1, 'Rituxan'),
    (22, 'riabni:rituximab:arrx', 'rituximab', NULL, 'Riabni (rituximab-arrx)', 'Amgen', 'riabni', '-arrx', 1, 'Rituxan');

-- Tocilizumab manufactured drugs
INSERT INTO manu_drugs (row, manu_drug_key, generic_key, generic_uid, drug_name, manufacturer, brandkey, biosimilar_suffix, biosimilar, biosimilar_originator) VALUES
    (23, 'actemra:tocilizumab', 'tocilizumab', NULL, 'Actemra (tocilizumab)', 'Genentech', 'actemra', NULL, 0, NULL),
    (24, 'tocilizumab-biosim1', 'tocilizumab', NULL, 'Tocilizumab Biosimilar 1', 'Sandoz', 'tocilizumab-bs1', '-bs1', 1, 'Actemra'),
    (25, 'tocilizumab-biosim2', 'tocilizumab', NULL, 'Tocilizumab Biosimilar 2', 'Pfizer', 'tocilizumab-bs2', '-bs2', 1, 'Actemra');

-- Abatacept manufactured drugs
INSERT INTO manu_drugs (row, manu_drug_key, generic_key, generic_uid, drug_name, manufacturer, brandkey, biosimilar_suffix, biosimilar, biosimilar_originator) VALUES
    (26, 'orencia:abatacept', 'abatacept', NULL, 'Orencia (abatacept)', 'BMS', 'orencia', NULL, 0, NULL),
    (27, 'abatacept-biosim1', 'abatacept', NULL, 'Abatacept Biosimilar 1', 'Sandoz', 'abatacept-bs1', '-bs1', 1, 'Orencia');

-- Anakinra manufactured drugs
INSERT INTO manu_drugs (row, manu_drug_key, generic_key, generic_uid, drug_name, manufacturer, brandkey, biosimilar_suffix, biosimilar, biosimilar_originator) VALUES
    (28, 'kineret:anakinra', 'anakinra', NULL, 'Kineret (anakinra)', 'Sobi', 'kineret', NULL, 0, NULL),
    (29, 'anakinra-biosim1', 'anakinra', NULL, 'Anakinra Biosimilar 1', 'Novartis', 'anakinra-bs1', '-bs1', 1, 'Kineret');

-- Certolizumab manufactured drugs
INSERT INTO manu_drugs (row, manu_drug_key, generic_key, generic_uid, drug_name, manufacturer, brandkey, biosimilar_suffix, biosimilar, biosimilar_originator) VALUES
    (30, 'cimzia:certolizumab', 'certolizumab', NULL, 'Cimzia (certolizumab)', 'UCB', 'cimzia', NULL, 0, NULL),
    (31, 'certolizumab-biosim1', 'certolizumab', NULL, 'Certolizumab Biosimilar 1', 'Sandoz', 'certolizumab-bs1', '-bs1', 1, 'Cimzia');

-- Golimumab manufactured drugs
INSERT INTO manu_drugs (row, manu_drug_key, generic_key, generic_uid, drug_name, manufacturer, brandkey, biosimilar_suffix, biosimilar, biosimilar_originator) VALUES
    (32, 'simponi:golimumab', 'golimumab', NULL, 'Simponi (golimumab)', 'Janssen', 'simponi', NULL, 0, NULL),
    (33, 'golimumab-biosim1', 'golimumab', NULL, 'Golimumab Biosimilar 1', 'Pfizer', 'golimumab-bs1', '-bs1', 1, 'Simponi');

-- Tofacitinib manufactured drugs
INSERT INTO manu_drugs (row, manu_drug_key, generic_key, generic_uid, drug_name, manufacturer, brandkey, biosimilar_suffix, biosimilar, biosimilar_originator) VALUES
    (34, 'xeljanz:tofacitinib', 'tofacitinib', NULL, 'Xeljanz (tofacitinib)', 'Pfizer', 'xeljanz', NULL, 0, NULL),
    (35, 'xeljanz-xr:tofacitinib', 'tofacitinib', NULL, 'Xeljanz XR (tofacitinib)', 'Pfizer', 'xeljanz-xr', NULL, 0, NULL);

-- Baricitinib manufactured drugs
INSERT INTO manu_drugs (row, manu_drug_key, generic_key, generic_uid, drug_name, manufacturer, brandkey, biosimilar_suffix, biosimilar, biosimilar_originator) VALUES
    (36, 'olumiant:baricitinib', 'baricitinib', NULL, 'Olumiant (baricitinib)', 'Lilly', 'olumiant', NULL, 0, NULL);

-- Upadacitinib manufactured drugs
INSERT INTO manu_drugs (row, manu_drug_key, generic_key, generic_uid, drug_name, manufacturer, brandkey, biosimilar_suffix, biosimilar, biosimilar_originator) VALUES
    (37, 'rinvoq:upadacitinib', 'upadacitinib', NULL, 'Rinvoq (upadacitinib)', 'AbbVie', 'rinvoq', NULL, 0, NULL);

-- Filgotinib manufactured drugs
INSERT INTO manu_drugs (row, manu_drug_key, generic_key, generic_uid, drug_name, manufacturer, brandkey, biosimilar_suffix, biosimilar, biosimilar_originator) VALUES
    (38, 'jyseleca:filgotinib', 'filgotinib', NULL, 'Jyseleca (filgotinib)', 'Galapagos', 'jyseleca', NULL, 0, NULL);

-- Ruxolitinib manufactured drugs
INSERT INTO manu_drugs (row, manu_drug_key, generic_key, generic_uid, drug_name, manufacturer, brandkey, biosimilar_suffix, biosimilar, biosimilar_originator) VALUES
    (39, 'jakafi:ruxolitinib', 'ruxolitinib', NULL, 'Jakafi (ruxolitinib)', 'Incyte', 'jakafi', NULL, 0, NULL),
    (40, 'opzelura:ruxolitinib', 'ruxolitinib', NULL, 'Opzelura (ruxolitinib)', 'Incyte', 'opzelura', NULL, 0, NULL);

-- Continue with more manufactured drugs for remaining generics...
-- This sample shows the pattern. The full file will contain thousands of entries.

COMMIT; 