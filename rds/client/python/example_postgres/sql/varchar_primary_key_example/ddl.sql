DROP table if exists public.ID_table;
DROP table if exists public.Batch;
DROP table if exists public.Batch_data;

CREATE TABLE public.id_table (
	id_key varchar NOT NULL,
	next_entry int8 NOT NULL,
	CONSTRAINT id_table_pk PRIMARY KEY (id_key)
);

INSERT INTO public.id_table(id_key, next_entry) VALUES('Item_A', 1);

CREATE TABLE public.batch (
	id int4 NOT NULL GENERATED ALWAYS AS IDENTITY,
	createtime timestamp NOT NULL DEFAULT now(),
	CONSTRAINT batch_pk PRIMARY KEY (id)
);

CREATE TABLE public.batch_data (
	item varchar NOT NULL,
	batch_id int4 NOT NULL,
	CONSTRAINT batch_table_pk PRIMARY KEY (item)
);
CREATE INDEX batch_data_batch_id_idx ON public.batch_data USING btree (batch_id);

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

	UPDATE id_table SET next_entry = b + 1 WHERE id_key = 'Item_A';

	return QUERY
	SELECT a, b;

END; $$;

CREATE OR REPLACE FUNCTION public.insert_range(a int8, b int8)
	RETURNS TABLE(item_count int4)
	LANGUAGE plpgsql
AS $$
DECLARE
	batch_id int4;
BEGIN

	insert into batch (createtime) values(now()) RETURNING id into batch_id;

	for i in a .. b loop
		insert into Batch_data (item, batch_id) values (concat('A', lpad(i::varchar, 10, '0')), batch_id);
	end loop;

	return QUERY
	select batch_id::int4;

END; $$;
