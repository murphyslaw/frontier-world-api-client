import type { paths } from "../types/world-api.schema.d.ts";
import { Get } from "./Get.ts";
import { Paginated } from "./Paginated.ts";
import type { IRequestService } from "./RequestService.ts";

export type Types =
  paths["/v2/types"]["get"]["responses"]["200"]["content"]["application/json"];

export class TypesAction extends Paginated(Get)<Types> {
  constructor(requestService: IRequestService, limit: number, offset: number) {
    if (!limit) {
      throw new Error("limit parameter required");
    }

    if (offset === undefined) {
      throw new Error("offset parameter required");
    }

    super(requestService, "v2/types");

    this.limit = limit;
    this.offset = offset;
  }
}
