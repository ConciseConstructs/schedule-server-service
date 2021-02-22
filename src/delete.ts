import { IDeleteRequest } from '../lib/interfaces/icrud/IDeleteRequest.interface'
import { IResponse } from '../lib/classes/lambdahandler/Response.class'
import { Context, Callback } from 'aws-lambda'
import { LambdaHandler } from '../lib/classes/lambdahandler/LambdaHandler.class'


export function handler(incomingRequest:IDeleteRequest, context:Context, callback:Callback) {

  class HandlerObject extends LambdaHandler {
    protected request:IDeleteRequest
    protected response:IResponse


    constructor(incomingRequest:IDeleteRequest, context:Context, callback:Callback) {
      super(incomingRequest, context, callback)
    }




    protected hookConstructorPre() {
      this.requiredInputs = ['id']
      this.needsToConnectToDatabase = true
    }







  protected async performActions() {
    this.db.delete(this.makeDeleteSyntax()).promise()
      .then(result => this.hasSucceeded(result))
      .catch(error => this.hasFailed(error))
  }




      protected makeDeleteSyntax() {
        return {
          TableName: `_schedule-${ process.env.stage }`,
          Key: {
            id: this.request.id
          }
        }
      }


  } // End Handler Class ---------

  new HandlerObject(incomingRequest, context, callback)

} // End Main Handler Function -------
