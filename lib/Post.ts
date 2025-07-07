import { Action } from "./Action.ts";

export abstract class Post<T> extends Action<T> {
  public async execute(body: unknown): Promise<T> {
    try {
      const response = await this.requestService.post<T>(
        this.path,
        body,
        this.init,
      );

      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }
}
