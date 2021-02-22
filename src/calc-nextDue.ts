import { Context, Callback } from 'aws-lambda'
import { IResponse } from '../lib/classes/lambdahandler/Response.class'
import { LambdaHandler } from '../lib/classes/lambdahandler/LambdaHandler.class'
import { ICalcDueDateRequest } from '../lib/interfaces/schedule-server-service-interface/calc-nextDue.interface'
import moment from 'moment-timezone';


export function handler(incomingRequest:ICalcDueDateRequest, context:Context, callback:Callback) {

  class HandlerObject extends LambdaHandler {

    protected request:ICalcDueDateRequest
    protected response:IResponse
    private nextJobDate:moment


    constructor(incomingRequest:ICalcDueDateRequest, context:Context, callback:Callback) {
      super(incomingRequest, context, callback)
    }












    protected hookConstructorPre() {
      this.requiredInputs = ['rate', 'unit', 'time', 'gmt']
      this.needsToConnectToDatabase = true
    }












    protected performActions() {
      if (this.isNotAWeekDayValue) this.determineNextJob()
      else this.nextJobForWeekdayUnit()
      if (this.nextJobDateIsInPast) this.addTime()
      this.setGMTOffset()
      this.hasSucceeded({ nextJobDate: this.nextJobDate.valueOf() })
    }




        private get isNotAWeekDayValue() {
          if (this.request.unit === 'day' || this.request.unit === 'month') return true
          else return false
        }




        private get nextJobDateIsInPast() {
          return (this.nextJobDate.valueOf() < new Date().valueOf())
        }









        


  private determineNextJob() {
    try { this._determineNextJobProcedure() } 
    catch (error) { this.hasFailed({ signature: '91cd5b22-6c1f-46da-9cce-e76571ba1204', details: error }) }
  }




      private _determineNextJobProcedure() {
        let now = moment(), target, hours, minutes
        target = now.add(this.request.rate, this.request.unit)
        if (this.request.time) [ hours, minutes ] = this.parseTimeByType()
        this.nextJobDate = this.calcMilitaryTime({ hours: hours, minutes: minutes, dateTimeUTC: target })
      }




          private parseTimeByType() {
            if (this.request.time.constructor === String) return this.parseHoursMinutesFromDateTimeString(this.request.time)
            else return this.parseHoursMinutesFromDateObject(this.request.time)
          }




          private parseHoursMinutesFromDateTimeString(dateTime:string) {
            let date, time, hours, minutes
            if (dateTime.includes('T')) [ date, time ] = dateTime.split('T')
            else time = dateTime as string
            [ hours, minutes ] = time.split(':')
            return [ parseInt(hours), parseInt(minutes) ]
          }




          private parseHoursMinutesFromDateObject(time) {
            let hours = time.getHours()
            let minutes = time.getMinutes()
            return [ hours, minutes ]
          }












  public nextJobForWeekdayUnit() {
    try { this._nextJobForWeekdayUnitProcedure() }
    catch (error) { this.hasFailed({ signature: '2c4f10fa-357d-468f-a18c-55f230139232', details: error }) }
  }




      private _nextJobForWeekdayUnitProcedure() {
        let dayOfWeek, hours, minutes
        dayOfWeek = this.nextDayOfWeekInstance(this.request.unit)
        if (this.request.rate > 1) dayOfWeek = dayOfWeek.add(((this.request.rate -1) * 7), 'days')
        if (this.request.time) [ hours, minutes ] = this.getMinuteAndHourValues()
        if (this.hasDefined({ hours, minutes, dayOfWeek })) this.nextJobDate = this.calcMilitaryTime({ hours: hours, minutes: minutes, dateTimeUTC: dayOfWeek.valueOf() })
      }




          private nextDayOfWeekInstance(preferredWeekday:string) {
            if (!preferredWeekday) return
            let now = moment()
            let weekdayInstance = moment().day(preferredWeekday)
            if (weekdayInstance < now) return weekdayInstance.add(7, 'days')
            else return weekdayInstance
          }




          private getMinuteAndHourValues() {
            if (this.request.time.constructor === String) return this.getMinutesHoursByStringValue()
            else return this.getMinutesHoursByDateObject()
          }




              private getMinutesHoursByStringValue() {
                let dateTime = new Date(this.request.time)
                if (dateTime.valueOf()) return this.parseFormValue()
                else return this.parseSavedValue()
              }




                  private parseFormValue() {
                      let hours = new Date(this.request.time).getHours()
                      let minutes = new Date(this.request.time).getMinutes()
                      return [ hours, minutes ]
                  }



                  private parseSavedValue() {
                    let hours:string|number, minutes:string|number
                    [ hours, minutes ] = (this.request.time as string).split(':')
                    let dateTime = new Date()
                    dateTime.setHours(parseInt(hours))
                    dateTime.setMinutes(parseInt(minutes))
                    hours = dateTime.getHours()
                    minutes = dateTime.getMinutes()
                    return [ hours, minutes ]
                  }




              private getMinutesHoursByDateObject() {
                return [
                  (this.request.time as Date).getHours(),
                  (this.request.time as Date).getMinutes()
                ]
              }




          private hasDefined(params:{ hours, minutes, dayOfWeek }) {
            return (params.hours !== undefined && params.minutes !== undefined && params.dayOfWeek !== undefined)
          }












  private calcMilitaryTime(params:{ hours:number, minutes:number, dateTimeUTC?:number }) {
    let date = moment(params.dateTimeUTC)
    let militaryTime = date.hour(params.hours)
    militaryTime.minutes(params.minutes)
    militaryTime.seconds(0)
    militaryTime.milliseconds(0)
    return militaryTime
  }












  private addTime() {
    let date
    if (this.request.unit === 'day' || this.request.unit === 'month') date = moment(this.nextJobDate).add(this.request.rate, `${ this.request.unit }s`).valueOf()
    else date = moment(this.nextJobDate).add(7, 'days').valueOf()
    return date
  }












  private setGMTOffset() {
    this.nextJobDate = moment(this.nextJobDate).subtract(this.request.gmt, 'hours')
  }


  } // End Handler Class ---------

  new HandlerObject(incomingRequest, context, callback)

} // End Main Handler Function -------

// handler({
//   rate: 1,
//   time: '10:00',
//   unit: 'day',
//   gmt: -6
// }, {} as Context, ()=> {})