const express = require('express');
const bodyParser = require('body-parser');
const { graphql , buildSchema } = require('graphql');
var { graphqlHTTP } = require("express-graphql");
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());

const dummyEvents = [{
    id: 1,
    name: "Dancing",
    description: "Came and dance together",
    price: 20.5
},
{
    id: 2,
    name: "Runing",
    description: "Came and run together",
    price: 10.5
}]
app.use('/graphql', graphqlHTTP({
    schema: buildSchema(`
        type Event {
            id: ID!
            name: String!
            description: String
            price: Float!
        }

        input EventInput {
            id: ID!
            name: String!
            description: String
            price: Float!
        }

        type RootQuery {
            events: [Event]
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            return dummyEvents;
        },
        createEvent: (args) => {
            const event = {
                id: 2,
                name: "Runing",
                description: "Came and run together",
                price: 10.5
            }
            dummyEvents.push(event);
            return event;
        }
    },
    graphiql: true
})) 

const PORT = 8000;
console.log("process.env.MONGO_USER: ", process.env.MONGO_USER)
mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.9bw4kll.mongodb.net/?retryWrites=true&w=majority`
).then(() => 
    app.listen(PORT, () => {
        console.log(`Running a GraphQL API server at http://localhost:${PORT}/graphql`)
    })
).catch((err) => {
    console.log(err)
})
