import { IResponse } from '../lib/classes/lambdahandler/Response.class'
import { Context, Callback } from 'aws-lambda'
import { LambdaHandler } from '../lib/classes/lambdahandler/LambdaHandler.class'

export interface IRemoveBoundToRequest {
  accountId:string
  id:string
}

export function handler(incomingRequest:IRemoveBoundToRequest, context:Context, callback:Callback) {

  class HandlerObject extends LambdaHandler {
    protected request:IRemoveBoundToRequest
    protected response:IResponse
    private items:any


    constructor(incomingRequest:IRemoveBoundToRequest, context:Context, callback:Callback) {
      super(incomingRequest, context, callback)
    }




    protected hookConstructorPre() {
      this.requiredInputs = ['accountId', 'id']
      this.needsToExecuteLambdas = true
    }







  protected async performActions() {
    await this.getScheduledJobsAssociatedWithRemovedRecord()
    this.items.forEach(item => this.requestRemoval(item))
  }




      private getScheduledJobsAssociatedWithRemovedRecord() {
        return this.lambda.invoke({
          FunctionName: `Schedule-${ process.env.stage }-get-boundTo`,
          Payload: JSON.stringify({
            accountId: this.request.accountId,
            boundTo: this.request.id
          })
        }).promise()
          .then(result => {
            let payload = JSON.parse((result as any).Payload)
            let body = JSON.parse(payload.body)
            this.items = body.details.Items
          })
          .catch(error => this.hasFailed(error))
      }




      private requestRemoval(item) {
        this.lambda.invoke({
          FunctionName: `Schedule-${ process.env.stage }-delete`,
          Payload: JSON.stringify({
            accountId: item.accountId,
            id: item.id
          })
        }).promise()
      }

  } // End Handler Class ---------

  new HandlerObject(incomingRequest, context, callback)

} // End Main Handler Function -------
