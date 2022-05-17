const express = require('express');
const gq = require('graphql');
const express_graphql = require('express-graphql');

const schema = new gq.GraphQLSchema({
    query: new gq.GraphQLObjectType({
        name: 'RootQuery',
        fields: {
            hello: {
                type: gq.GraphQLString,
                resolve: () => {
                    return 'Hello world!'
                }
            },
            another_hello: {
                type: gq.GraphQLString,
                resolve: () => {
                    return 'This is another Hello world!'
                }
            }
        }
    })
});

const app = express();
app.use('/graphql', express_graphql
    .graphqlHTTP({ schema: schema, graphiql: true }));
app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));