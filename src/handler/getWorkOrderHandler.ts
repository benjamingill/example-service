import _ from "lodash";
import { NotFound } from "http-errors";
import generateResponse from "../utility/generateResponse";
import { parse as parseUuid } from "uuid";
import { WorkOrderResponseBody, WorkOrderDTO } from "../types/workOrder";
import { WorkOrderDAO } from "../database/workOrdersDAO";

export const formatResult = (workOrderDto: WorkOrderDTO): WorkOrderResponseBody => ({
  ...workOrderDto,
  _links: {
    self: {
      href: `https://public-facing-endpoint/v1/work-orders/${workOrderDto.id}`,
    },
  },
});

export const getWorkOrder = async (event, context) => {
  const workOrderDAO: WorkOrderDAO = _.get(context, "db.workOrderDAO");
  const { id } = event.pathParameters;
  try {
    parseUuid(id);
  } catch (error) {
    throw new NotFound("Work Order does not exist");
  }
  const databaseResponse = await workOrderDAO.getWorkOrder(id);
  return generateResponse(200, formatResult(databaseResponse));
};
