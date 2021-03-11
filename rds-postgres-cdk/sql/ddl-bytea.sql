DROP table if exists public.image_test;

do
$$
begin
	
	CREATE table if not exists public.image_test (
		id int4 NOT NULL GENERATED ALWAYS AS IDENTITY,
		image_data bytea NULL,
		CONSTRAINT image_test_pk PRIMARY KEY (id)
	);

end
$$;