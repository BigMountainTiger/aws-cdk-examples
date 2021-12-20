IF DB_ID('experiment') IS NOT NULL
BEGIN
	DROP database experiment;
END;

CREATE database experiment;

USE experiment;

CREATE TABLE experiment.dbo.Test_table (
	id int IDENTITY(0,1) NOT NULL,
	update_count int DEFAULT 0 NOT NULL,
	CONSTRAINT Test_table_PK PRIMARY KEY (id)
);

INSERT INTO Test_table (update_count) VALUES(0);