DROP table if exists public.ID_table;

CREATE TABLE public.id_table (
	id_key varchar NOT NULL,
	next_entry int8 NOT NULL,
	CONSTRAINT id_table_pk PRIMARY KEY (id_key)
);

INSERT INTO public.id_table(id_key, next_entry) VALUES('Item_A', 1);

CREATE OR REPLACE FUNCTION public.get_range(item_count int8)
	RETURNS TABLE(a int8, b int8)
	LANGUAGE plpgsql
AS $$
DECLARE
	a int8;
	b int8;
BEGIN
	LOCK TABLE id_table IN ACCESS EXCLUSIVE MODE;
	SELECT next_entry INTO a FROM id_table WHERE id_key = 'Item_A';
	b := a + item_count - 1;

	-- Test artificial deplay
	-- PERFORM pg_sleep(1);
	UPDATE id_table SET next_entry = b + 1 WHERE id_key = 'Item_A';
	-- Test artificial error
	-- RAISE EXCEPTION 'Artificial exception'; 
	return QUERY
	SELECT a, b;

END; $$;


