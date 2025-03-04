const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLInt, GraphQLList } = require("graphql");
const mongoose = require("mongoose");

const Ticket = mongoose.model("Ticket", new mongoose.Schema({
    name: String,
    gender: String,
    age: Number,
    from: String,
    destination: String
}));

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
        },
        updateTicket: {
            type: TicketType,
            args: {
                id: { type: GraphQLString },
                name: { type: GraphQLString },
                gender: { type: GraphQLString },
                age: { type: GraphQLInt },
                from: { type: GraphQLString },
                destination: { type: GraphQLString }
            },
            async resolve(parent, args) {
                return await Ticket.findByIdAndUpdate(args.id, args, { new: true });
            }
        },
        deleteTicket: {
            type: TicketType,
            args: {
                id: { type: GraphQLString }
            },
            async resolve(parent, args) {
                return await Ticket.findByIdAndDelete(args.id);
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
