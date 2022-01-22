import { Context } from "aws-lambda";
import { WorkOrderDAO } from "../database/workOrdersDAO";

export type PathfinderDatabaseContext = {
  workOrderDAO: WorkOrderDAO;
};

export type PathfinderContext = Context & {
  db: PathfinderDatabaseContext;
};
