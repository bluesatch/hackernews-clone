/* creating a raw GraphQL Server using tutorial from: 
https://www.howtographql.com/graphql-js/1-getting-started/

using apollo-server => a fully featured GraphQL server based on Express.js (Yay!)

Here’s a list of its features:

GraphQL spec-compliant
Realtime functionality with GraphQL subscriptions
Out-of-the-box support for GraphQL Playground
Extensible via Express middlewares
Resolves custom directives in your GraphQL schema
Query performance tracing
Runs everywhere: Can be deployed via Vercel, Up, AWS Lambda, Heroku etc.

When adding a new feature to the API, the process looks very similar each time: 

1. Extend the GraphQL schema definition with a new root field (and new object types, if needed)
2. Implement corresponding resolver functions for the added fields

This process is also referred to as schema-driven or schema-first development.

*/


//Let's get started!!

// importing PrismaClient 
const { PrismaClient } = require('@prisma/client')

const { ApolloServer } = require('apollo-server')

const { getUserId } = require('./utils')

const { PubSub } = require('apollo-server')
const pubsub = new PubSub()

// new resolvers 
const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const User = require('./resolvers/User')
const Link = require('./resolvers/Link')
const Subscription = require('./resolvers/Subscription')
const Vote = require('./resolvers/Vote')

const fs = require('fs')
const path = require('path')
// 1 

// Note: ! means field is required and can never be null

/**
 * 
 * Every GraphQL Schema has three special root types: Query, Mutation, and Subscription
 * 
 * in example, info is a root field
 */

// copying schema and pasting into schema.graphql



// 2 
const resolvers = {
    Query,
    Mutation,
    Subscription,
    User,
    Link,
    Vote
}

const prisma = new PrismaClient()

// 3
const server = new ApolloServer({
    typeDefs: fs.readFileSync(
        path.join(__dirname, 'schema.graphql'),
        'utf8'
    ),
    resolvers,
    context: ({ req })=> {
        return {
            ...req,
            prisma,
            pubsub,
            userId: 
                req && req.headers.authorization 
                ? getUserId(req)
                : null
        }
    }
})


server.listen().then(({ url})=> console.log(`Server is running on url: ${url}`))