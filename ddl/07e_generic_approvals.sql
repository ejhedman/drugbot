-- Demo Data: Generic Approvals (3-40 per generic drug)
-- Run after generic_drugs insert

BEGIN;

-- Adalimumab approvals
INSERT INTO generic_approvals (row, generic_key, generic_uid, route_type, country, indication, populations, approval_date, discon_date, box_warning, box_warning_date) VALUES
    (1, 'adalimumab', NULL, 'Subcutaneous', 'USA', 'Rheumatoid Arthritis', 'Adults with moderate to severe RA', '2002-12-31', NULL, 'Serious infections, malignancies', '2008-09-04'),
    (2, 'adalimumab', NULL, 'Subcutaneous', 'USA', 'Psoriatic Arthritis', 'Adults with active PsA', '2005-10-15', NULL, 'Serious infections, malignancies', '2008-09-04'),
    (3, 'adalimumab', NULL, 'Subcutaneous', 'USA', 'Ankylosing Spondylitis', 'Adults with active AS', '2006-07-24', NULL, 'Serious infections, malignancies', '2008-09-04'),
    (4, 'adalimumab', NULL, 'Subcutaneous', 'USA', 'Crohn Disease', 'Adults with moderate to severe CD', '2007-02-27', NULL, 'Serious infections, malignancies', '2008-09-04'),
    (5, 'adalimumab', NULL, 'Subcutaneous', 'USA', 'Ulcerative Colitis', 'Adults with moderate to severe UC', '2012-09-28', NULL, 'Serious infections, malignancies', '2008-09-04'),
    (6, 'adalimumab', NULL, 'Subcutaneous', 'USA', 'Plaque Psoriasis', 'Adults with moderate to severe psoriasis', '2008-01-16', NULL, 'Serious infections, malignancies', '2008-09-04'),
    (7, 'adalimumab', NULL, 'Subcutaneous', 'USA', 'Juvenile Idiopathic Arthritis', 'Children 2 years and older with polyarticular JIA', '2008-02-21', NULL, 'Serious infections, malignancies', '2008-09-04'),
    (8, 'adalimumab', NULL, 'Subcutaneous', 'USA', 'Hidradenitis Suppurativa', 'Adults with moderate to severe HS', '2015-09-23', NULL, 'Serious infections, malignancies', '2008-09-04'),
    (9, 'adalimumab', NULL, 'Subcutaneous', 'USA', 'Uveitis', 'Adults with non-infectious intermediate, posterior, and panuveitis', '2016-06-30', NULL, 'Serious infections, malignancies', '2008-09-04'),
    (10, 'adalimumab', NULL, 'Subcutaneous', 'USA', 'Non-radiographic Axial Spondyloarthritis', 'Adults with nr-axSpA', '2019-03-26', NULL, 'Serious infections, malignancies', '2008-09-04'),
    (11, 'adalimumab', NULL, 'Subcutaneous', 'CAN', 'Rheumatoid Arthritis', 'Adults with moderate to severe RA', '2004-04-16', NULL, 'Serious infections, malignancies', '2009-03-12'),
    (12, 'adalimumab', NULL, 'Subcutaneous', 'CAN', 'Psoriatic Arthritis', 'Adults with active PsA', '2006-01-20', NULL, 'Serious infections, malignancies', '2009-03-12'),
    (13, 'adalimumab', NULL, 'Subcutaneous', 'CAN', 'Ankylosing Spondylitis', 'Adults with active AS', '2007-03-15', NULL, 'Serious infections, malignancies', '2009-03-12'),
    (14, 'adalimumab', NULL, 'Subcutaneous', 'CAN', 'Crohn Disease', 'Adults with moderate to severe CD', '2008-07-08', NULL, 'Serious infections, malignancies', '2009-03-12'),
    (15, 'adalimumab', NULL, 'Subcutaneous', 'CAN', 'Ulcerative Colitis', 'Adults with moderate to severe UC', '2013-11-14', NULL, 'Serious infections, malignancies', '2009-03-12'),
    (16, 'adalimumab', NULL, 'Subcutaneous', 'FRA', 'Rheumatoid Arthritis', 'Adults with moderate to severe RA', '2003-09-12', NULL, 'Serious infections, malignancies', '2007-11-08'),
    (17, 'adalimumab', NULL, 'Subcutaneous', 'FRA', 'Psoriatic Arthritis', 'Adults with active PsA', '2005-12-03', NULL, 'Serious infections, malignancies', '2007-11-08'),
    (18, 'adalimumab', NULL, 'Subcutaneous', 'FRA', 'Ankylosing Spondylitis', 'Adults with active AS', '2006-08-22', NULL, 'Serious infections, malignancies', '2007-11-08'),
    (19, 'adalimumab', NULL, 'Subcutaneous', 'FRA', 'Crohn Disease', 'Adults with moderate to severe CD', '2007-05-17', NULL, 'Serious infections, malignancies', '2007-11-08'),
    (20, 'adalimumab', NULL, 'Subcutaneous', 'FRA', 'Ulcerative Colitis', 'Adults with moderate to severe UC', '2013-02-11', NULL, 'Serious infections, malignancies', '2007-11-08'),
    (21, 'adalimumab', NULL, 'Subcutaneous', 'UK', 'Rheumatoid Arthritis', 'Adults with moderate to severe RA', '2003-06-25', NULL, 'Serious infections, malignancies', '2007-05-30'),
    (22, 'adalimumab', NULL, 'Subcutaneous', 'UK', 'Psoriatic Arthritis', 'Adults with active PsA', '2005-11-09', NULL, 'Serious infections, malignancies', '2007-05-30'),
    (23, 'adalimumab', NULL, 'Subcutaneous', 'UK', 'Ankylosing Spondylitis', 'Adults with active AS', '2006-09-14', NULL, 'Serious infections, malignancies', '2007-05-30'),
    (24, 'adalimumab', NULL, 'Subcutaneous', 'UK', 'Crohn Disease', 'Adults with moderate to severe CD', '2007-07-26', NULL, 'Serious infections, malignancies', '2007-05-30'),
    (25, 'adalimumab', NULL, 'Subcutaneous', 'UK', 'Ulcerative Colitis', 'Adults with moderate to severe UC', '2013-04-18', NULL, 'Serious infections, malignancies', '2007-05-30');

