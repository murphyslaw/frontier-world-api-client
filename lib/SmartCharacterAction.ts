import type { paths } from "../types/world-api.schema.d.ts";
import { Get } from "./Get.ts";
import type { IRequestService } from "./RequestService.ts";

export type SmartCharacter =
  paths["/v2/smartcharacters"]["get"]["responses"]["200"]["content"][
    "application/json"
  ];

export class SmartCharacterAction extends Get<SmartCharacter> {
  constructor(requestService: IRequestService, address: string) {
    if (!address) {
      throw new Error("id parameter required");
    }

    super(requestService, `v2/smartcharacters/${address}`);
  }
}
