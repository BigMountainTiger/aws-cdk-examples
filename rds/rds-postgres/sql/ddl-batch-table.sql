DROP table if exists public.Batch_table;

CREATE TABLE public.batch_table (
	id int8 NOT NULL,
	item varchar NOT NULL,
	CONSTRAINT batch_table_pk PRIMARY KEY (id)
);