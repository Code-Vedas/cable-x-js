export interface CableXResponse {
  body: JSON | string;
  headers: { [key: string]: string | number | JSON | any };
  status: number;
}
