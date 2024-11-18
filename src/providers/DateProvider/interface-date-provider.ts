export interface IDateProvider {
  compareInHours(start_date: Date, end_date: Date): number;
  convertToUTC(data: Date): string;
  dateNow(date?: string | null): Date;
  createDate(date: string | Date): string
  dateTomorrow(date?: string | null): Date
  dateIsSame(start_date: string | Date, end_date: string | Date): boolean
  dateIsSameByHour(start_date: string, end_date: string): boolean
  compareInDays(start_date: Date, end_date: Date): number;
  addDays(days: number): string ;
  addMoth(month: number): string;
  addHours(hours: number): Date;
  compareIfBefore(start_date: Date | string, end_date: Date | string): boolean;
  compareIfAfter(start_date: Date | string, end_date: Date | string): boolean;
  veirfyIsDateInBetween(dateVerify: string, start_date: string, end_date: string): boolean;
  getLimitToPayment(data: Date | string): string
}

