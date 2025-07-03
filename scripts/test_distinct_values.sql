-- Test the get_distinct_values function
SELECT get_distinct_values('generic_drugs_wide_view', 'generic_name') LIMIT 10;

-- Also test with a different column
SELECT get_distinct_values('generic_drugs_wide_view', 'manufacturer') LIMIT 10;

-- Test with a column that might have fewer values
SELECT get_distinct_values('generic_drugs_wide_view', 'biologic') LIMIT 10; 