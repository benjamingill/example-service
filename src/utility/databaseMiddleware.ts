import pgPromise from "pg-promise";
import { IMain, IDatabase } from "pg-promise";
import _ from "lodash";
import { WorkOrderDAO } from "../database/workOrdersDAO";

type Handler = (handler: any, next: any) => Promise<void>;

export function databaseMiddleware({ dbConfig }: { dbConfig: any }): Handler {
  const pgp: IMain = pgPromise();
  return async function initializeDatabaseMiddleware(handler, next) {
    const db: IDatabase<any> = pgp(dbConfig);
    try {
      _.set(handler, "context.db.workOrderDAO", new WorkOrderDAO({ database: db }));
      await next();
    } finally {
      await db.$pool.end();
    }
  };
}
