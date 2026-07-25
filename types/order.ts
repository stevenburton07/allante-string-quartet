/**
 * The subset of an order row the check-in screens read back after scanning a
 * ticket. Both `sunset_orders` and `concert_orders` share these columns
 * (migrations 002 and 003).
 */
export interface CheckInOrder {
  id: string;
  customer_name: string;
  ticket_quantity: number;
  checked_in: boolean;
  checked_in_at: string | null;
}
