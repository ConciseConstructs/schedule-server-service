import { ReadIsGreaterThanHandler } from '../lib/classes/crud/Read-IsGreaterThan-Handler.class'
import { IReadIsGreaterThanRequest } from '../lib/interfaces/icrud/IReadIsGreaterThanRequest.interface'
import { IResponse } from '../lib/classes/lambdahandler/Response.class'
import { Context, Callback } from 'aws-lambda'


export function handler(incomingRequest:IReadIsGreaterThanRequest, context:Context, callback:Callback) {

  class HandlerObject extends ReadIsGreaterThanHandler {
    protected request:IReadIsGreaterThanRequest
    protected response:IResponse


    constructor(incomingRequest:IReadIsGreaterThanRequest, context:Context, callback:Callback) {
      super(incomingRequest, context, callback)
    }


  } // End Handler Class ---------

  new HandlerObject(incomingRequest, context, callback)

} // End Main Handler Function -------
