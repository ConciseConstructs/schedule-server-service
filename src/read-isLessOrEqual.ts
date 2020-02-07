import { ReadIsLessOrEqualHandler } from '../lib/classes/crud/Read-IsLessOrEqual-Handler.class'
import { IReadIsLessThanOrEqualRequest } from '../lib/interfaces/icrud/IReadIsLessThanOrEqualRequest.interface'
import { IResponse } from '../lib/classes/lambdahandler/Response.class'
import { Context, Callback } from 'aws-lambda'


export function handler(incomingRequest:IReadIsLessThanOrEqualRequest, context:Context, callback:Callback) {

  class HandlerObject extends ReadIsLessOrEqualHandler {
    protected request:IReadIsLessThanOrEqualRequest
    protected response:IResponse


    constructor(incomingRequest:IReadIsLessThanOrEqualRequest, context:Context, callback:Callback) {
      super(incomingRequest, context, callback)
    }


  } // End Handler Class ---------

  new HandlerObject(incomingRequest, context, callback)

} // End Main Handler Function -------
