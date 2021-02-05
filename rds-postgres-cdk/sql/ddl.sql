-- Tables
drop table if exists public.student_class;
drop table if exists public.student;

CREATE TABLE public.student (
	id int4 NOT NULL GENERATED ALWAYS AS IDENTITY,
	name varchar NOT NULL,
	CONSTRAINT student_pk PRIMARY KEY (id)
);

CREATE TABLE public.student_class (
	id int4 NOT NULL GENERATED ALWAYS AS IDENTITY,
	student_id int4 NOT NULL,
	name varchar NOT NULL,
	score int2 NULL,
	CONSTRAINT student_class_pk PRIMARY KEY (id)
);
CREATE INDEX student_class_student_id_idx ON public.student_class USING btree (student_id);

ALTER TABLE public.student_class ADD CONSTRAINT student_class_fk FOREIGN KEY (student_id) REFERENCES student(id);

-- Functions
drop function if exists public.get_students();

-- public.get_students()
CREATE OR REPLACE FUNCTION public.get_students()
 RETURNS TABLE(id int4, name varchar)
 LANGUAGE plpgsql
AS $function$
BEGIN
 
 return QUERY
 SELECT s.id, s.name from public.student s;

END; $function$;

-- public.get_a_student(student_id int4);
drop function if exists public.get_a_student(student_id int4);

CREATE OR REPLACE FUNCTION public.get_a_student(student_id int4)
 RETURNS TABLE(id int4, name varchar)
 LANGUAGE plpgsql
AS $function$
BEGIN
 
 return QUERY
 SELECT s.id, s.name from public.student s where s.id = student_id;

END; $function$;

-- public.get_a_student_by_name(student_name varchar);
drop function if exists public.get_a_student_by_name(student_name varchar);

CREATE OR REPLACE FUNCTION public.get_a_student_by_name(student_name varchar)
 RETURNS TABLE(id int4, name varchar)
 LANGUAGE plpgsql
AS $function$
BEGIN
 
 return QUERY
 SELECT s.id, s.name from public.student s where s.name = student_name;

END; $function$;

-- Added test data
insert into public.student (name) values ('Song Li - 1');
insert into public.student (name) values ('Song Li - 2');
insert into public.student (name) values ('Song Li - 3');

