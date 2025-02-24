const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLInt, GraphQLList } = require("graphql");
const mongoose = require("mongoose");

// Define Mongoose model
const Ticket = mongoose.model("Ticket", new mongoose.Schema({
    name: String,
    gender: String,
    age: Number,
    from: String,
    destination: String
}));

// GraphQL Types
const TicketType = new GraphQLObjectType({
    name: "Ticket",
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        gender: { type: GraphQLString },
        age: { type: GraphQLInt },
        from: { type: GraphQLString },
        destination: { type: GraphQLString }
    })
});

// Root Query
const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        tickets: {
            type: new GraphQLList(TicketType),
            resolve() {
                return Ticket.find();
            }
        }
    }
});

// Mutation (Create Ticket)
const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        addTicket: {
            type: TicketType,
            args: {
                name: { type: GraphQLString },
                gender: { type: GraphQLString },
                age: { type: GraphQLInt },
                from: { type: GraphQLString },
                destination: { type: GraphQLString }
            },
            resolve(parent, args) {
                const newTicket = new Ticket(args);
                return newTicket.save();
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
