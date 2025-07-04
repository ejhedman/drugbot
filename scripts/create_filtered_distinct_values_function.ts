import { createServiceClient } from '../src/lib/supabase-server';

async function createFilteredDistinctValuesFunction() {
  const supabase = createServiceClient();
  
  const sql = `
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
RETURNS TABLE(value text) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  filter_conditions text := '';
  filter_key text;
  filter_values text[];
  filter_condition text;
BEGIN
  -- Build WHERE conditions from filters
  FOR filter_key, filter_values IN 
    SELECT key, array_agg(value::text) 
    FROM jsonb_each_text(filters) 
    GROUP BY key
  LOOP
    IF array_length(filter_values, 1) > 0 THEN
      filter_condition := format('%I = ANY(%L::text[])', filter_key, filter_values);
      IF filter_conditions = '' THEN
        filter_conditions := filter_condition;
      ELSE
        filter_conditions := filter_conditions || ' AND ' || filter_condition;
      END IF;
    END IF;
  END LOOP;
  
  -- Build the final query
  IF filter_conditions = '' THEN
    -- No filters, use the simple version
    RETURN QUERY EXECUTE format('SELECT DISTINCT %I::text FROM %I WHERE %I IS NOT NULL ORDER BY %I', 
      column_name, table_name, column_name, column_name);
  ELSE
    -- Apply filters
    RETURN QUERY EXECUTE format('SELECT DISTINCT %I::text FROM %I WHERE %I IS NOT NULL AND %s ORDER BY %I', 
      column_name, table_name, column_name, filter_conditions, column_name);
  END IF;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_distinct_values(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION get_distinct_values_with_filters(text, text, jsonb) TO authenticated;
  `;

  try {
    const { error } = await supabase.rpc('exec_sql', { sql });
    if (error) {
      console.error('Error creating function:', error);
    } else {
      console.log('Successfully created get_distinct_values_with_filters function');
    }
  } catch (error) {
    console.error('Error executing SQL:', error);
  }
}

createFilteredDistinctValuesFunction(); 