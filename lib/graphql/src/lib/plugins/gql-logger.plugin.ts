import { Logger } from '@nestjs/common';
import {
  ApolloServerPlugin,
  BaseContext,
  GraphQLRequestContext,
  GraphQLRequestContextWillSendResponse,
  GraphQLRequestListener,
} from '@apollo/server';
import { v4 as uuidv4 } from 'uuid';

type resContext = GraphQLRequestContextWillSendResponse<BaseContext>;
type reqContext = GraphQLRequestContext<BaseContext>;
type reqListener = GraphQLRequestListener<BaseContext> | void;

export class GqlLoggingPlugin implements ApolloServerPlugin {
  private readonly logger = new Logger(GqlLoggingPlugin.name);

  async requestDidStart?(requestContext: reqContext): Promise<reqListener> {
    const { request } = requestContext;
    const start = Date.now();
    const requestId = uuidv4();

    this.logger.log({
      requestId,
      headers: request.http?.headers,
      query: request.query,
      variables: request.variables,
    });

    const logCb = async (responseContext: resContext) => {
      const duration = Date.now() - start;

      this.logger.log({
        requestId,
        query: request.query,
        statusCode: responseContext.response?.http?.status || 200,
        duration: `${duration}ms`,
      });
    };

    return { willSendResponse: logCb };
  }
}
