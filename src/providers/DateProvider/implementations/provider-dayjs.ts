import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import isBetween from 'dayjs/plugin/isBetween'
import timezone from 'dayjs/plugin/timezone'
import 'dayjs/locale/pt';

import { IDateProvider } from "../interface-date-provider";

dayjs.extend(utc);
dayjs.extend(isBetween);
dayjs.extend(timezone)
dayjs.locale('pt');
class DayjsDateProvider implements IDateProvider {
  getLimitToPayment(data: Date | string): string {
    return dayjs(data).add(1, "day").utc().format()
  }
  
  compareIfAfter(start_date: string | Date, end_date: string | Date) {
    return dayjs(start_date).isAfter(dayjs(end_date));
  }
  createDate(date: string | Date): string {
    const createDate = dayjs(date).startOf("day").format('YYYY-MM-DDTHH:mm:ssZ[Z]');

    const convertDatePtBR = createDate.substring(0, 19) + "." + createDate.substring(23)

    return convertDatePtBR
  }

  dateTomorrow(date?: string | null): Date {
    return dayjs.utc(date).add(1, "day").startOf("day").toDate();
  }
  dateIsSameByHour(start_date: string, end_date: string): boolean {
    return (
      dayjs(start_date).isSame(end_date, 'd') &&
      dayjs(start_date).isSame(end_date, 'm') &&
      dayjs(start_date).isSame(end_date, 'y') &&
      dayjs(start_date).isSame(end_date, 'hour') 
    )
  }
  dateIsSame(start_date: string | Date, end_date: string | Date): boolean {
      return (
        dayjs(start_date).isSame(end_date, 'd') &&
        dayjs(start_date).isSame(end_date, 'm') &&
        dayjs(start_date).isSame(end_date, 'y')
      )
  }
  veirfyIsDateInBetween(dateVerify: string, start_date: string, end_date: string){
    return dayjs(dateVerify).isBetween(start_date, dayjs(end_date), 'date') 
  }

  addHours(hours: number): Date {
    return dayjs().add(hours, "hour").toDate();
  }
  addDays(days: number): string {
    const catchDatePtBR = dayjs().add(days, "days").format('YYYY-MM-DDTHH:mm:ssZ[Z]')

    const convertDatePtBR = catchDatePtBR.substring(0, 19) + "." + catchDatePtBR.substring(23)
   
    return convertDatePtBR
  }

  addMoth(month: number): string {
    const catchDatePtBR = dayjs().add(month, "months").format('YYYY-MM-DDTHH:mm:ssZ[Z]')

    const convertDatePtBR = catchDatePtBR.substring(0, 19) + "." + catchDatePtBR.substring(23)
   
    return convertDatePtBR
  }

  compareInHours(start_date: Date, end_date: Date): number {
    const end_date_utc = this.convertToUTC(end_date);
    const start_date_utc = this.convertToUTC(start_date);

    return dayjs(end_date_utc).diff(start_date_utc, "hours");
  }
  convertToUTC(date: Date): string {
    return dayjs(date).utc().local().format();
  }
  dateNow(date?: string | null): Date {
    return dayjs.utc(date).add(0, "day").startOf("day").toDate();
  }
  compareInDays(start_date: Date, end_date: Date): number {
    const end_date_utc = this.convertToUTC(end_date);
    const start_date_utc = this.convertToUTC(start_date);

    return dayjs(end_date_utc).diff(start_date_utc, "days");
  }

  compareIfBefore(start_date: Date | string, end_date: Date | string): boolean {
    return dayjs(start_date).isBefore(dayjs(end_date));
  }
}

export { DayjsDateProvider };
