import { Action } from "./Action.ts";

export class Get<T> extends Action<T> {
  public async execute(): Promise<T> {
    try {
      const response = await this.requestService.get<T>(
        this.path,
        this.init,
      );

      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }
}
