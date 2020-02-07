import { ReadAllHandler } from '../lib/classes/crud/Read-All-Handler.class'
import { IReadAllRequest } from '../lib/interfaces/icrud/IReadAllRequest.interface'
import { IResponse } from '../lib/classes/lambdahandler/Response.class'
import { Context, Callback } from 'aws-lambda'


export function handler(incomingRequest:IReadAllRequest, context:Context, callback:Callback) {

  class HandlerObject extends ReadAllHandler {
    protected request:IReadAllRequest
    protected response:IResponse


    constructor(incomingRequest:IReadAllRequest, context:Context, callback:Callback) {
      super(incomingRequest, context, callback)
    }


  } // End Handler Class ---------

  new HandlerObject(incomingRequest, context, callback)

} // End Main Handler Function -------
