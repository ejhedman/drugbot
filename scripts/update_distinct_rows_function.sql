-- Update the distinct rows function to fix filter quoting for text columns
CREATE OR REPLACE FUNCTION get_distinct_rows_with_filters(
  table_name text,
  column_list text[],
  filters jsonb DEFAULT '{}'::jsonb,
  page_offset integer DEFAULT 0,
  page_limit integer DEFAULT 1000,
  order_by text DEFAULT NULL
)
RETURNS TABLE(
  row_data jsonb,
  total_count bigint
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  query_text text;
  count_query text;
  filter_conditions text := '';
  filter_key text;
  filter_value jsonb;
  filter_keys text[];
  filter_values jsonb[];
  column_list_text text;
  order_clause text;
  total_rows bigint;
BEGIN
  -- Validate inputs
  IF array_length(column_list, 1) IS NULL OR array_length(column_list, 1) = 0 THEN
    RAISE EXCEPTION 'Column list cannot be empty';
  END IF;
  
  IF page_limit <= 0 OR page_limit > 10000 THEN
    RAISE EXCEPTION 'Page limit must be between 1 and 10000';
  END IF;
  
  IF page_offset < 0 THEN
    RAISE EXCEPTION 'Page offset cannot be negative';
  END IF;
  
  -- Build column list for SELECT with proper quoting
  column_list_text := '';
  FOR i IN 1..array_length(column_list, 1) LOOP
    IF i > 1 THEN
      column_list_text := column_list_text || ', ';
    END IF;
    column_list_text := column_list_text || quote_ident(column_list[i]);
  END LOOP;
  
  -- Extract keys and values from JSONB filters
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
      
      IF filter_conditions <> '' THEN
        filter_conditions := filter_conditions || ' AND ';
      END IF;
      -- Handle both single values and arrays, with correct quoting for text columns
      IF jsonb_typeof(filter_value) = 'array' THEN
        filter_conditions := filter_conditions || format('%I IN (%s)', filter_key,
          array_to_string(
            ARRAY(
              SELECT quote_literal(value)
              FROM jsonb_array_elements_text(filter_value) AS t(value)
            ), ', '
          )
        );
      ELSE
        filter_conditions := filter_conditions || format('%I = %L', filter_key, filter_value::text);
      END IF;
    END LOOP;
  END IF;
  
  -- Build ORDER BY clause
  IF order_by IS NOT NULL AND order_by != '' THEN
    order_clause := format(' ORDER BY %I', order_by);
  ELSE
    -- Default ordering by first column
    order_clause := format(' ORDER BY %I', column_list[1]);
  END IF;
  
  -- Build the count query first to get total rows
  IF filter_conditions = '' THEN
    count_query := format('
      SELECT COUNT(*) FROM (
        SELECT DISTINCT %s FROM %I
      ) AS distinct_rows', 
      column_list_text, table_name);
  ELSE
    count_query := format('
      SELECT COUNT(*) FROM (
        SELECT DISTINCT %s FROM %I WHERE %s
      ) AS distinct_rows', 
      column_list_text, table_name, filter_conditions);
  END IF;
  
  -- Execute count query
  EXECUTE count_query INTO total_rows;
  
  -- Build the main query with pagination
  IF filter_conditions = '' THEN
    query_text := format('
      SELECT 
        to_jsonb(subq.*) AS row_data,
        %L::bigint AS total_count
      FROM (
        SELECT DISTINCT %s 
        FROM %I
        %s
        LIMIT %s OFFSET %s
      ) AS subq', 
      total_rows, column_list_text, table_name, order_clause, page_limit, page_offset);
  ELSE
    query_text := format('
      SELECT 
        to_jsonb(subq.*) AS row_data,
        %L::bigint AS total_count
      FROM (
        SELECT DISTINCT %s 
        FROM %I 
        WHERE %s
        %s
        LIMIT %s OFFSET %s
      ) AS subq', 
      total_rows, column_list_text, table_name, filter_conditions, order_clause, page_limit, page_offset);
  END IF;
  
  -- Debug: log the query (remove this in production)
  RAISE NOTICE 'Generated distinct rows query: %', query_text;
  
  RETURN QUERY EXECUTE query_text;
END;
$$; 