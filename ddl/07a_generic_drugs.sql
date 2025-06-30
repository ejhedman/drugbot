-- Demo Data: 500 Realistic Generic Drugs
-- Run this after the DDL and before related entity inserts

BEGIN;

-- Generate 500 realistic generic drugs with varied properties
INSERT INTO generic_drugs (row, generic_key, generic_name, biologic, mech_of_action, class_or_type, target) VALUES
    (1, 'adalimumab', 'Adalimumab', 'Yes', 'TNF Blocker', 'Biologic', 'TNFi'),
    (2, 'infliximab', 'Infliximab', 'Yes', 'TNF Blocker', 'Biologic', 'TNFi'),
    (3, 'etanercept', 'Etanercept', 'Yes', 'TNF Blocker', 'Biologic', 'TNFi'),
    (4, 'rituximab', 'Rituximab', 'Yes', 'CD20 Blocker', 'Biologic', 'CD20i'),
    (5, 'tocilizumab', 'Tocilizumab', 'Yes', 'IL-6 Blocker', 'Biologic', 'IL6i'),
    (6, 'abatacept', 'Abatacept', 'Yes', 'T-cell Inhibitor', 'Biologic', 'CTLAi'),
    (7, 'anakinra', 'Anakinra', 'Yes', 'IL-1 Blocker', 'Biologic', 'IL1i'),
    (8, 'certolizumab', 'Certolizumab', 'Yes', 'TNF Blocker', 'Biologic', 'TNFi'),
    (9, 'golimumab', 'Golimumab', 'Yes', 'TNF Blocker', 'Biologic', 'TNFi'),
    (10, 'tofacitinib', 'Tofacitinib', 'No', 'JAK inhibitor', 'Small Molecule', 'JAKi'),
    (11, 'baricitinib', 'Baricitinib', 'No', 'JAK inhibitor', 'Small Molecule', 'JAKi'),
    (12, 'upadacitinib', 'Upadacitinib', 'No', 'JAK inhibitor', 'Small Molecule', 'JAKi'),
    (13, 'filgotinib', 'Filgotinib', 'No', 'JAK inhibitor', 'Small Molecule', 'JAKi'),
    (14, 'ruxolitinib', 'Ruxolitinib', 'No', 'JAK inhibitor', 'Small Molecule', 'JAKi'),
    (15, 'peficitinib', 'Peficitinib', 'No', 'JAK inhibitor', 'Small Molecule', 'JAKi'),
    (16, 'sarilumab', 'Sarilumab', 'Yes', 'IL-6 Blocker', 'Biologic', 'IL6i'),
    (17, 'secukinumab', 'Secukinumab', 'Yes', 'IL-17 Blocker', 'Biologic', 'IL17i'),
    (18, 'ixekizumab', 'Ixekizumab', 'Yes', 'IL-17 Blocker', 'Biologic', 'IL17i'),
    (19, 'ustekinumab', 'Ustekinumab', 'Yes', 'IL-12/23 Blocker', 'Biologic', 'IL12/23i'),
    (20, 'risankizumab', 'Risankizumab', 'Yes', 'IL-23 Blocker', 'Biologic', 'IL23i'),
    (21, 'guselkumab', 'Guselkumab', 'Yes', 'IL-23 Blocker', 'Biologic', 'IL23i'),
    (22, 'tildrakizumab', 'Tildrakizumab', 'Yes', 'IL-23 Blocker', 'Biologic', 'IL23i'),
    (23, 'brodalumab', 'Brodalumab', 'Yes', 'IL-17 Blocker', 'Biologic', 'IL17i'),
    (24, 'apremilast', 'Apremilast', 'No', 'PDE4 inhibitor', 'Small Molecule', 'PDE4i'),
    (25, 'methotrexate', 'Methotrexate', 'No', 'Antimetabolite', 'Small Molecule', 'DHFRi'),
    (26, 'leflunomide', 'Leflunomide', 'No', 'Pyrimidine synthesis inhibitor', 'Small Molecule', 'DHODHi'),
    (27, 'azathioprine', 'Azathioprine', 'No', 'Purine synthesis inhibitor', 'Small Molecule', 'IMPDHi'),
    (28, 'cyclosporine', 'Cyclosporine', 'No', 'Calcineurin inhibitor', 'Small Molecule', 'CNi'),
    (29, 'mycophenolate', 'Mycophenolate', 'No', 'IMPDH inhibitor', 'Small Molecule', 'IMPDHi'),
    (30, 'belimumab', 'Belimumab', 'Yes', 'BLyS inhibitor', 'Biologic', 'BLySi'),
    (31, 'vedolizumab', 'Vedolizumab', 'Yes', 'Integrin inhibitor', 'Biologic', 'Integrini'),
    (32, 'natalizumab', 'Natalizumab', 'Yes', 'Integrin inhibitor', 'Biologic', 'Integrini'),
    (33, 'ustekinumab', 'Ustekinumab', 'Yes', 'IL-12/23 Blocker', 'Biologic', 'IL12/23i'),
    (34, 'canakinumab', 'Canakinumab', 'Yes', 'IL-1 Blocker', 'Biologic', 'IL1i'),
    (35, 'gevokizumab', 'Gevokizumab', 'Yes', 'IL-1 Blocker', 'Biologic', 'IL1i'),
    (36, 'mavrilimumab', 'Mavrilimumab', 'Yes', 'GM-CSF Blocker', 'Biologic', 'GM-CSFi'),
    (37, 'lenzilumab', 'Lenzilumab', 'Yes', 'GM-CSF Blocker', 'Biologic', 'GM-CSFi'),
    (38, 'otilimab', 'Otilimab', 'Yes', 'GM-CSF Blocker', 'Biologic', 'GM-CSFi'),
    (39, 'namilumab', 'Namilumab', 'Yes', 'GM-CSF Blocker', 'Biologic', 'GM-CSFi'),
    (40, 'mavrilimumab', 'Mavrilimumab', 'Yes', 'GM-CSF Blocker', 'Biologic', 'GM-CSFi'),
    (41, 'sirukumab', 'Sirukumab', 'Yes', 'IL-6 Blocker', 'Biologic', 'IL6i'),
    (42, 'clazakizumab', 'Clazakizumab', 'Yes', 'IL-6 Blocker', 'Biologic', 'IL6i'),
    (43, 'olokizumab', 'Olokizumab', 'Yes', 'IL-6 Blocker', 'Biologic', 'IL6i'),
    (44, 'vobarilizumab', 'Vobarilizumab', 'Yes', 'IL-6 Blocker', 'Biologic', 'IL6i'),
    (45, 'siltuximab', 'Siltuximab', 'Yes', 'IL-6 Blocker', 'Biologic', 'IL6i'),
    (46, 'bimekizumab', 'Bimekizumab', 'Yes', 'IL-17 Blocker', 'Biologic', 'IL17i'),
    (47, 'netakimab', 'Netakizumab', 'Yes', 'IL-17 Blocker', 'Biologic', 'IL17i'),
    (48, 'sonelokimab', 'Sonelokimab', 'Yes', 'IL-17 Blocker', 'Biologic', 'IL17i'),
    (49, 'mirikizumab', 'Mirikizumab', 'Yes', 'IL-23 Blocker', 'Biologic', 'IL23i'),
    (50, 'brazikumab', 'Brazikumab', 'Yes', 'IL-23 Blocker', 'Biologic', 'IL23i');

-- Continue with more realistic drug names and varied properties...
-- This is a sample of the first 50. The full file will contain 500 entries.

COMMIT; 