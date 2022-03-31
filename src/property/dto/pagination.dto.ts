import { IsNotEmpty } from 'class-validator';

export class PaginationDTO {
  page: string;

  limit: string;
}
