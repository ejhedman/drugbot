-- Demo Data: Generic Routes (5-50 per generic drug)
-- Run after generic_drugs insert

BEGIN;

-- Adalimumab routes
INSERT INTO generic_routes (row, route_key, generic_key, generic_uid, route_type, load_measure, load_dose, load_measure_2, load_reg, maintain_dose, maintain_measure, maintain_reg, montherapy, half_life) VALUES
    (1, 'adalim-sc-40', 'adalimumab', NULL, 'Subcutaneous', 'mg', '40', 'mg', 'mg', 'every other week', '40', 'mg', 'every other week', 'Approved as monotherapy', '14 days'),
    (2, 'adalim-sc-80', 'adalimumab', NULL, 'Subcutaneous', 'mg', '80', 'mg', 'at week 0, then 40 mg at week 1', '40', 'mg', 'every other week', 'Approved with MTX', '14 days'),
    (3, 'adalim-sc-160', 'adalimumab', NULL, 'Subcutaneous', 'mg', '160', 'mg', 'at week 0, 80 mg at week 2', '40', 'mg', 'every other week', 'Approved with MTX', '14 days'),
    (4, 'adalim-sc-40-weekly', 'adalimumab', NULL, 'Subcutaneous', 'mg', '40', 'mg', 'weekly for 4 weeks', '40', 'mg', 'weekly', 'Approved as monotherapy', '14 days'),
    (5, 'adalim-sc-80-weekly', 'adalimumab', NULL, 'Subcutaneous', 'mg', '80', 'mg', 'weekly for 2 weeks', '40', 'mg', 'weekly', 'Approved with MTX', '14 days'),
    (6, 'adalim-sc-40-biweekly', 'adalimumab', NULL, 'Subcutaneous', 'mg', '40', 'mg', 'every 2 weeks', '40', 'mg', 'every 2 weeks', 'Approved as monotherapy', '14 days'),
    (7, 'adalim-sc-80-biweekly', 'adalimumab', NULL, 'Subcutaneous', 'mg', '80', 'mg', 'every 2 weeks', '40', 'mg', 'every 2 weeks', 'Approved with MTX', '14 days'),
    (8, 'adalim-sc-40-monthly', 'adalimumab', NULL, 'Subcutaneous', 'mg', '40', 'mg', 'monthly', '40', 'mg', 'monthly', 'Approved as monotherapy', '14 days'),
    (9, 'adalim-sc-80-monthly', 'adalimumab', NULL, 'Subcutaneous', 'mg', '80', 'mg', 'monthly', '40', 'mg', 'monthly', 'Approved with MTX', '14 days'),
    (10, 'adalim-sc-40-flexible', 'adalimumab', NULL, 'Subcutaneous', 'mg', '40', 'mg', 'as needed', '40', 'mg', 'as needed', 'Approved as monotherapy', '14 days');

-- Infliximab routes
INSERT INTO generic_routes (row, route_key, generic_key, generic_uid, route_type, load_measure, load_dose, load_measure_2, load_reg, maintain_dose, maintain_measure, maintain_reg, montherapy, half_life) VALUES
    (11, 'inflix-iv-3mg', 'infliximab', NULL, 'Intravenous', 'mg/kg', '3', 'mg/kg', 'at 0, 2, and 6 weeks', '3', 'mg/kg', 'every 8 weeks', 'Approved with MTX', '8-10 days'),
    (12, 'inflix-iv-5mg', 'infliximab', NULL, 'Intravenous', 'mg/kg', '5', 'mg/kg', 'at 0, 2, and 6 weeks', '5', 'mg/kg', 'every 8 weeks', 'Approved with MTX', '8-10 days'),
    (13, 'inflix-iv-10mg', 'infliximab', NULL, 'Intravenous', 'mg/kg', '10', 'mg/kg', 'at 0, 2, and 6 weeks', '10', 'mg/kg', 'every 8 weeks', 'Approved with MTX', '8-10 days'),
    (14, 'inflix-iv-3mg-4week', 'infliximab', NULL, 'Intravenous', 'mg/kg', '3', 'mg/kg', 'at 0, 2, and 6 weeks', '3', 'mg/kg', 'every 4 weeks', 'Approved with MTX', '8-10 days'),
    (15, 'inflix-iv-5mg-4week', 'infliximab', NULL, 'Intravenous', 'mg/kg', '5', 'mg/kg', 'at 0, 2, and 6 weeks', '5', 'mg/kg', 'every 4 weeks', 'Approved with MTX', '8-10 days'),
    (16, 'inflix-iv-10mg-4week', 'infliximab', NULL, 'Intravenous', 'mg/kg', '10', 'mg/kg', 'at 0, 2, and 6 weeks', '10', 'mg/kg', 'every 4 weeks', 'Approved with MTX', '8-10 days'),
    (17, 'inflix-iv-3mg-6week', 'infliximab', NULL, 'Intravenous', 'mg/kg', '3', 'mg/kg', 'at 0, 2, and 6 weeks', '3', 'mg/kg', 'every 6 weeks', 'Approved with MTX', '8-10 days'),
    (18, 'inflix-iv-5mg-6week', 'infliximab', NULL, 'Intravenous', 'mg/kg', '5', 'mg/kg', 'at 0, 2, and 6 weeks', '5', 'mg/kg', 'every 6 weeks', 'Approved with MTX', '8-10 days'),
    (19, 'inflix-iv-10mg-6week', 'infliximab', NULL, 'Intravenous', 'mg/kg', '10', 'mg/kg', 'at 0, 2, and 6 weeks', '10', 'mg/kg', 'every 6 weeks', 'Approved with MTX', '8-10 days'),
    (20, 'inflix-iv-3mg-12week', 'infliximab', NULL, 'Intravenous', 'mg/kg', '3', 'mg/kg', 'at 0, 2, and 6 weeks', '3', 'mg/kg', 'every 12 weeks', 'Approved with MTX', '8-10 days');

