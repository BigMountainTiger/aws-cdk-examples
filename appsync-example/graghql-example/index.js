const express = require('express');
const gq = require('graphql');
const express_graphql = require('express-graphql');

const users = [
    { id: 1, name: "Song Li" },
    { id: 2, name: "Joe Bidden" }
];

const items = [
    {
        id: "e4e39e95-c7bc-4ea0-a750-d38cd493dc4d",
        text: "Milk",
        completed: false,
        userId: 1
    },
    {
        id: "4237305f-baab-4dee-8258-b06231f12668",
        text: "Eggs",
        completed: true,
        userId: 1
    },
    {
        id: "1fb68592-7bf4-4341-8356-335be13751f4",
        text: "Juice",
        completed: false,
        userId: 2
    }
];

const UserType = new gq.GraphQLObjectType({
    name: "User", fields: () => ({
        id: { type: gq.GraphQLID },
        name: { type: gq.GraphQLString },
        items: {
            type: new gq.GraphQLList(ItemType),
            resolve: (parent) => {
                return items.filter(i => {
                    return i.userId == parent.id
                })
            }
        }
    })
});

const ItemType = new gq.GraphQLObjectType({
    name: "Item", fields: () => ({
        id: { type: gq.GraphQLID },
        text: { type: gq.GraphQLString },
        completed: { type: gq.GraphQLBoolean },
        user: {
            type: UserType,
            resolve: (parent) => {
                return users.find(i => {
                    return parent.userId == i.id
                })
            }
        }
    })
});

const schema = new gq.GraphQLSchema({

    query: new gq.GraphQLObjectType({
        name: 'root',
        fields: {
            users: {
                type: new gq.GraphQLList(UserType),
                args: { id: { type: gq.GraphQLID } },
                resolve: (parent, args) => {
                    const id = args.id;
                    if (id)
                        return users.filter(i => i.id == id);
                    else
                        return users;

                }
            },
            items: {
                type: new gq.GraphQLList(ItemType),
                args: { id: { type: gq.GraphQLID } },
                resolve: () => {
                    return items;
                }
            }
        }
    }),

    mutation: new gq.GraphQLObjectType({
        name: 'mutation',
        fields: {
            addUser: {
                type: UserType,
                args: {
                    name: { type: new gq.GraphQLNonNull(gq.GraphQLString) }
                },
                resolve: (parent, args) => {
                    const id = users.length + 1;
                    const user = {
                        id: id,
                        name: args.name
                    }

                    users.push(user);

                    return user;
                }
            }
        }
    })
});

const app = express();
app.use('/graphql', express_graphql
    .graphqlHTTP({ schema: schema, graphiql: true }));
app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));