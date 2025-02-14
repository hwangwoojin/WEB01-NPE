import { graphqlHTTP } from "express-graphql";
import { GraphQLSchema, GraphQLObjectType, graphql } from "graphql";
import { buildSchema } from "type-graphql";
import { authChecker } from "../middlewares/AuthChecker";
import AnswerResolver from "./resolvers/AnswerResolver";
import QuestionResolver from "./resolvers/QuestionResolver";
import TagResolver from "./resolvers/TagResolver";
import UserResolver from "./resolvers/UserResolver";

export default class GraphQLMiddleware {
  private static schema: GraphQLSchema;

  public static async get() {
    if (!this.schema) {
      const schema = await buildSchema({
        resolvers: [
          UserResolver,
          QuestionResolver,
          TagResolver,
          AnswerResolver,
        ],
        authChecker: authChecker,
      });

      this.schema = schema;
    }

    return graphqlHTTP({
      schema: this.schema,
      graphiql: true,
    });
  }
}
