truncate table tenant_digitalassetmanagers restart identity cascade;
truncate table tenant restart identity cascade;
truncate table digitalassetmanagers restart identity cascade;

insert into tenant (name) values('tenant No.1');
insert into tenant (name) values('tenant No.2');

insert into digitalassetmanagers (name) values('digitalassetmanager No.1');
insert into digitalassetmanagers (name) values('digitalassetmanager No.2');

select * from tenant t;
select * from digitalassetmanagers;

insert into tenant_digitalassetmanagers (tenant_id, digitalassetmanager_id, user_name, private_key, url)
	values (1, 1, 'user_name_1_1', 'private_key_1_1', 'url');

update tenant set name = 'Updated - ' || name where id = 1;
update digitalassetmanagers set name = 'Updated - ' || name where id = 1;

select * from tenant;
select * from digitalassetmanagers;

update tenant_digitalassetmanagers set user_name = 'Updated' || user_name where id = 1;

select * from tenant_digitalassetmanagers;



    