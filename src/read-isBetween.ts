import { ReadIsBetweenHandler } from '../lib/classes/crud/Read-IsBetween-Handler.class'
import { IReadIsBetweenRequest } from '../lib/interfaces/icrud/IReadIsBetweenRequest.interface'
import { IResponse } from '../lib/classes/lambdahandler/Response.class'
import { Context, Callback } from 'aws-lambda'


export function handler(incomingRequest:IReadIsBetweenRequest, context:Context, callback:Callback) {

  class HandlerObject extends ReadIsBetweenHandler {
    protected request:IReadIsBetweenRequest
    protected response:IResponse


    constructor(incomingRequest:IReadIsBetweenRequest, context:Context, callback:Callback) {
      super(incomingRequest, context, callback)
    }


  } // End Handler Class ---------

  new HandlerObject(incomingRequest, context, callback)

} // End Main Handler Function -------
