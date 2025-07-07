import type { paths } from "../types/world-api.schema.d.ts";
import { Post } from "./Post.ts";
import type { IRequestService } from "./RequestService.ts";

export type Verify =
  paths["/v2/pod/verify"]["post"]["responses"]["200"]["content"][
    "application/json"
  ];

export class VerifyAction extends Post<Verify> {
  constructor(requestService: IRequestService) {
    super(requestService, `v2/pod/verify`);
  }
}
