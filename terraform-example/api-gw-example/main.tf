terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"
}

resource "aws_iam_role" "lambda_role" {
  name               = "lambda_role"
  assume_role_policy = <<EOF
    {
    "Version": "2012-10-17",
    "Statement": [
        {
        "Action": "sts:AssumeRole",
        "Principal": {
            "Service": "lambda.amazonaws.com"
        },
        "Effect": "Allow",
        "Sid": ""
        }
    ]
    }
    EOF
}

data "archive_file" "lambda_zip" {
  type        = "zip"
  output_path = "${path.module}/.tf-zip/simple_lambda.zip"
  source_dir  = "${path.module}/lambdas/simple_lambda"
}

resource "aws_lambda_function" "hello_world" {
  function_name    = "hello_world_lambda"
  filename         = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  role             = aws_iam_role.lambda_role.arn
  handler          = "app.lambdaHandler"
  runtime          = "python3.9"
  depends_on = [
    data.archive_file.lambda_zip
  ]
}

resource "aws_lambda_permission" "apigw_lambda_permission" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.hello_world.function_name
  principal     = "apigateway.amazonaws.com"
}

resource "aws_api_gateway_rest_api" "hello_world" {
  name        = "hello_world"
  description = "This is my API for demonstration purposes"
}

resource "aws_api_gateway_resource" "hello_resource" {
  rest_api_id = aws_api_gateway_rest_api.hello_world.id
  parent_id   = aws_api_gateway_rest_api.hello_world.root_resource_id
  path_part   = "hello"
}

resource "aws_api_gateway_method" "method" {
  rest_api_id   = aws_api_gateway_rest_api.hello_world.id
  resource_id   = aws_api_gateway_resource.hello_resource.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "hello_world" {
  rest_api_id             = aws_api_gateway_rest_api.hello_world.id
  resource_id             = aws_api_gateway_resource.hello_resource.id
  http_method             = aws_api_gateway_method.method.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.hello_world.invoke_arn
}


resource "aws_api_gateway_deployment" "hello_world" {
  rest_api_id = aws_api_gateway_rest_api.hello_world.id

  triggers = {
    redeployment = sha1(jsonencode(aws_api_gateway_rest_api.hello_world.body))
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "hello_world" {
  deployment_id = aws_api_gateway_deployment.hello_world.id
  rest_api_id   = aws_api_gateway_rest_api.hello_world.id
  stage_name    = "hello_stage"
}
