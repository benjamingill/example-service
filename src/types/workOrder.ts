export type WorkOrder = {
  id: string;
  status: string;
};

export type WorkOrderDTO = {
  id: string;
  version: number;
  status: string;
};

export type WorkOrderResponseBody = WorkOrderDTO & {
  _links: {
    self: {
      href: string;
    };
  };
};

export type WorkOrdersResponseBody = {
  workOrders: WorkOrder[];
};
