import { IsNotEmpty } from 'class-validator';

export class PaginationDTO {
  @IsNotEmpty()
  page: string;

  limit: string;
}
