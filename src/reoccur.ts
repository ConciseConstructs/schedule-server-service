import { Context, Callback } from 'aws-lambda'
import { IResponse } from '../lib/classes/lambdahandler/Response.class'
import { LambdaHandler } from '../lib/classes/lambdahandler/LambdaHandler.class'
import { IReoccurRequest } from '../lib/interfaces/schedule-server-service-interface/reoccur.interface'


export function handler(incomingRequest:IReoccurRequest, context:Context, callback:Callback) {

  class HandlerObject extends LambdaHandler {

    protected request:IReoccurRequest
    protected response:IResponse
    private newJobDate:any
    private newJobRecord:any


    constructor(incomingRequest:IReoccurRequest, context:Context, callback:Callback) {
      super(incomingRequest, context, callback)
      console.log('starting...')
    }












    protected hookConstructorPre() {
      this.requiredInputs = ['reoccuring', 'schedule']
      this.needsToConnectToDatabase = true
      this.needsToExecuteLambdas = true
    }












    protected async performActions() {
      await this.getNextDueDate()
      this.makeNewJobRecord()
      this.saveNewJobRecord()
    }




        private getNextDueDate() {
          return this.lambda.invoke({
            // FunctionName: `Schedule-DEV-calc-nextDue`,
            FunctionName: `Schedule-${ process.env.stage }-calc-nextDue`,
            Payload: JSON.stringify(this.request.schedule)
          }).promise()
            .then(result => this.onCalcNextDueSuccess(result))
            .catch(error => this.onCalcNextDueFailure(error))
        }




            private onCalcNextDueSuccess(result) {
              console.log('onCalcNextDueSuccess')
              let data = JSON.parse(result.Payload)
              let body = JSON.parse(data.body)
              this.newJobDate = body.details.nextJobDate
            }




            private onCalcNextDueFailure(error) {
              console.log('onCalcNextDueFailure')
              this.hasFailed(error)
            }












      private makeNewJobRecord() {
        this.newJobRecord = Object.assign(this.request)
        this.newJobRecord.id = `${ this.request.boundTo }-${ this.newJobDate }`
        this.newJobRecord.dueAt = this.newJobDate
        this.newJobRecord.status = 'queued'
      }












      private saveNewJobRecord() {
        this.lambda.invoke({
          // FunctionName: `Schedule-DEV-update`,
          FunctionName: `Schedule-${ process.env.stage }-update`,
          Payload: JSON.stringify({ item: this.newJobRecord })
        }).promise()
          .then(result => this.onSaveNewJobRecordSuccess(result))
          .catch(error => this.onSaveNewJobRecordFailure(error))
      }




          private onSaveNewJobRecordSuccess(result) {
            console.log('onSaveNewJobRecordSuccess')
            this.hasSucceeded(result)
          }




          private onSaveNewJobRecordFailure(error) {
            console.log('onSaveNewJobRecordFailure')
            this.hasFailed(error)
          }


        


  } // End Handler Class ---------

  new HandlerObject(incomingRequest, context, callback)

} // End Main Handler Function -------

// handler({
//   "accountId": "dn3ZoUfK",
//   "boundTo": "YRbff5iq",
//   "details": {
//     "lambdaName": "Push-PROD-send",
//     "params": {
//       "body": "Your \"PU\" is due.",
//       "title": "Quiz Due",
//       "to": [
//         "fbuBLhQutew:APA91bGyjS9dRnF_iOUA0yz2xj8tNRNr8CiIXIi56pP8v4yOt4zNGW8pXs69j3BIhaXtOon9eqy7SvndzSgEUsLTjkjyJp3MWqEu08QVRcspzDMzSZ4HplZP182UEXg-nPFYHpvppYOq",
//         "dvpmbTlN8qk:APA91bHbcGJR8XXAd0TvuZc4Z8fiM1_5PnVuFuMhexVqRoj7HncoZTlJHVkqwlmpeCuDQaKGpuFNTOPuNkFFoNeUcclmCEHSh1cYZmrQgpN3VdLnc0buRpQlNT0elvQAmsS2rFw5NfFW",
//         "dvpmbTlN8qk:APA91bHbcGJR8XXAd0TvuZc4Z8fiM1_5PnVuFuMhexVqRoj7HncoZTlJHVkqwlmpeCuDQaKGpuFNTOPuNkFFoNeUcclmCEHSh1cYZmrQgpN3VdLnc0buRpQlNT0elvQAmsS2rFw5NfFW",
//         "c4Nrkmgjq0Q:APA91bHzhjWHWuqatAF6ABUeAtLgTIc_I9aBMo4SSGYwLg_VqMjvno9QbAhEZxkq-XN38deP_rk_CzwvB2ZCwgeIIfZuqg1X7mVWXIhhdS-zYb_gMT3mRnNjlOsfW85mmJhNAAzJaZ3x"
//       ]
//     }
//   },
//   "dueAt": 1602590400000,
//   "id": "YRbff5iq-1602590400000",
//   "saas": "iqqa",
//   "status": "finished",
//   "reoccuring": true,
//   "schedule": {
//     "rate": 1,
//     "unit": 'day',
//     "time": '10:00',
//     "gmt": -6
//   }
// }, {} as Context, ()=> { })