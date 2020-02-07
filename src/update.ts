import { UpdateHandler } from '../lib/classes/crud/UpdateHandler.class'
import { IUpdateRequest } from '../lib/interfaces/icrud/IUpdateRequest.interface'
import { IResponse } from '../lib/classes/lambdahandler/Response.class'
import { Context, Callback } from 'aws-lambda'


export function handler(incomingRequest:IUpdateRequest, context:Context, callback:Callback) {

  class HandlerObject extends UpdateHandler {
    protected request:IUpdateRequest
    protected response:IResponse


    constructor(incomingRequest:IUpdateRequest, context:Context, callback:Callback) {
      super(incomingRequest, context, callback)
    }


  } // End Handler Class ---------

  new HandlerObject(incomingRequest, context, callback)

} // End Main Handler Function -------
