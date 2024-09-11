import express from "express";
import { ResponseWrapper } from "../utils/Response";

export class HealthController {
  /**
   * Mostly for k8s to know that the service is still alive. Should ping this API every x seconds.
   * @param _request
   * @param res
   */
  public async health(_request: express.Request, res: express.Response) {
    return new ResponseWrapper(res).ok({});
  }
}
