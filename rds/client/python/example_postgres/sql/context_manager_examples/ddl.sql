drop table if exists public.example_table;

CREATE TABLE IF NOT EXISTS public.example_table (
	id int4 NOT NULL GENERATED ALWAYS AS IDENTITY,
	value_entry varchar NOT NULL,
	CONSTRAINT example_table_pk PRIMARY KEY (id)
);