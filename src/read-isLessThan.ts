import { ReadIsLessThanHandler } from '../lib/classes/crud/Read-IsLessThan-Handler.class'
import { IReadIsLessThanRequest } from '../lib/interfaces/icrud/IReadIsLessThanRequest.interface'
import { IResponse } from '../lib/classes/lambdahandler/Response.class'
import { Context, Callback } from 'aws-lambda'


export function handler(incomingRequest:IReadIsLessThanRequest, context:Context, callback:Callback) {

  class HandlerObject extends ReadIsLessThanHandler {
    protected request:IReadIsLessThanRequest
    protected response:IResponse


    constructor(incomingRequest:IReadIsLessThanRequest, context:Context, callback:Callback) {
      super(incomingRequest, context, callback)
    }


  } // End Handler Class ---------

  new HandlerObject(incomingRequest, context, callback)

} // End Main Handler Function -------
