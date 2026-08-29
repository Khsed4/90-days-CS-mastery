import { IsInt, Min, Max } from 'class-validator';

export class ToggleDayDto {
  @IsInt()
  @Min(1)
  @Max(90)
  dayId: number;
}
