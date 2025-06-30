-- Demo Data: Manufacturer Drugs for 100 Real Generics
-- Run after generic_drugs insert

BEGIN;

INSERT INTO manu_drugs (row, manu_drug_key, generic_key, generic_uid, drug_name, manufacturer, brandkey, biosimilar_suffix, biosimilar, biosimilar_originator) VALUES
    -- Adalimumab (3 brands)
    (1, 'humira:adalimumab', 'adalimumab', NULL, 'Humira (adalimumab)', 'AbbVie', 'humira', NULL, 0, NULL),
    (2, 'amjevita:adalimumab', 'adalimumab', NULL, 'Amjevita (adalimumab-atto)', 'Amgen', 'amjevita', '-atto', 1, 'Humira'),
    (3, 'cyltezo:adalimumab', 'adalimumab', NULL, 'Cyltezo (adalimumab-adbm)', 'Boehringer Ingelheim', 'cyltezo', '-adbm', 1, 'Humira'),
    
    -- Infliximab (3 brands)
    (4, 'remicade:infliximab', 'infliximab', NULL, 'Remicade (infliximab)', 'Janssen', 'remicade', NULL, 0, NULL),
    (5, 'inflectra:infliximab', 'infliximab', NULL, 'Inflectra (infliximab-dyyb)', 'Pfizer', 'inflectra', '-dyyb', 1, 'Remicade'),
    (6, 'renflexis:infliximab', 'infliximab', NULL, 'Renflexis (infliximab-abda)', 'Organon', 'renflexis', '-abda', 1, 'Remicade'),
    
    -- Etanercept (2 brands)
    (7, 'enbrel:etanercept', 'etanercept', NULL, 'Enbrel (etanercept)', 'Amgen', 'enbrel', NULL, 0, NULL),
    (8, 'erelzi:etanercept', 'etanercept', NULL, 'Erelzi (etanercept-szzs)', 'Sandoz', 'erelzi', '-szzs', 1, 'Enbrel'),
    
    -- Rituximab (4 brands)
    (9, 'rituxan:rituximab', 'rituximab', NULL, 'Rituxan (rituximab)', 'Genentech', 'rituxan', NULL, 0, NULL),
    (10, 'truxima:rituximab', 'rituximab', NULL, 'Truxima (rituximab-abbs)', 'Celltrion', 'truxima', '-abbs', 1, 'Rituxan'),
    (11, 'riabni:rituximab', 'rituximab', NULL, 'Riabni (rituximab-arrx)', 'Amgen', 'riabni', '-arrx', 1, 'Rituxan'),
    (12, 'ruxience:rituximab', 'rituximab', NULL, 'Ruxience (rituximab-pvvr)', 'Pfizer', 'ruxience', '-pvvr', 1, 'Rituxan'),
    
    -- Tocilizumab (2 brands)
    (13, 'actemra:tocilizumab', 'tocilizumab', NULL, 'Actemra (tocilizumab)', 'Genentech', 'actemra', NULL, 0, NULL),
    (14, 'tocilizumab-biosim1', 'tocilizumab', NULL, 'Tocilizumab Biosimilar 1', 'Sandoz', 'tocilizumab-bs1', '-bs1', 1, 'Actemra'),
    
    -- Abatacept (2 brands)
    (15, 'orencia:abatacept', 'abatacept', NULL, 'Orencia (abatacept)', 'BMS', 'orencia', NULL, 0, NULL),
    (16, 'abatacept-biosim1', 'abatacept', NULL, 'Abatacept Biosimilar 1', 'Sandoz', 'abatacept-bs1', '-bs1', 1, 'Orencia'),
    
    -- Anakinra (2 brands)
    (17, 'kineret:anakinra', 'anakinra', NULL, 'Kineret (anakinra)', 'Sobi', 'kineret', NULL, 0, NULL),
    (18, 'anakinra-biosim1', 'anakinra', NULL, 'Anakinra Biosimilar 1', 'Novartis', 'anakinra-bs1', '-bs1', 1, 'Kineret'),
    
    -- Certolizumab (2 brands)
    (19, 'cimzia:certolizumab', 'certolizumab', NULL, 'Cimzia (certolizumab)', 'UCB', 'cimzia', NULL, 0, NULL),
    (20, 'certolizumab-biosim1', 'certolizumab', NULL, 'Certolizumab Biosimilar 1', 'Sandoz', 'certolizumab-bs1', '-bs1', 1, 'Cimzia'),
    
    -- Golimumab (2 brands)
    (21, 'simponi:golimumab', 'golimumab', NULL, 'Simponi (golimumab)', 'Janssen', 'simponi', NULL, 0, NULL),
    (22, 'golimumab-biosim1', 'golimumab', NULL, 'Golimumab Biosimilar 1', 'Pfizer', 'golimumab-bs1', '-bs1', 1, 'Simponi'),
    
    -- Tofacitinib (2 brands)
    (23, 'xeljanz:tofacitinib', 'tofacitinib', NULL, 'Xeljanz (tofacitinib)', 'Pfizer', 'xeljanz', NULL, 0, NULL),
    (24, 'xeljanz-xr:tofacitinib', 'tofacitinib', NULL, 'Xeljanz XR (tofacitinib)', 'Pfizer', 'xeljanz-xr', NULL, 0, NULL),
    
    -- Baricitinib (1 brand)
    (25, 'olumiant:baricitinib', 'baricitinib', NULL, 'Olumiant (baricitinib)', 'Lilly', 'olumiant', NULL, 0, NULL),
    
    -- Upadacitinib (1 brand)
    (26, 'rinvoq:upadacitinib', 'upadacitinib', NULL, 'Rinvoq (upadacitinib)', 'AbbVie', 'rinvoq', NULL, 0, NULL),
    
    -- Filgotinib (1 brand)
    (27, 'jyseleca:filgotinib', 'filgotinib', NULL, 'Jyseleca (filgotinib)', 'Galapagos', 'jyseleca', NULL, 0, NULL),
    
    -- Ruxolitinib (2 brands)
    (28, 'jakafi:ruxolitinib', 'ruxolitinib', NULL, 'Jakafi (ruxolitinib)', 'Incyte', 'jakafi', NULL, 0, NULL),
    (29, 'opzelura:ruxolitinib', 'ruxolitinib', NULL, 'Opzelura (ruxolitinib)', 'Incyte', 'opzelura', NULL, 0, NULL),
    
    -- Methotrexate (3 brands)
    (30, 'trexall:methotrexate', 'methotrexate', NULL, 'Trexall (methotrexate)', 'Teva', 'trexall', NULL, 0, NULL),
    (31, 'rheumatrex:methotrexate', 'methotrexate', NULL, 'Rheumatrex (methotrexate)', 'Dava', 'rheumatrex', NULL, 0, NULL),
    (32, 'methotrexate-generic1', 'methotrexate', NULL, 'Methotrexate Generic 1', 'Mylan', 'methotrexate-gen1', NULL, 0, NULL),
    
    -- Leflunomide (2 brands)
    (33, 'arava:leflunomide', 'leflunomide', NULL, 'Arava (leflunomide)', 'Sanofi', 'arava', NULL, 0, NULL),
    (34, 'leflunomide-generic1', 'leflunomide', NULL, 'Leflunomide Generic 1', 'Teva', 'leflunomide-gen1', NULL, 0, NULL),
    
    -- Azathioprine (2 brands)
    (35, 'imuran:azathioprine', 'azathioprine', NULL, 'Imuran (azathioprine)', 'Prometheus', 'imuran', NULL, 0, NULL),
    (36, 'azathioprine-generic1', 'azathioprine', NULL, 'Azathioprine Generic 1', 'Mylan', 'azathioprine-gen1', NULL, 0, NULL),
    
    -- Cyclosporine (3 brands)
    (37, 'neoral:cyclosporine', 'cyclosporine', NULL, 'Neoral (cyclosporine)', 'Novartis', 'neoral', NULL, 0, NULL),
    (38, 'sandimmune:cyclosporine', 'cyclosporine', NULL, 'Sandimmune (cyclosporine)', 'Novartis', 'sandimmune', NULL, 0, NULL),
    (39, 'cyclosporine-generic1', 'cyclosporine', NULL, 'Cyclosporine Generic 1', 'Teva', 'cyclosporine-gen1', NULL, 0, NULL),
    
    -- Mycophenolate (3 brands)
    (40, 'cellcept:mycophenolate', 'mycophenolate', NULL, 'Cellcept (mycophenolate mofetil)', 'Roche', 'cellcept', NULL, 0, NULL),
    (41, 'myfortic:mycophenolate', 'mycophenolate', NULL, 'Myfortic (mycophenolate sodium)', 'Novartis', 'myfortic', NULL, 0, NULL),
    (42, 'mycophenolate-generic1', 'mycophenolate', NULL, 'Mycophenolate Generic 1', 'Mylan', 'mycophenolate-gen1', NULL, 0, NULL),
    
    -- Belimumab (1 brand)
    (43, 'benlysta:belimumab', 'belimumab', NULL, 'Benlysta (belimumab)', 'GSK', 'benlysta', NULL, 0, NULL),
    
    -- Vedolizumab (1 brand)
    (44, 'entyvio:vedolizumab', 'vedolizumab', NULL, 'Entyvio (vedolizumab)', 'Takeda', 'entyvio', NULL, 0, NULL),
    
    -- Natalizumab (1 brand)
    (45, 'tysabri:natalizumab', 'natalizumab', NULL, 'Tysabri (natalizumab)', 'Biogen', 'tysabri', NULL, 0, NULL),
    
    -- Ustekinumab (1 brand)
    (46, 'stelara:ustekinumab', 'ustekinumab', NULL, 'Stelara (ustekinumab)', 'Janssen', 'stelara', NULL, 0, NULL),
    
    -- Canakinumab (1 brand)
    (47, 'ilaris:canakinumab', 'canakinumab', NULL, 'Ilaris (canakinumab)', 'Novartis', 'ilaris', NULL, 0, NULL),
    
    -- Apremilast (1 brand)
    (48, 'otezla:apremilast', 'apremilast', NULL, 'Otezla (apremilast)', 'Amgen', 'otezla', NULL, 0, NULL),
    
    -- Hydroxychloroquine (2 brands)
    (49, 'plaquenil:hydroxychloroquine', 'hydroxychloroquine', NULL, 'Plaquenil (hydroxychloroquine)', 'Sanofi', 'plaquenil', NULL, 0, NULL),
    (50, 'hydroxychloroquine-generic1', 'hydroxychloroquine', NULL, 'Hydroxychloroquine Generic 1', 'Teva', 'hydroxychloroquine-gen1', NULL, 0, NULL),
    
    -- Sulfasalazine (2 brands)
    (51, 'azulfidine:sulfasalazine', 'sulfasalazine', NULL, 'Azulfidine (sulfasalazine)', 'Pfizer', 'azulfidine', NULL, 0, NULL),
    (52, 'sulfasalazine-generic1', 'sulfasalazine', NULL, 'Sulfasalazine Generic 1', 'Mylan', 'sulfasalazine-gen1', NULL, 0, NULL),
    
    -- Azithromycin (3 brands)
    (53, 'zithromax:azithromycin', 'azithromycin', NULL, 'Zithromax (azithromycin)', 'Pfizer', 'zithromax', NULL, 0, NULL),
    (54, 'azithromycin-generic1', 'azithromycin', NULL, 'Azithromycin Generic 1', 'Teva', 'azithromycin-gen1', NULL, 0, NULL),
    (55, 'azithromycin-generic2', 'azithromycin', NULL, 'Azithromycin Generic 2', 'Mylan', 'azithromycin-gen2', NULL, 0, NULL),
    
    -- Amoxicillin (3 brands)
    (56, 'amoxil:amoxicillin', 'amoxicillin', NULL, 'Amoxil (amoxicillin)', 'GSK', 'amoxil', NULL, 0, NULL),
    (57, 'amoxicillin-generic1', 'amoxicillin', NULL, 'Amoxicillin Generic 1', 'Teva', 'amoxicillin-gen1', NULL, 0, NULL),
    (58, 'amoxicillin-generic2', 'amoxicillin', NULL, 'Amoxicillin Generic 2', 'Mylan', 'amoxicillin-gen2', NULL, 0, NULL),
    
    -- Ciprofloxacin (3 brands)
    (59, 'cipro:ciprofloxacin', 'ciprofloxacin', NULL, 'Cipro (ciprofloxacin)', 'Bayer', 'cipro', NULL, 0, NULL),
    (60, 'ciprofloxacin-generic1', 'ciprofloxacin', NULL, 'Ciprofloxacin Generic 1', 'Teva', 'ciprofloxacin-gen1', NULL, 0, NULL),
    (61, 'ciprofloxacin-generic2', 'ciprofloxacin', NULL, 'Ciprofloxacin Generic 2', 'Mylan', 'ciprofloxacin-gen2', NULL, 0, NULL),
    
    -- Doxycycline (3 brands)
    (62, 'vibramycin:doxycycline', 'doxycycline', NULL, 'Vibramycin (doxycycline)', 'Pfizer', 'vibramycin', NULL, 0, NULL),
    (63, 'doxycycline-generic1', 'doxycycline', NULL, 'Doxycycline Generic 1', 'Teva', 'doxycycline-gen1', NULL, 0, NULL),
    (64, 'doxycycline-generic2', 'doxycycline', NULL, 'Doxycycline Generic 2', 'Mylan', 'doxycycline-gen2', NULL, 0, NULL),
    
    -- Clindamycin (2 brands)
    (65, 'cleocin:clindamycin', 'clindamycin', NULL, 'Cleocin (clindamycin)', 'Pfizer', 'cleocin', NULL, 0, NULL),
    (66, 'clindamycin-generic1', 'clindamycin', NULL, 'Clindamycin Generic 1', 'Teva', 'clindamycin-gen1', NULL, 0, NULL),
    
    -- Metronidazole (2 brands)
    (67, 'flagyl:metronidazole', 'metronidazole', NULL, 'Flagyl (metronidazole)', 'Pfizer', 'flagyl', NULL, 0, NULL),
    (68, 'metronidazole-generic1', 'metronidazole', NULL, 'Metronidazole Generic 1', 'Teva', 'metronidazole-gen1', NULL, 0, NULL),
    
    -- Vancomycin (2 brands)
    (69, 'vancocin:vancomycin', 'vancomycin', NULL, 'Vancocin (vancomycin)', 'Lilly', 'vancocin', NULL, 0, NULL),
    (70, 'vancomycin-generic1', 'vancomycin', NULL, 'Vancomycin Generic 1', 'Teva', 'vancomycin-gen1', NULL, 0, NULL),
    
    -- Gentamicin (2 brands)
    (71, 'garamycin:gentamicin', 'gentamicin', NULL, 'Garamycin (gentamicin)', 'Schering', 'garamycin', NULL, 0, NULL),
    (72, 'gentamicin-generic1', 'gentamicin', NULL, 'Gentamicin Generic 1', 'Teva', 'gentamicin-gen1', NULL, 0, NULL),
    
    -- Ceftriaxone (2 brands)
    (73, 'rocephin:ceftriaxone', 'ceftriaxone', NULL, 'Rocephin (ceftriaxone)', 'Roche', 'rocephin', NULL, 0, NULL),
    (74, 'ceftriaxone-generic1', 'ceftriaxone', NULL, 'Ceftriaxone Generic 1', 'Teva', 'ceftriaxone-gen1', NULL, 0, NULL),
    
    -- Piperacillin (2 brands)
    (75, 'pipracil:piperacillin', 'piperacillin', NULL, 'Pipracil (piperacillin)', 'Lederle', 'pipracil', NULL, 0, NULL),
    (76, 'piperacillin-generic1', 'piperacillin', NULL, 'Piperacillin Generic 1', 'Teva', 'piperacillin-gen1', NULL, 0, NULL),
    
    -- Tazobactam (1 brand - usually combined)
    (77, 'tazobactam-generic1', 'tazobactam', NULL, 'Tazobactam Generic 1', 'Teva', 'tazobactam-gen1', NULL, 0, NULL),
    
    -- Meropenem (2 brands)
    (78, 'merrem:meropenem', 'meropenem', NULL, 'Merrem (meropenem)', 'AstraZeneca', 'merrem', NULL, 0, NULL),
    (79, 'meropenem-generic1', 'meropenem', NULL, 'Meropenem Generic 1', 'Teva', 'meropenem-gen1', NULL, 0, NULL),
    
    -- Linezolid (1 brand)
    (80, 'zyvox:linezolid', 'linezolid', NULL, 'Zyvox (linezolid)', 'Pfizer', 'zyvox', NULL, 0, NULL),
    
    -- Oseltamivir (1 brand)
    (81, 'tamiflu:oseltamivir', 'oseltamivir', NULL, 'Tamiflu (oseltamivir)', 'Roche', 'tamiflu', NULL, 0, NULL),
    
    -- Sofosbuvir (1 brand)
    (82, 'sovaldi:sofosbuvir', 'sofosbuvir', NULL, 'Sovaldi (sofosbuvir)', 'Gilead', 'sovaldi', NULL, 0, NULL),
    
    -- Ledipasvir (1 brand - usually combined)
    (83, 'ledipasvir-generic1', 'ledipasvir', NULL, 'Ledipasvir Generic 1', 'Teva', 'ledipasvir-gen1', NULL, 0, NULL),
    
    -- Efavirenz (2 brands)
    (84, 'sustiva:efavirenz', 'efavirenz', NULL, 'Sustiva (efavirenz)', 'BMS', 'sustiva', NULL, 0, NULL),
    (85, 'efavirenz-generic1', 'efavirenz', NULL, 'Efavirenz Generic 1', 'Teva', 'efavirenz-gen1', NULL, 0, NULL),
    
    -- Tenofovir (2 brands)
    (86, 'viread:tenofovir', 'tenofovir', NULL, 'Viread (tenofovir)', 'Gilead', 'viread', NULL, 0, NULL),
    (87, 'tenofovir-generic1', 'tenofovir', NULL, 'Tenofovir Generic 1', 'Teva', 'tenofovir-gen1', NULL, 0, NULL),
    
    -- Emtricitabine (1 brand)
    (88, 'emtricitabine-generic1', 'emtricitabine', NULL, 'Emtricitabine Generic 1', 'Teva', 'emtricitabine-gen1', NULL, 0, NULL),
    
    -- Abacavir (2 brands)
    (89, 'ziagen:abacavir', 'abacavir', NULL, 'Ziagen (abacavir)', 'GSK', 'ziagen', NULL, 0, NULL),
    (90, 'abacavir-generic1', 'abacavir', NULL, 'Abacavir Generic 1', 'Teva', 'abacavir-gen1', NULL, 0, NULL),
    
    -- Lamivudine (2 brands)
    (91, 'epivir:lamivudine', 'lamivudine', NULL, 'Epivir (lamivudine)', 'GSK', 'epivir', NULL, 0, NULL),
    (92, 'lamivudine-generic1', 'lamivudine', NULL, 'Lamivudine Generic 1', 'Teva', 'lamivudine-gen1', NULL, 0, NULL),
    
    -- Zidovudine (2 brands)
    (93, 'retrovir:zidovudine', 'zidovudine', NULL, 'Retrovir (zidovudine)', 'GSK', 'retrovir', NULL, 0, NULL),
    (94, 'zidovudine-generic1', 'zidovudine', NULL, 'Zidovudine Generic 1', 'Teva', 'zidovudine-gen1', NULL, 0, NULL),
    
    -- Atazanavir (1 brand)
    (95, 'reyataz:atazanavir', 'atazanavir', NULL, 'Reyataz (atazanavir)', 'BMS', 'reyataz', NULL, 0, NULL),
    
    -- Darunavir (1 brand)
    (96, 'prezista:darunavir', 'darunavir', NULL, 'Prezista (darunavir)', 'Janssen', 'prezista', NULL, 0, NULL),
    
    -- Lopinavir (1 brand - usually combined)
    (97, 'kaletra:lopinavir', 'lopinavir', NULL, 'Kaletra (lopinavir/ritonavir)', 'AbbVie', 'kaletra', NULL, 0, NULL),
    
    -- Ritonavir (1 brand)
    (98, 'norvir:ritonavir', 'ritonavir', NULL, 'Norvir (ritonavir)', 'AbbVie', 'norvir', NULL, 0, NULL),
    
    -- Raltegravir (1 brand)
    (99, 'isentress:raltegravir', 'raltegravir', NULL, 'Isentress (raltegravir)', 'Merck', 'isentress', NULL, 0, NULL),
    
    -- Dolutegravir (1 brand)
    (100, 'triumeq:dolutegravir', 'dolutegravir', NULL, 'Triumeq (dolutegravir/abacavir/lamivudine)', 'GSK', 'triumeq', NULL, 0, NULL),
    
    -- Elvitegravir (1 brand - usually combined)
    (101, 'stribild:elvitegravir', 'elvitegravir', NULL, 'Stribild (elvitegravir/cobicistat/tenofovir/emtricitabine)', 'Gilead', 'stribild', NULL, 0, NULL),
    
    -- Maraviroc (1 brand)
    (102, 'selzentry:maraviroc', 'maraviroc', NULL, 'Selzentry (maraviroc)', 'Pfizer', 'selzentry', NULL, 0, NULL),
    
    -- Enfuvirtide (1 brand)
    (103, 'fuzeon:enfuvirtide', 'enfuvirtide', NULL, 'Fuzeon (enfuvirtide)', 'Roche', 'fuzeon', NULL, 0, NULL),
    
    -- Ribavirin (2 brands)
    (104, 'copegus:ribavirin', 'ribavirin', NULL, 'Copegus (ribavirin)', 'Roche', 'copegus', NULL, 0, NULL),
    (105, 'ribavirin-generic1', 'ribavirin', NULL, 'Ribavirin Generic 1', 'Teva', 'ribavirin-gen1', NULL, 0, NULL),
    
    -- Remdesivir (1 brand)
    (106, 'veklury:remdesivir', 'remdesivir', NULL, 'Veklury (remdesivir)', 'Gilead', 'veklury', NULL, 0, NULL),
    
    -- Favipiravir (1 brand)
    (107, 'avigan:favipiravir', 'favipiravir', NULL, 'Avigan (favipiravir)', 'Fujifilm', 'avigan', NULL, 0, NULL),
    
    -- Hydrocortisone (3 brands)
    (108, 'cortef:hydrocortisone', 'hydrocortisone', NULL, 'Cortef (hydrocortisone)', 'Pfizer', 'cortef', NULL, 0, NULL),
    (109, 'hydrocortisone-generic1', 'hydrocortisone', NULL, 'Hydrocortisone Generic 1', 'Teva', 'hydrocortisone-gen1', NULL, 0, NULL),
    (110, 'hydrocortisone-generic2', 'hydrocortisone', NULL, 'Hydrocortisone Generic 2', 'Mylan', 'hydrocortisone-gen2', NULL, 0, NULL),
    
    -- Prednisone (3 brands)
    (111, 'deltasone:prednisone', 'prednisone', NULL, 'Deltasone (prednisone)', 'Pfizer', 'deltasone', NULL, 0, NULL),
    (112, 'prednisone-generic1', 'prednisone', NULL, 'Prednisone Generic 1', 'Teva', 'prednisone-gen1', NULL, 0, NULL),
    (113, 'prednisone-generic2', 'prednisone', NULL, 'Prednisone Generic 2', 'Mylan', 'prednisone-gen2', NULL, 0, NULL),
    
    -- Dexamethasone (3 brands)
    (114, 'decadron:dexamethasone', 'dexamethasone', NULL, 'Decadron (dexamethasone)', 'Merck', 'decadron', NULL, 0, NULL),
    (115, 'dexamethasone-generic1', 'dexamethasone', NULL, 'Dexamethasone Generic 1', 'Teva', 'dexamethasone-gen1', NULL, 0, NULL),
    (116, 'dexamethasone-generic2', 'dexamethasone', NULL, 'Dexamethasone Generic 2', 'Mylan', 'dexamethasone-gen2', NULL, 0, NULL),
    
    -- Fluticasone (2 brands)
    (117, 'flovent:fluticasone', 'fluticasone', NULL, 'Flovent (fluticasone)', 'GSK', 'flovent', NULL, 0, NULL),
    (118, 'fluticasone-generic1', 'fluticasone', NULL, 'Fluticasone Generic 1', 'Teva', 'fluticasone-gen1', NULL, 0, NULL),
    
    -- Budesonide (2 brands)
    (119, 'pulmicort:budesonide', 'budesonide', NULL, 'Pulmicort (budesonide)', 'AstraZeneca', 'pulmicort', NULL, 0, NULL),
    (120, 'budesonide-generic1', 'budesonide', NULL, 'Budesonide Generic 1', 'Teva', 'budesonide-gen1', NULL, 0, NULL),
    
    -- Albuterol (3 brands)
    (121, 'proventil:albuterol', 'albuterol', NULL, 'Proventil (albuterol)', 'Merck', 'proventil', NULL, 0, NULL),
    (122, 'ventolin:albuterol', 'albuterol', NULL, 'Ventolin (albuterol)', 'GSK', 'ventolin', NULL, 0, NULL),
    (123, 'albuterol-generic1', 'albuterol', NULL, 'Albuterol Generic 1', 'Teva', 'albuterol-gen1', NULL, 0, NULL),
    
    -- Salmeterol (1 brand)
    (124, 'serevent:salmeterol', 'salmeterol', NULL, 'Serevent (salmeterol)', 'GSK', 'serevent', NULL, 0, NULL),
    
    -- Formoterol (1 brand)
    (125, 'foradil:formoterol', 'formoterol', NULL, 'Foradil (formoterol)', 'Novartis', 'foradil', NULL, 0, NULL),
    
    -- Ipratropium (2 brands)
    (126, 'atrovent:ipratropium', 'ipratropium', NULL, 'Atrovent (ipratropium)', 'Boehringer Ingelheim', 'atrovent', NULL, 0, NULL),
    (127, 'ipratropium-generic1', 'ipratropium', NULL, 'Ipratropium Generic 1', 'Teva', 'ipratropium-gen1', NULL, 0, NULL),
    
    -- Tiotropium (1 brand)
    (128, 'spiriva:tiotropium', 'tiotropium', NULL, 'Spiriva (tiotropium)', 'Boehringer Ingelheim', 'spiriva', NULL, 0, NULL),
    
    -- Montelukast (1 brand)
    (129, 'singulair:montelukast', 'montelukast', NULL, 'Singulair (montelukast)', 'Merck', 'singulair', NULL, 0, NULL),
    
    -- Omeprazole (3 brands)
    (130, 'prilosec:omeprazole', 'omeprazole', NULL, 'Prilosec (omeprazole)', 'AstraZeneca', 'prilosec', NULL, 0, NULL),
    (131, 'omeprazole-generic1', 'omeprazole', NULL, 'Omeprazole Generic 1', 'Teva', 'omeprazole-gen1', NULL, 0, NULL),
    (132, 'omeprazole-generic2', 'omeprazole', NULL, 'Omeprazole Generic 2', 'Mylan', 'omeprazole-gen2', NULL, 0, NULL),
    
    -- Pantoprazole (2 brands)
    (133, 'protonix:pantoprazole', 'pantoprazole', NULL, 'Protonix (pantoprazole)', 'Pfizer', 'protonix', NULL, 0, NULL),
    (134, 'pantoprazole-generic1', 'pantoprazole', NULL, 'Pantoprazole Generic 1', 'Teva', 'pantoprazole-gen1', NULL, 0, NULL),
    
    -- Lansoprazole (2 brands)
    (135, 'prevacid:lansoprazole', 'lansoprazole', NULL, 'Prevacid (lansoprazole)', 'Takeda', 'prevacid', NULL, 0, NULL),
    (136, 'lansoprazole-generic1', 'lansoprazole', NULL, 'Lansoprazole Generic 1', 'Teva', 'lansoprazole-gen1', NULL, 0, NULL),
    
    -- Ranitidine (2 brands)
    (137, 'zantac:ranitidine', 'ranitidine', NULL, 'Zantac (ranitidine)', 'GSK', 'zantac', NULL, 0, NULL),
    (138, 'ranitidine-generic1', 'ranitidine', NULL, 'Ranitidine Generic 1', 'Teva', 'ranitidine-gen1', NULL, 0, NULL),
    
    -- Famotidine (2 brands)
    (139, 'pepcid:famotidine', 'famotidine', NULL, 'Pepcid (famotidine)', 'Merck', 'pepcid', NULL, 0, NULL),
    (140, 'famotidine-generic1', 'famotidine', NULL, 'Famotidine Generic 1', 'Teva', 'famotidine-gen1', NULL, 0, NULL),
    
    -- Metformin (3 brands)
    (141, 'glucophage:metformin', 'metformin', NULL, 'Glucophage (metformin)', 'BMS', 'glucophage', NULL, 0, NULL),
    (142, 'metformin-generic1', 'metformin', NULL, 'Metformin Generic 1', 'Teva', 'metformin-gen1', NULL, 0, NULL),
    (143, 'metformin-generic2', 'metformin', NULL, 'Metformin Generic 2', 'Mylan', 'metformin-gen2', NULL, 0, NULL),
    
    -- Glipizide (2 brands)
    (144, 'glucotrol:glipizide', 'glipizide', NULL, 'Glucotrol (glipizide)', 'Pfizer', 'glucotrol', NULL, 0, NULL),
    (145, 'glipizide-generic1', 'glipizide', NULL, 'Glipizide Generic 1', 'Teva', 'glipizide-gen1', NULL, 0, NULL),
    
    -- Glyburide (2 brands)
    (146, 'diabeta:glyburide', 'glyburide', NULL, 'Diabeta (glyburide)', 'Sanofi', 'diabeta', NULL, 0, NULL),
    (147, 'glyburide-generic1', 'glyburide', NULL, 'Glyburide Generic 1', 'Teva', 'glyburide-gen1', NULL, 0, NULL),
    
    -- Pioglitazone (1 brand)
    (148, 'actos:pioglitazone', 'pioglitazone', NULL, 'Actos (pioglitazone)', 'Takeda', 'actos', NULL, 0, NULL),
    
    -- Rosiglitazone (1 brand)
    (149, 'avandia:rosiglitazone', 'rosiglitazone', NULL, 'Avandia (rosiglitazone)', 'GSK', 'avandia', NULL, 0, NULL),
    
    -- Sitagliptin (1 brand)
    (150, 'januvia:sitagliptin', 'sitagliptin', NULL, 'Januvia (sitagliptin)', 'Merck', 'januvia', NULL, 0, NULL),
    
    -- Linagliptin (1 brand)
    (151, 'tradjenta:linagliptin', 'linagliptin', NULL, 'Tradjenta (linagliptin)', 'Boehringer Ingelheim', 'tradjenta', NULL, 0, NULL),
    
    -- Canagliflozin (1 brand)
    (152, 'invokana:canagliflozin', 'canagliflozin', NULL, 'Invokana (canagliflozin)', 'Janssen', 'invokana', NULL, 0, NULL),
    
    -- Dapagliflozin (1 brand)
    (153, 'farxiga:dapagliflozin', 'dapagliflozin', NULL, 'Farxiga (dapagliflozin)', 'AstraZeneca', 'farxiga', NULL, 0, NULL),
    
    -- Empagliflozin (1 brand)
    (154, 'jardiance:empagliflozin', 'empagliflozin', NULL, 'Jardiance (empagliflozin)', 'Boehringer Ingelheim', 'jardiance', NULL, 0, NULL),
    
    -- Liraglutide (1 brand)
    (155, 'victoza:liraglutide', 'liraglutide', NULL, 'Victoza (liraglutide)', 'Novo Nordisk', 'victoza', NULL, 0, NULL),
    
    -- Exenatide (1 brand)
    (156, 'byetta:exenatide', 'exenatide', NULL, 'Byetta (exenatide)', 'AstraZeneca', 'byetta', NULL, 0, NULL),
    
    -- Semaglutide (1 brand)
    (157, 'ozempic:semaglutide', 'semaglutide', NULL, 'Ozempic (semaglutide)', 'Novo Nordisk', 'ozempic', NULL, 0, NULL),
    
    -- Insulin Glargine (2 brands)
    (158, 'lantus:insulin-glargine', 'insulin-glargine', NULL, 'Lantus (insulin glargine)', 'Sanofi', 'lantus', NULL, 0, NULL),
    (159, 'basaglar:insulin-glargine', 'insulin-glargine', NULL, 'Basaglar (insulin glargine)', 'Lilly', 'basaglar', NULL, 0, NULL),
    
    -- Insulin Aspart (1 brand)
    (160, 'novolog:insulin-aspart', 'insulin-aspart', NULL, 'NovoLog (insulin aspart)', 'Novo Nordisk', 'novolog', NULL, 0, NULL),
    
    -- Insulin Lispro (1 brand)
    (161, 'humalog:insulin-lispro', 'insulin-lispro', NULL, 'Humalog (insulin lispro)', 'Lilly', 'humalog', NULL, 0, NULL),
    
    -- Insulin Detemir (1 brand)
    (162, 'levemir:insulin-detemir', 'insulin-detemir', NULL, 'Levemir (insulin detemir)', 'Novo Nordisk', 'levemir', NULL, 0, NULL),
    
    -- Warfarin (3 brands)
    (163, 'coumadin:warfarin', 'warfarin', NULL, 'Coumadin (warfarin)', 'BMS', 'coumadin', NULL, 0, NULL),
    (164, 'warfarin-generic1', 'warfarin', NULL, 'Warfarin Generic 1', 'Teva', 'warfarin-gen1', NULL, 0, NULL),
    (165, 'warfarin-generic2', 'warfarin', NULL, 'Warfarin Generic 2', 'Mylan', 'warfarin-gen2', NULL, 0, NULL),
    
    -- Apixaban (1 brand)
    (166, 'eliquis:apixaban', 'apixaban', NULL, 'Eliquis (apixaban)', 'BMS', 'eliquis', NULL, 0, NULL),
    
    -- Rivaroxaban (1 brand)
    (167, 'xarelto:rivaroxaban', 'rivaroxaban', NULL, 'Xarelto (rivaroxaban)', 'Janssen', 'xarelto', NULL, 0, NULL),
    
    -- Dabigatran (1 brand)
    (168, 'pradaxa:dabigatran', 'dabigatran', NULL, 'Pradaxa (dabigatran)', 'Boehringer Ingelheim', 'pradaxa', NULL, 0, NULL),
    
    -- Clopidogrel (2 brands)
    (169, 'plavix:clopidogrel', 'clopidogrel', NULL, 'Plavix (clopidogrel)', 'Sanofi', 'plavix', NULL, 0, NULL),
    (170, 'clopidogrel-generic1', 'clopidogrel', NULL, 'Clopidogrel Generic 1', 'Teva', 'clopidogrel-gen1', NULL, 0, NULL),
    
    -- Sarilumab (1 brand)
    (171, 'kevzara:sarilumab', 'sarilumab', NULL, 'Kevzara (sarilumab)', 'Sanofi', 'kevzara', NULL, 0, NULL);

COMMIT; 