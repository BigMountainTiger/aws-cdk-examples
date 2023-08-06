package main

import (
	"context"

	"github.com/aws/aws-lambda-go/lambda"
)

type t struct {
	Body string `json:"body"`
}

func HandleRequest(ctx context.Context) (*t, error) {
	r := &t{
		Body: "Song Li - 1",
	}

	return r, nil
}

func main() {
	lambda.Start(HandleRequest)
}
