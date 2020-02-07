import { ReadIsGreaterOrEqualHandler } from '../lib/classes/crud/Read-IsGreaterOrEqual-Handler.class'
import { IReadIsGreaterOrEqualRequest } from '../lib/interfaces/icrud/IReadIsGreaterOrEqualRequest.interface'
import { IResponse } from '../lib/classes/lambdahandler/Response.class'
import { Context, Callback } from 'aws-lambda'


export function handler(incomingRequest:IReadIsGreaterOrEqualRequest, context:Context, callback:Callback) {

  class HandlerObject extends ReadIsGreaterOrEqualHandler {
    protected requestI:IReadIsGreaterOrEqualRequest
    protected response:IResponse


    constructor(incomingRequest:IReadIsGreaterOrEqualRequest, context:Context, callback:Callback) {
      super(incomingRequest, context, callback)
    }


  } // End Handler Class ---------

  new HandlerObject(incomingRequest, context, callback)

} // End Main Handler Function -------
