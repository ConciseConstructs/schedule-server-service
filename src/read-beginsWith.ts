import { ReadBeginsWithHandler } from '../lib/classes/crud/Read-BeginsWith-Handler.class'
import { IReadBeginsWithRequest } from '../lib/interfaces/icrud/IReadBeginsWithRequest.interface'
import { IResponse } from '../lib/classes/lambdahandler/Response.class'
import { Context, Callback } from 'aws-lambda'


export function handler(incomingRequest:IReadBeginsWithRequest, context:Context, callback:Callback) {

  class HandlerObject extends ReadBeginsWithHandler {
    protected request:IReadBeginsWithRequest
    protected response:IResponse


    constructor(incomingRequest:IReadBeginsWithRequest, context:Context, callback:Callback) {
      super(incomingRequest, context, callback)
    }


  } // End Handler Class ---------

  new HandlerObject(incomingRequest, context, callback)

} // End Main Handler Function -------
