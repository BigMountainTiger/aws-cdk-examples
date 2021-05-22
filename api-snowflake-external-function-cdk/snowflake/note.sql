-- https://docs.snowflake.com/en/sql-reference/external-functions-creating-aws.html#step-3-create-the-external-function
-- https://docs.snowflake.com/en/sql-reference/external-functions-creating-aws.html#label-external-functions-creating-aws-create-api-integration
-- https://docs.snowflake.com/en/sql-reference/external-functions-creating-aws.html#label-external-functions-creating-aws-create-external-function
-- https://docs.snowflake.com/en/sql-reference/external-functions-creating-aws.html#label-external-functions-creating-aws-call-external-function
-- https://docs.snowflake.com/en/sql-reference/external-functions-data-format.html
-- https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html

SHOW integrations;
SHOW external functions;

create or replace api integration api_integration_01
    api_provider=aws_api_gateway
    api_aws_role_arn='arn:aws:iam::660079349745:role/SNOWFLAKE'
    api_allowed_prefixes=('https://jqr34w4uq0.execute-api.us-east-1.amazonaws.com/prod/')
    enabled=true;
    
create or replace external function my_external_function(msg varchar, detail varchar)
    returns variant
    api_integration = api_integration_01
    as 'https://jqr34w4uq0.execute-api.us-east-1.amazonaws.com/prod/';


SELECT my_external_function('This is my message', 'The is a test message');

CREATE or REPLACE PROCEDURE test_external_function()
RETURNS VARCHAR NOT NULL
LANGUAGE javascript
AS
$$
    let result = 'SUCCESS';
    const st = snowflake.createStatement;
    
    const msg = 'This is song';
    const detail = 'This is the detail and it is OK';
    st({sqlText: 'select my_external_function(?, ?)', binds: [msg, detail]}).execute();
    
    return result;
$$;

CALL test_external_function();