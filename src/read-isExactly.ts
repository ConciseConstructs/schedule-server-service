import { ReadIsExactlyHandler } from '../lib/classes/crud/Read-IsExactly-Handler.class'
import { IReadIsExactlyRequest } from '../lib/interfaces/icrud/IReadIsExactlyRequest.interface'
import { IResponse } from '../lib/classes/lambdahandler/Response.class'
import { Context, Callback } from 'aws-lambda'


export function handler(incomingRequest:IReadIsExactlyRequest, context:Context, callback:Callback) {

  class HandlerObject extends ReadIsExactlyHandler {
    protected request:IReadIsExactlyRequest
    protected response:IResponse


    constructor(incomingRequest:IReadIsExactlyRequest, context:Context, callback:Callback) {
      super(incomingRequest, context, callback)
    }


  } // End Handler Class ---------

  new HandlerObject(incomingRequest, context, callback)

} // End Main Handler Function -------
