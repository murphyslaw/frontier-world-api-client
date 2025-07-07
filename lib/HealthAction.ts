import type { paths } from "../types/world-api.schema.d.ts";
import { Get } from "./Get.ts";
import type { IRequestService } from "./RequestService.ts";

export type Health =
  paths["/health"]["get"]["responses"]["200"]["content"]["application/json"];

export class HealthAction extends Get<Health> {
  constructor(requestService: IRequestService) {
    super(requestService, "health");
  }
}
