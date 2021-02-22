import { Context, Callback } from 'aws-lambda'
import { IResponse } from '../lib/classes/lambdahandler/Response.class'
import { UpdateHandler } from '../lib/classes/crud/UpdateHandler.class'
import { IScheduleUpdateRequest } from '../lib/interfaces/schedule-server-service-interface/update.interface'


export function handler(incomingRequest:IScheduleUpdateRequest, context:Context, callback:Callback) {

  class HandlerObject extends UpdateHandler {

    protected request:IScheduleUpdateRequest
    protected response:IResponse


    constructor(incomingRequest:IScheduleUpdateRequest, context:Context, callback:Callback) {
      super(incomingRequest, context, callback)
    }












    protected hookConstructorPre() {
      this.requiredInputs = ['item']
      this.needsToConnectToDatabase = true
    }












    protected performActions() {
      this.db.put(this.makePutSyntax()).promise()
        .then(result => this.hasSucceeded(result))
        .catch(error => this.hasFailed(error))
    }




        protected makePutSyntax() {
          return {
            TableName: `_schedule-${ process.env.stage }`,
            Item: this.request.item
          }
        }

  } // End Handler Class ---------

  new HandlerObject(incomingRequest, context, callback)

} // End Main Handler Function -------
