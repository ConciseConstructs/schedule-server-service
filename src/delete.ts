import { DeleteHandler } from '../lib/classes/crud/DeleteHandler.class'
import { IDeleteRequest } from '../lib/interfaces/icrud/IDeleteRequest.interface'
import { IResponse } from '../lib/classes/lambdahandler/Response.class'
import { Context, Callback } from 'aws-lambda'


export function handler(incomingRequest:IDeleteRequest, context:Context, callback:Callback) {

  class HandlerObject extends DeleteHandler {
    protected request:IDeleteRequest
    protected response:IResponse


    constructor(incomingRequest:IDeleteRequest, context:Context, callback:Callback) {
      super(incomingRequest, context, callback)
    }


  } // End Handler Class ---------

  new HandlerObject(incomingRequest, context, callback)

} // End Main Handler Function -------
