import { IInspectionPoint } from './inspection-point.interface';

export class IRoom {
  name: string;
  active: boolean;
  inspection_points: IInspectionPoint[];
}
