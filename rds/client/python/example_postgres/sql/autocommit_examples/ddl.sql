DROP table if exists public.example_table;

CREATE TABLE public.example_table (
	id int4 NOT NULL GENERATED ALWAYS AS IDENTITY,
	item_text varchar NOT NULL,
	CONSTRAINT example_table_check CHECK ((id < 100000 + 1)),
	CONSTRAINT example_table_pk PRIMARY KEY (id)
);

CREATE OR REPLACE FUNCTION public.clear_table()
	RETURNS int4
	LANGUAGE plpgsql
AS $$
DECLARE
  final_row_count int4;
BEGIN

  truncate table public.example_table;
	perform setval(pg_get_serial_sequence('example_table', 'id'), 1, false);
  select count(*) into final_row_count from public.example_table;

	return final_row_count;

END; $$;

CREATE OR REPLACE FUNCTION public.insert_rows_to_table(count int4)
	RETURNS int4
	LANGUAGE plpgsql
AS $$
DECLARE
	final_row_count int4;
BEGIN

	for i in 1 .. count loop
		insert into example_table (item_text) values (lpad(i::varchar, 10, '0'));
	end loop;

	select max(id) into final_row_count from example_table;

	return final_row_count;

END; $$;

DROP FUNCTION insert_batch_rows_to_table(integer);
CREATE OR REPLACE FUNCTION public.insert_batch_rows_to_table(count int4)
	RETURNS int4
	LANGUAGE plpgsql
AS $$
DECLARE
	sql_text text;
	Idex int4;
	inner_Idex int4;
	final_row_count int4;
BEGIN

	Idex := 1;
	while Idex <= count
	loop
		inner_Idex := 1;

		sql_text := 'insert into example_table (item_text) values';
		while inner_Idex <= 1000 and Idex <= count
		loop
			sql_text = concat(sql_text, '(''', 'A', lpad(Idex::varchar, 10, '0'), ''')', ',');
			Idex := Idex + 1;
			inner_Idex := inner_Idex + 1;
		end loop;

		sql_text = substr(sql_text, 1, length(sql_text) - 1);
		execute sql_text;
	end loop;

	select max(id) into final_row_count from example_table;

	return final_row_count;

END; $$;