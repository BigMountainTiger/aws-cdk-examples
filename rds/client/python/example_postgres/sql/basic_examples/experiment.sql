
-- Test variables in a function
drop function if exists test_function();

CREATE OR REPLACE FUNCTION public.test_function()
 RETURNS TABLE(id integer, name character varying)
 LANGUAGE plpgsql
AS $function$
declare 
	sid int4;
BEGIN
 sid := 2;

 return QUERY
 SELECT s.id, s.name from public.student s where s.id = sid;

END; $function$;

select * from public.test_function()