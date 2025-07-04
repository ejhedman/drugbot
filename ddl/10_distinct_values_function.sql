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

-- Function to get distinct values with filters applied
CREATE OR REPLACE FUNCTION get_distinct_values_with_filters(
  table_name text, 
  column_name text, 
  filters jsonb DEFAULT '{}'::jsonb
)
RETURNS TABLE(result_value text) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  query_text text;
  filter_conditions text := '';
  filter_key text;
  filter_value jsonb;
  filter_keys text[];
  filter_values jsonb[];
BEGIN
  -- Extract keys and values from JSONB
  SELECT array_agg(key), array_agg(value) 
  INTO filter_keys, filter_values
  FROM (
    SELECT 
      (jsonb_each(filters)).key,
      (jsonb_each(filters)).value
  ) AS f(key, value);
  
  -- Build WHERE conditions from filters
  IF filter_keys IS NOT NULL THEN
    FOR i IN 1..array_length(filter_keys, 1) LOOP
      filter_key := filter_keys[i];
      filter_value := filter_values[i];
      
      -- Handle both single values and arrays
      IF jsonb_typeof(filter_value) = 'array' THEN
        -- Array of values - use IN clause
        IF filter_conditions = '' THEN
          filter_conditions := format('%I IN (SELECT jsonb_array_elements_text(%L))', filter_key, filter_value);
        ELSE
          filter_conditions := filter_conditions || ' AND ' || format('%I IN (SELECT jsonb_array_elements_text(%L))', filter_key, filter_value);
        END IF;
      ELSE
        -- Single value - use equality
        IF filter_conditions = '' THEN
          filter_conditions := format('%I = %L', filter_key, filter_value);
        ELSE
          filter_conditions := filter_conditions || ' AND ' || format('%I = %L', filter_key, filter_value);
        END IF;
      END IF;
    END LOOP;
  END IF;
  
  -- Build the final query
  IF filter_conditions = '' THEN
    -- No filters, use the simple version
    query_text := format('SELECT DISTINCT %I::text AS result_value FROM %I WHERE %I IS NOT NULL ORDER BY result_value', 
      column_name, table_name, column_name);
  ELSE
    -- Apply filters
    query_text := format('SELECT DISTINCT %I::text AS result_value FROM %I WHERE %I IS NOT NULL AND %s ORDER BY result_value', 
      column_name, table_name, column_name, filter_conditions);
  END IF;
  
  -- Debug: log the query (remove this in production)
  RAISE NOTICE 'Generated query: %', query_text;
  
  RETURN QUERY EXECUTE query_text;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_distinct_values(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION get_distinct_values_with_filters(text, text, jsonb) TO authenticated; 