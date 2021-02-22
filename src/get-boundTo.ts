import { IGetBoundToRequest } from '../lib/interfaces/schedule-server-service-interface/get-boundTo.interface'
import { IResponse } from '../lib/classes/lambdahandler/Response.class'
import { Context, Callback } from 'aws-lambda'
import { LambdaHandler } from '../lib/classes/lambdahandler/LambdaHandler.class'


export function handler(incomingRequest:IGetBoundToRequest, context:Context, callback:Callback) {

  class HandlerObject extends LambdaHandler {
    protected request:IGetBoundToRequest
    protected response:IResponse
    private syntax:any


    constructor(incomingRequest:IGetBoundToRequest, context:Context, callback:Callback) {
      super(incomingRequest, context, callback)
    }




    protected hookConstructorPre() {
      this.requiredInputs = ['accountId', 'boundTo']
      this.needsToConnectToDatabase = true
    }




protected performActions() {
  this.makeSyntax()
  this.performQuery()
}




    protected makeSyntax() {
      this.syntax = {
        TableName : `_schedule-${ process.env.stage }`,
        IndexName: 'accountId-boundTo-index',
        KeyConditionExpression: '#accountId = :accountId AND #boundTo = :boundTo',
        ExpressionAttributeNames:{
            "#accountId": 'accountId',
            "#boundTo": 'boundTo'
        },
        ExpressionAttributeValues: {
            ":accountId": this.request.accountId,
            ":boundTo": this.request.boundTo
        }
      }
    }






    protected addLastEvaluatedKeySyntax() {
      this.syntax.ExclusiveStartKey = JSON.parse(this.request.lastEvaluatedKey)
    }




    protected performQuery() {
      this.db.query(this.syntax).promise()
        .then(result => this.hasSucceeded(result))
        .catch(error => this.hasFailed(error))
    }



  } // End Handler Class ---------

  new HandlerObject(incomingRequest, context, callback)

} // End Main Handler Function -------
