export interface Member {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface PhotoBase {
  url: string;
  width: number;
  height: number;
  position: number;
  centerX: number;
  centerY: number;
}

export type Photo = PhotoBase & {
  id: string;
  memberId: number;
}