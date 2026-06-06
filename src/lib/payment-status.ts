export type CellStatus =
  | "before-join"
  | "future"
  | "paid"
  | "paid-late"
  | "pending"
  | "late";

export interface CellInput {
  memberJoinedYear: number;
  memberJoinedMonth: number;
  year: number;
  month: number;
  hasPayment: boolean;
  paymentMonth?: number;
  paymentYear?: number;
  paidLate?: boolean;
  collectionDayEnd: number;
  now: Date;
}

export function computeCellStatus({
  memberJoinedYear,
  memberJoinedMonth,
  year,
  month,
  hasPayment,
  paidLate,
  collectionDayEnd,
  now,
}: CellInput): CellStatus {
  if (
    year < memberJoinedYear ||
    (year === memberJoinedYear && month < memberJoinedMonth)
  ) {
    return "before-join";
  }

  const nowYear = now.getFullYear();
  const nowMonth = now.getMonth() + 1;
  const isFuture =
    year > nowYear || (year === nowYear && month > nowMonth);
  if (isFuture) return "future";

  if (hasPayment) {
    return paidLate ? "paid-late" : "paid";
  }

  const isCurrentMonth = year === nowYear && month === nowMonth;
  if (isCurrentMonth && now.getDate() <= collectionDayEnd) {
    return "pending";
  }

  return "late";
}

export function expectedAmount(
  forYear: number,
  forMonth: number,
  memberJoinedYear: number,
  memberJoinedMonth: number,
  joiningAmount: number,
  monthlyAmount: number,
): number {
  if (forYear === memberJoinedYear && forMonth === memberJoinedMonth) {
    return joiningAmount;
  }
  return monthlyAmount;
}

export function monthsBetween(
  startYear: number,
  startMonth: number,
  endYear: number,
  endMonth: number,
): Array<{ year: number; month: number }> {
  const result: Array<{ year: number; month: number }> = [];
  let y = startYear;
  let m = startMonth;
  while (y < endYear || (y === endYear && m <= endMonth)) {
    result.push({ year: y, month: m });
    m++;
    if (m > 12) {
      m = 1;
      y++;
    }
  }
  return result;
}

export function daysLate(
  forYear: number,
  forMonth: number,
  collectionDayEnd: number,
  now: Date,
): number {
  const deadline = new Date(forYear, forMonth - 1, collectionDayEnd);
  const diffMs = now.getTime() - deadline.getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}
