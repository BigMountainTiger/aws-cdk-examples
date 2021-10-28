DROP table if exists public.Batch;
DROP table if exists public.Batch_data;

CREATE TABLE public.batch (
	id int4 NOT NULL GENERATED ALWAYS AS IDENTITY,
	createtime timestamp NOT NULL DEFAULT now(),
	CONSTRAINT batch_pk PRIMARY KEY (id)
);

CREATE TABLE public.batch_data (
	id int8 NOT NULL,
	item varchar NOT NULL,
	batch_id int4 NOT NULL,
	CONSTRAINT batch_table_pk PRIMARY KEY (id)
);
CREATE INDEX batch_data_batch_id_idx ON public.batch_data USING btree (batch_id);


CREATE OR REPLACE FUNCTION public.insert_range(count int4)
	RETURNS TABLE(item_count int4)
	LANGUAGE plpgsql
AS $$
DECLARE
	batch_id int4;
	current_max int8;
BEGIN

	insert into batch (createtime) values(now()) RETURNING id into batch_id;
	select coalesce(MAX(id), 0) into current_max from Batch_data;

	for i in (current_max + 1) .. (current_max + count) loop
		insert into Batch_data (id, batch_id, item) values (i, batch_id, concat('A', lpad(i::varchar, 10, '0')));
	end loop;

	return QUERY
	select batch_id::int4;

END; $$;
