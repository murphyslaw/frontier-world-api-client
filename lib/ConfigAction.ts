import type { paths } from "../types/world-api.schema.d.ts";
import { Get } from "./Get.ts";
import type { IRequestService } from "./RequestService.ts";

export type Config =
  paths["/config"]["get"]["responses"]["200"]["content"]["application/json"];

export class ConfigAction extends Get<Config[]> {
  constructor(requestService: IRequestService) {
    super(requestService, "config");
  }
}