-- Etanercept routes
INSERT INTO generic_routes (row, route_key, generic_key, generic_uid, route_type, load_measure, load_dose, load_measure_2, load_reg, maintain_dose, maintain_measure, maintain_reg, montherapy, half_life) VALUES
    (21, 'etaner-sc-25', 'etanercept', NULL, 'Subcutaneous', 'mg', '25', 'mg', 'twice weekly', '25', 'mg', 'twice weekly', 'Approved as monotherapy', '4.5 days'),
    (22, 'etaner-sc-50', 'etanercept', NULL, 'Subcutaneous', 'mg', '50', 'mg', 'weekly', '50', 'mg', 'weekly', 'Approved as monotherapy', '4.5 days'),
    (23, 'etaner-sc-25-weekly', 'etanercept', NULL, 'Subcutaneous', 'mg', '25', 'mg', 'weekly', '25', 'mg', 'weekly', 'Approved as monotherapy', '4.5 days'),
    (24, 'etaner-sc-50-biweekly', 'etanercept', NULL, 'Subcutaneous', 'mg', '50', 'mg', 'every 2 weeks', '50', 'mg', 'every 2 weeks', 'Approved as monotherapy', '4.5 days'),
    (25, 'etaner-sc-25-biweekly', 'etanercept', NULL, 'Subcutaneous', 'mg', '25', 'mg', 'every 2 weeks', '25', 'mg', 'every 2 weeks', 'Approved as monotherapy', '4.5 days'),
    (26, 'etaner-sc-50-monthly', 'etanercept', NULL, 'Subcutaneous', 'mg', '50', 'mg', 'monthly', '50', 'mg', 'monthly', 'Approved as monotherapy', '4.5 days'),
    (27, 'etaner-sc-25-monthly', 'etanercept', NULL, 'Subcutaneous', 'mg', '25', 'mg', 'monthly', '25', 'mg', 'monthly', 'Approved as monotherapy', '4.5 days'),
    (28, 'etaner-sc-50-flexible', 'etanercept', NULL, 'Subcutaneous', 'mg', '50', 'mg', 'as needed', '50', 'mg', 'as needed', 'Approved as monotherapy', '4.5 days'),
    (29, 'etaner-sc-25-flexible', 'etanercept', NULL, 'Subcutaneous', 'mg', '25', 'mg', 'as needed', '25', 'mg', 'as needed', 'Approved as monotherapy', '4.5 days'),
    (30, 'etaner-sc-50-with-mtx', 'etanercept', NULL, 'Subcutaneous', 'mg', '50', 'mg', 'weekly', '50', 'mg', 'weekly', 'Approved with MTX', '4.5 days');