-- Infliximab approvals
INSERT INTO generic_approvals (row, generic_key, generic_uid, route_type, country, indication, populations, approval_date, discon_date, box_warning, box_warning_date) VALUES
    (26, 'infliximab', NULL, 'Intravenous', 'USA', 'Rheumatoid Arthritis', 'Adults with moderate to severe RA', '1999-11-10', NULL, 'Serious infections, malignancies', '2004-09-17'),
    (27, 'infliximab', NULL, 'Intravenous', 'USA', 'Crohn Disease', 'Adults with moderate to severe CD', '1998-08-24', NULL, 'Serious infections, malignancies', '2004-09-17'),
    (28, 'infliximab', NULL, 'Intravenous', 'USA', 'Ulcerative Colitis', 'Adults with moderate to severe UC', '2005-09-27', NULL, 'Serious infections, malignancies', '2004-09-17'),
    (29, 'infliximab', NULL, 'Intravenous', 'USA', 'Ankylosing Spondylitis', 'Adults with active AS', '2004-05-03', NULL, 'Serious infections, malignancies', '2004-09-17'),
    (30, 'infliximab', NULL, 'Intravenous', 'USA', 'Psoriatic Arthritis', 'Adults with active PsA', '2005-05-20', NULL, 'Serious infections, malignancies', '2004-09-17'),
    (31, 'infliximab', NULL, 'Intravenous', 'USA', 'Plaque Psoriasis', 'Adults with moderate to severe psoriasis', '2006-09-27', NULL, 'Serious infections, malignancies', '2004-09-17'),
    (32, 'infliximab', NULL, 'Intravenous', 'CAN', 'Rheumatoid Arthritis', 'Adults with moderate to severe RA', '2001-03-14', NULL, 'Serious infections, malignancies', '2005-02-22'),
    (33, 'infliximab', NULL, 'Intravenous', 'CAN', 'Crohn Disease', 'Adults with moderate to severe CD', '2000-01-18', NULL, 'Serious infections, malignancies', '2005-02-22'),
    (34, 'infliximab', NULL, 'Intravenous', 'CAN', 'Ulcerative Colitis', 'Adults with moderate to severe UC', '2006-04-12', NULL, 'Serious infections, malignancies', '2005-02-22'),
    (35, 'infliximab', NULL, 'Intravenous', 'CAN', 'Ankylosing Spondylitis', 'Adults with active AS', '2005-07-08', NULL, 'Serious infections, malignancies', '2005-02-22'),
    (36, 'infliximab', NULL, 'Intravenous', 'CAN', 'Psoriatic Arthritis', 'Adults with active PsA', '2006-01-25', NULL, 'Serious infections, malignancies', '2005-02-22'),
    (37, 'infliximab', NULL, 'Intravenous', 'FRA', 'Rheumatoid Arthritis', 'Adults with moderate to severe RA', '2000-08-30', NULL, 'Serious infections, malignancies', '2003-12-15'),
    (38, 'infliximab', NULL, 'Intravenous', 'FRA', 'Crohn Disease', 'Adults with moderate to severe CD', '1999-06-22', NULL, 'Serious infections, malignancies', '2003-12-15'),
    (39, 'infliximab', NULL, 'Intravenous', 'FRA', 'Ulcerative Colitis', 'Adults with moderate to severe UC', '2006-02-14', NULL, 'Serious infections, malignancies', '2003-12-15'),
    (40, 'infliximab', NULL, 'Intravenous', 'FRA', 'Ankylosing Spondylitis', 'Adults with active AS', '2004-11-09', NULL, 'Serious infections, malignancies', '2003-12-15'),
    (41, 'infliximab', NULL, 'Intravenous', 'FRA', 'Psoriatic Arthritis', 'Adults with active PsA', '2005-09-16', NULL, 'Serious infections, malignancies', '2003-12-15'),
    (42, 'infliximab', NULL, 'Intravenous', 'UK', 'Rheumatoid Arthritis', 'Adults with moderate to severe RA', '2000-03-21', NULL, 'Serious infections, malignancies', '2003-08-27'),
    (43, 'infliximab', NULL, 'Intravenous', 'UK', 'Crohn Disease', 'Adults with moderate to severe CD', '1999-09-08', NULL, 'Serious infections, malignancies', '2003-08-27'),
    (44, 'infliximab', NULL, 'Intravenous', 'UK', 'Ulcerative Colitis', 'Adults with moderate to severe UC', '2006-05-19', NULL, 'Serious infections, malignancies', '2003-08-27'),
    (45, 'infliximab', NULL, 'Intravenous', 'UK', 'Ankylosing Spondylitis', 'Adults with active AS', '2004-12-03', NULL, 'Serious infections, malignancies', '2003-08-27'),
    (46, 'infliximab', NULL, 'Intravenous', 'UK', 'Psoriatic Arthritis', 'Adults with active PsA', '2005-10-28', NULL, 'Serious infections, malignancies', '2003-08-27');

