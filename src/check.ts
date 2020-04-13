import { Context, Callback } from 'aws-lambda'
import { LambdaHandler } from '../lib/classes/lambdahandler/LambdaHandler.class'


export function handler(incomingRequest:any, context:Context, callback:Callback) {

  class HandlerObject extends LambdaHandler {

    protected request:any
    protected response:any


    constructor(incomingRequest:any, context:Context, callback:Callback) {
      super(incomingRequest, context, callback)
    }












    protected hookConstructorPre() {
      this.needsToConnectToDatabase = true
      this.needsToExecuteLambdas = true
    }












    protected performActions() {
      console.log('Schedule-Check performActions...')
      this.db.query(this.makeGetDueJobsSyntax()).promise()
        .then(result => this.onGetDueJobsSuccess(result))
        .catch(error => this.onGetDueJobsFailure(error))
    }




        private makeGetDueJobsSyntax() {
          return {
            TableName: `_schedule-${ process.env.stage }`,
            KeyConditionExpression: `#status = :queued and #dueAt < :now`,
            IndexName: 'status-dueAt-index',
            ExpressionAttributeNames: {
                "#status": 'status',
                "#dueAt": 'dueAt'
            },
            ExpressionAttributeValues: {
                ":queued": 'queued',
                ":now": new Date().valueOf()
            }
        }
        }




        private onGetDueJobsFailure(error) {
          console.log('onGetDueJobsError:', error)
          this.hasFailed(error)
        }




        private onGetDueJobsSuccess(result) {
          result.Items.forEach(job => {
            if (job.details.lambdaName) this.executeLambdaFunction(job)
          })
          this.hasSucceeded(result)
        }




            private executeLambdaFunction(job) {
              this.lambda.invoke({
                FunctionName: this.processFunctionName(job.details.lambdaName),
                Payload: JSON.stringify(job.details.params)
              }).promise()
                .then(result => { this.onExecuteLambdaFunctionSuccess(result, job) })
                .catch(error => { this.onExecuteLambdaFunctionFailure(error, job) })
            }




                private processFunctionName(lambdaName:string) {
                  if (!lambdaName.includes('${')) return lambdaName
                  else return lambdaName.split('-')
                    .map(word => {
                      if (word.includes('${')) return this.evaluateDynamicWord(word)
                      else return word
                    })
                    .join('-')
                }




                    private evaluateDynamicWord(word) {
                      let removedLeadingBrackets = word.slice(2)
                      let removedTrailingBrackets = removedLeadingBrackets.slice(0, removedLeadingBrackets.length - 1)
                      let trimmedWord = removedTrailingBrackets.trim()
                      let dynamicName = eval(trimmedWord)
                      if (dynamicName !== undefined) return dynamicName
                      else return word
                    }




                private onExecuteLambdaFunctionSuccess(result, job) {
                  job.status = 'finished'
                  this.updateJobStatus(job)
                }




                private onExecuteLambdaFunctionFailure(error, job) {
                  console.log('ExecuteLambdaFunction Failure:', error)
                  job.status = 'failed'
                  this.updateJobStatus(job)
                }




                    private updateJobStatus(job) {
                      let functionName = `Schedule-${ process.env.stage }-update`
                      let payload = JSON.stringify({ item: job })
                      this.lambda.invoke({
                        FunctionName: functionName,
                        Payload: payload
                      }).promise()
                        .then(result => console.log('updateJobStatusSuccess:', result))
                        .catch(error => console.log('updateJobStatusFailure:', error))
                    }

  } // End Handler Class ---------

  new HandlerObject(incomingRequest, context, callback)

} // End Main Handler Function -------
