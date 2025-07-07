import type { paths } from "../types/world-api.schema.d.ts";
import { Get } from "./Get.ts";
import type { IRequestService } from "./RequestService.ts";

export type AbiConfig =
  paths["/abis/config"]["get"]["responses"]["200"]["content"][
    "application/json"
  ];

export class AbiConfigAction extends Get<AbiConfig> {
  constructor(requestService: IRequestService) {
    super(requestService, "abis/config");
  }
}
