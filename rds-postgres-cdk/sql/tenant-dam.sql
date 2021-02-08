
-- Never run this is a production environment
DROP table if exists public.tenant_digitalassetmanagers;
DROP table if exists public.tenant;
DROP table if exists public.digitalassetmanagers;

CREATE TABLE public.tenant (
	id int4 NOT NULL GENERATED ALWAYS AS IDENTITY,
	name varchar NOT NULL,
	CONSTRAINT tenant_pk PRIMARY KEY (id)
);

CREATE TABLE public.digitalassetmanagers (
	id int4 NOT NULL GENERATED ALWAYS AS IDENTITY,
	name varchar NOT NULL,
	CONSTRAINT digitalassetmanagers_pk PRIMARY KEY (id)
);

CREATE TABLE public.tenant_digitalassetmanagers (
	id int4 NOT NULL GENERATED ALWAYS AS IDENTITY,
	tenant_id int4 NOT NULL,
	digitalassetmanager_id int4 NOT NULL,
	user_name varchar NOT NULL,
	private_key varchar NOT NULL,
	url varchar NOT NULL,
	CONSTRAINT tenant_digitalassetmanagers_pk PRIMARY KEY (id),
	CONSTRAINT tenant_digitalassetmanagers_un UNIQUE (tenant_id, digitalassetmanager_id)
);
CREATE INDEX tenant_digitalassetmanagers_digitalassetmanager_id_idx ON public.tenant_digitalassetmanagers USING btree (digitalassetmanager_id);
CREATE INDEX tenant_digitalassetmanagers_tenant_id_idx ON public.tenant_digitalassetmanagers USING btree (tenant_id);

ALTER TABLE public.tenant_digitalassetmanagers
	ADD CONSTRAINT tenant_digitalassetmanagers_tenant_fk
	FOREIGN KEY (tenant_id)
	REFERENCES tenant(id)
	ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE public.tenant_digitalassetmanagers
	ADD CONSTRAINT tenant_digitalassetmanagers_digitalassetmanagers_fk
	FOREIGN KEY (digitalassetmanager_id)
	REFERENCES digitalassetmanagers(id)
	ON UPDATE RESTRICT ON DELETE RESTRICT;


