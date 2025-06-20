import { Logger } from '@nestjs/common';
import {
  ApolloServerPlugin,
  BaseContext,
  GraphQLRequestContext,
  GraphQLRequestContextWillSendResponse,
  GraphQLRequestListener,
} from '@apollo/server';

type resContext = GraphQLRequestContextWillSendResponse<BaseContext>;
type reqContext = GraphQLRequestContext<BaseContext>;
type reqListener = GraphQLRequestListener<BaseContext> | void;

export class GqlLoggingPlugin implements ApolloServerPlugin {
  private readonly logger = new Logger(GqlLoggingPlugin.name);

  async requestDidStart?(requestContext: reqContext): Promise<reqListener> {
    const { request } = requestContext;
    const start = Date.now();

    this.logger.log({
      headers: request.http?.headers,
      query: request.query,
      variables: request.variables,
    });

    const logCb = async (responseContext: resContext) => {
      const duration = Date.now() - start;

      this.logger.log({
        query: request.query,
        statusCode: responseContext.response?.http?.status || 200,
        duration: `${duration}ms`,
      });
    };

    return { willSendResponse: logCb };
  }
}
