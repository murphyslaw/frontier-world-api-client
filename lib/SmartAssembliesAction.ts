import type { paths } from "../types/world-api.schema.d.ts";
import { Get } from "./Get.ts";
import { Paginated } from "./Paginated.ts";
import type { IRequestService } from "./RequestService.ts";

export type SmartAssemblies =
  paths["/v2/smartassemblies"]["get"]["responses"]["200"]["content"][
    "application/json"
  ];

export class SmartAssembliesAction extends Paginated(Get)<SmartAssemblies> {
  constructor(requestService: IRequestService, limit: number, offset: number) {
    if (!limit) {
      throw new Error("limit parameter required");
    }

    if (offset === undefined) {
      throw new Error("offset parameter required");
    }

    super(requestService, "v2/smartassemblies");

    this.limit = limit;
    this.offset = offset;
  }
}
