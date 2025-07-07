import type { paths } from "../types/world-api.schema.d.ts";
import { Get } from "./Get.ts";
import type { IRequestService } from "./RequestService.ts";

export type Fuels =
  paths["/v2/fuels"]["get"]["responses"]["200"]["content"]["application/json"];

export class FuelsAction extends Get<Fuels> {
  constructor(requestService: IRequestService) {
    super(requestService, "v2/fuels");
  }
}
