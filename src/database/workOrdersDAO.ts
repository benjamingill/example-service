import { IDatabase } from "pg-promise";
import { WorkOrderDTO } from "../types/workOrder";

export class WorkOrderDAO {
  private readonly database: IDatabase<any>;

  constructor({ database }: { database: IDatabase<any> }) {
    this.database = database;
  }

  public async getWorkOrders(): Promise<WorkOrderDTO[]> {
    const query = "SELECT * FROM work_order";
    return this.database.manyOrNone<WorkOrderDTO>(query);
  }

  public async getWorkOrder(id: string): Promise<WorkOrderDTO> {
    const query = "SELECT * FROM work_order WHERE id = ${id}";
    return this.database.oneOrNone<WorkOrderDTO>(query, { id });
  }
}