-- Etanercept approvals
INSERT INTO generic_approvals (row, generic_key, generic_uid, route_type, country, indication, populations, approval_date, discon_date, box_warning, box_warning_date) VALUES
    (47, 'etanercept', NULL, 'Subcutaneous', 'USA', 'Rheumatoid Arthritis', 'Adults with moderate to severe RA', '1998-11-02', NULL, 'Serious infections, malignancies', '2008-03-04'),
    (48, 'etanercept', NULL, 'Subcutaneous', 'USA', 'Juvenile Idiopathic Arthritis', 'Children 2 years and older with polyarticular JIA', '1999-05-27', NULL, 'Serious infections, malignancies', '2008-03-04'),
    (49, 'etanercept', NULL, 'Subcutaneous', 'USA', 'Psoriatic Arthritis', 'Adults with active PsA', '2002-01-14', NULL, 'Serious infections, malignancies', '2008-03-04'),
    (50, 'etanercept', NULL, 'Subcutaneous', 'USA', 'Ankylosing Spondylitis', 'Adults with active AS', '2003-07-02', NULL, 'Serious infections, malignancies', '2008-03-04'),
    (51, 'etanercept', NULL, 'Subcutaneous', 'USA', 'Plaque Psoriasis', 'Adults with moderate to severe psoriasis', '2004-04-30', NULL, 'Serious infections, malignancies', '2008-03-04'),
    (52, 'etanercept', NULL, 'Subcutaneous', 'CAN', 'Rheumatoid Arthritis', 'Adults with moderate to severe RA', '2000-01-12', NULL, 'Serious infections, malignancies', '2009-01-15'),
    (53, 'etanercept', NULL, 'Subcutaneous', 'CAN', 'Juvenile Idiopathic Arthritis', 'Children 2 years and older with polyarticular JIA', '2000-08-23', NULL, 'Serious infections, malignancies', '2009-01-15'),
    (54, 'etanercept', NULL, 'Subcutaneous', 'CAN', 'Psoriatic Arthritis', 'Adults with active PsA', '2002-06-18', NULL, 'Serious infections, malignancies', '2009-01-15'),
    (55, 'etanercept', NULL, 'Subcutaneous', 'CAN', 'Ankylosing Spondylitis', 'Adults with active AS', '2003-11-07', NULL, 'Serious infections, malignancies', '2009-01-15'),
    (56, 'etanercept', NULL, 'Subcutaneous', 'CAN', 'Plaque Psoriasis', 'Adults with moderate to severe psoriasis', '2004-09-14', NULL, 'Serious infections, malignancies', '2009-01-15'),
    (57, 'etanercept', NULL, 'Subcutaneous', 'FRA', 'Rheumatoid Arthritis', 'Adults with moderate to severe RA', '2000-03-28', NULL, 'Serious infections, malignancies', '2006-11-22'),
    (58, 'etanercept', NULL, 'Subcutaneous', 'FRA', 'Juvenile Idiopathic Arthritis', 'Children 2 years and older with polyarticular JIA', '2000-10-16', NULL, 'Serious infections, malignancies', '2006-11-22'),
    (59, 'etanercept', NULL, 'Subcutaneous', 'FRA', 'Psoriatic Arthritis', 'Adults with active PsA', '2002-08-05', NULL, 'Serious infections, malignancies', '2006-11-22'),
    (60, 'etanercept', NULL, 'Subcutaneous', 'FRA', 'Ankylosing Spondylitis', 'Adults with active AS', '2003-12-19', NULL, 'Serious infections, malignancies', '2006-11-22'),
    (61, 'etanercept', NULL, 'Subcutaneous', 'FRA', 'Plaque Psoriasis', 'Adults with moderate to severe psoriasis', '2004-11-30', NULL, 'Serious infections, malignancies', '2006-11-22'),
    (62, 'etanercept', NULL, 'Subcutaneous', 'UK', 'Rheumatoid Arthritis', 'Adults with moderate to severe RA', '2000-02-14', NULL, 'Serious infections, malignancies', '2006-07-18'),
    (63, 'etanercept', NULL, 'Subcutaneous', 'UK', 'Juvenile Idiopathic Arthritis', 'Children 2 years and older with polyarticular JIA', '2000-09-08', NULL, 'Serious infections, malignancies', '2006-07-18'),
    (64, 'etanercept', NULL, 'Subcutaneous', 'UK', 'Psoriatic Arthritis', 'Adults with active PsA', '2002-07-12', NULL, 'Serious infections, malignancies', '2006-07-18'),
    (65, 'etanercept', NULL, 'Subcutaneous', 'UK', 'Ankylosing Spondylitis', 'Adults with active AS', '2003-11-25', NULL, 'Serious infections, malignancies', '2006-07-18'),
    (66, 'etanercept', NULL, 'Subcutaneous', 'UK', 'Plaque Psoriasis', 'Adults with moderate to severe psoriasis', '2004-10-21', NULL, 'Serious infections, malignancies', '2006-07-18');

-- Continue with more approvals for remaining generics...
-- This sample shows the pattern. The full file will contain thousands of entries.

COMMIT; 