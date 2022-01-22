import _, { map } from "lodash";
import { InternalServerError } from "http-errors";
import { WorkOrderDAO } from "../database/workOrdersDAO";
import generateResponse from "../utility/generateResponse";
import { WorkOrderDTO, WorkOrdersResponseBody } from "../types/workOrder";

export const formatResult = (workOrderDtos: WorkOrderDTO[]): WorkOrdersResponseBody => ({
  workOrders: map(workOrderDtos, workOrderDto => ({
    ...workOrderDto,
    _links: {
      self: {
        href: `https://public-facing-endpoint/v1/work-orders/${workOrderDto.id}`,
      },
    },
  })),
});

export const getWorkOrders = async (event, context) => {
  try {
    const workOrdersDAO: WorkOrderDAO = _.get(context, "db.workOrdersDAO");
    const workOrders = await workOrdersDAO.getWorkOrders();
    return generateResponse(200, formatResult(workOrders));
  } catch (err) {
    throw new InternalServerError(err);
  }
};