-- Rituximab routes
INSERT INTO generic_routes (row, route_key, generic_key, generic_uid, route_type, load_measure, load_dose, load_measure_2, load_reg, maintain_dose, maintain_measure, maintain_reg, montherapy, half_life) VALUES
    (31, 'ritux-iv-1000', 'rituximab', NULL, 'Intravenous', 'mg', '1000', 'mg', 'at 0 and 2 weeks', '1000', 'mg', 'every 24 weeks', 'Approved with MTX', '22 days'),
    (32, 'ritux-iv-500', 'rituximab', NULL, 'Intravenous', 'mg', '500', 'mg', 'at 0 and 2 weeks', '500', 'mg', 'every 24 weeks', 'Approved with MTX', '22 days'),
    (33, 'ritux-iv-1000-16week', 'rituximab', NULL, 'Intravenous', 'mg', '1000', 'mg', 'at 0 and 2 weeks', '1000', 'mg', 'every 16 weeks', 'Approved with MTX', '22 days'),
    (34, 'ritux-iv-500-16week', 'rituximab', NULL, 'Intravenous', 'mg', '500', 'mg', 'at 0 and 2 weeks', '500', 'mg', 'every 16 weeks', 'Approved with MTX', '22 days'),
    (35, 'ritux-iv-1000-32week', 'rituximab', NULL, 'Intravenous', 'mg', '1000', 'mg', 'at 0 and 2 weeks', '1000', 'mg', 'every 32 weeks', 'Approved with MTX', '22 days'),
    (36, 'ritux-iv-500-32week', 'rituximab', NULL, 'Intravenous', 'mg', '500', 'mg', 'at 0 and 2 weeks', '500', 'mg', 'every 32 weeks', 'Approved with MTX', '22 days'),
    (37, 'ritux-iv-1000-48week', 'rituximab', NULL, 'Intravenous', 'mg', '1000', 'mg', 'at 0 and 2 weeks', '1000', 'mg', 'every 48 weeks', 'Approved with MTX', '22 days'),
    (38, 'ritux-iv-500-48week', 'rituximab', NULL, 'Intravenous', 'mg', '500', 'mg', 'at 0 and 2 weeks', '500', 'mg', 'every 48 weeks', 'Approved with MTX', '22 days'),
    (39, 'ritux-iv-1000-52week', 'rituximab', NULL, 'Intravenous', 'mg', '1000', 'mg', 'at 0 and 2 weeks', '1000', 'mg', 'every 52 weeks', 'Approved with MTX', '22 days'),
    (40, 'ritux-iv-500-52week', 'rituximab', NULL, 'Intravenous', 'mg', '500', 'mg', 'at 0 and 2 weeks', '500', 'mg', 'every 52 weeks', 'Approved with MTX', '22 days');

-- Tocilizumab routes
INSERT INTO generic_routes (row, route_key, generic_key, generic_uid, route_type, load_measure, load_dose, load_measure_2, load_reg, maintain_dose, maintain_measure, maintain_reg, montherapy, half_life) VALUES
    (41, 'tocil-sc-162', 'tocilizumab', NULL, 'Subcutaneous', 'mg', '162', 'mg', 'weekly', '162', 'mg', 'weekly', 'Approved as monotherapy', '13 days'),
    (42, 'tocil-sc-162-biweekly', 'tocilizumab', NULL, 'Subcutaneous', 'mg', '162', 'mg', 'every 2 weeks', '162', 'mg', 'every 2 weeks', 'Approved as monotherapy', '13 days'),
    (43, 'tocil-sc-162-monthly', 'tocilizumab', NULL, 'Subcutaneous', 'mg', '162', 'mg', 'monthly', '162', 'mg', 'monthly', 'Approved as monotherapy', '13 days'),
    (44, 'tocil-sc-162-flexible', 'tocilizumab', NULL, 'Subcutaneous', 'mg', '162', 'mg', 'as needed', '162', 'mg', 'as needed', 'Approved as monotherapy', '13 days'),
    (45, 'tocil-sc-162-with-mtx', 'tocilizumab', NULL, 'Subcutaneous', 'mg', '162', 'mg', 'weekly', '162', 'mg', 'weekly', 'Approved with MTX', '13 days'),
    (46, 'tocil-iv-4mg', 'tocilizumab', NULL, 'Intravenous', 'mg/kg', '4', 'mg/kg', 'every 4 weeks', '4', 'mg/kg', 'every 4 weeks', 'Approved with MTX', '13 days'),
    (47, 'tocil-iv-8mg', 'tocilizumab', NULL, 'Intravenous', 'mg/kg', '8', 'mg/kg', 'every 4 weeks', '8', 'mg/kg', 'every 4 weeks', 'Approved with MTX', '13 days'),
    (48, 'tocil-iv-4mg-2week', 'tocilizumab', NULL, 'Intravenous', 'mg/kg', '4', 'mg/kg', 'every 2 weeks', '4', 'mg/kg', 'every 2 weeks', 'Approved with MTX', '13 days'),
    (49, 'tocil-iv-8mg-2week', 'tocilizumab', NULL, 'Intravenous', 'mg/kg', '8', 'mg/kg', 'every 2 weeks', '8', 'mg/kg', 'every 2 weeks', 'Approved with MTX', '13 days'),
    (50, 'tocil-iv-4mg-6week', 'tocilizumab', NULL, 'Intravenous', 'mg/kg', '4', 'mg/kg', 'every 6 weeks', '4', 'mg/kg', 'every 6 weeks', 'Approved with MTX', '13 days');

-- Continue with more routes for remaining generics...
-- This sample shows the pattern. The full file will contain thousands of entries.

COMMIT; 