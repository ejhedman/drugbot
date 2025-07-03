-- Function to get distinct values from any table column
CREATE OR REPLACE FUNCTION get_distinct_values(table_name text, column_name text)
RETURNS TABLE(value text) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY EXECUTE format('SELECT DISTINCT %I::text FROM %I WHERE %I IS NOT NULL ORDER BY %I', 
    column_name, table_name, column_name, column_name);
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_distinct_values(text, text) TO authenticated; 