const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLInt, GraphQLList, GraphQLID } = require("graphql");
const mongoose = require("mongoose");

// Define Ticket Model (Mongoose)
const Ticket = mongoose.model("Ticket", new mongoose.Schema({
    name: String,
    gender: String,
    age: Number,
    from: String,
    destination: String
}));

// Define GraphQL Ticket Type
const TicketType = new GraphQLObjectType({
    name: "Ticket",
    fields: () => ({
        id: { type: GraphQLID },  // Changed from String to ID
        name: { type: GraphQLString },
        gender: { type: GraphQLString },
        age: { type: GraphQLInt },
        from: { type: GraphQLString },
        destination: { type: GraphQLString }
    })
});

// Root Query (Fetch Tickets)
const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        tickets: {
            type: new GraphQLList(TicketType),
            async resolve() {
                try {
                    return await Ticket.find();
                } catch (error) {
                    throw new Error("Error fetching tickets: " + error.message);
                }
            }
        }
    }
});

// Mutations (Add, Update, Delete Tickets)
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
            async resolve(parent, args) {
                try {
                    const newTicket = new Ticket(args);
                    return await newTicket.save();
                } catch (error) {
                    throw new Error("Error adding ticket: " + error.message);
                }
            }
        },
        updateTicket: {
            type: TicketType,
            args: {
                id: { type: GraphQLID },
                name: { type: GraphQLString },
                gender: { type: GraphQLString },
                age: { type: GraphQLInt },
                from: { type: GraphQLString },
                destination: { type: GraphQLString }
            },
            async resolve(parent, args) {
                try {
                    return await Ticket.findByIdAndUpdate(args.id, args, { new: true });
                } catch (error) {
                    throw new Error("Error updating ticket: " + error.message);
                }
            }
        },
        deleteTicket: {
            type: TicketType,
            args: {
                id: { type: GraphQLID }
            },
            async resolve(parent, args) {
                try {
                    return await Ticket.findByIdAndDelete(args.id);
                } catch (error) {
                    throw new Error("Error deleting ticket: " + error.message);
                }
            }
        }
    }
});

// Export Schema
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
