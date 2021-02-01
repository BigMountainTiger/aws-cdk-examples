
drop table if exists public.student_class;
drop table if exists public.student;

CREATE TABLE public.student (
	id int4 NOT NULL GENERATED ALWAYS AS IDENTITY,
	"Name" varchar NOT NULL,
	CONSTRAINT student_pk PRIMARY KEY (id)
);

CREATE TABLE public.student_class (
	id int4 NOT NULL GENERATED ALWAYS AS IDENTITY,
	student_id int4 NOT NULL,
	"Name" varchar NOT NULL,
	score int2 NULL,
	CONSTRAINT student_class_pk PRIMARY KEY (id)
);
CREATE INDEX student_class_student_id_idx ON public.student_class USING btree (student_id);

ALTER TABLE public.student_class ADD CONSTRAINT student_class_fk FOREIGN KEY (student_id) REFERENCES student(id);