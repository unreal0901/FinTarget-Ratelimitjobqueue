import { IResponse } from "../../types/GenericReponse";
export class HealthService {
  public checkHealth(): IResponse {
    return {
      error: false,
      status: "OK",
      message: "Service is healthy",
    };
  }
}
