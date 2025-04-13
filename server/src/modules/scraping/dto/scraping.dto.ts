import {
  IsString,
  IsOptional,
  IsNumber,
  IsDate,
  IsUrl,
  IsNotEmpty,
} from 'class-validator';

export class CreateMovieDTO {
  @IsString()
  @IsNotEmpty()
  movie_nm!: string;

  @IsString()
  @IsNotEmpty()
  movie_nm_en!: string;

  @IsDate()
  @IsNotEmpty()
  open_date!: Date;

  @IsOptional()
  @IsDate()
  reopen_date?: Date | null;

  @IsString()
  @IsNotEmpty()
  nation!: string;

  @IsNumber()
  @IsNotEmpty()
  showtime!: number;

  @IsString()
  @IsNotEmpty()
  genre!: string;

  @IsString()
  poster!: string;

  @IsString()
  @IsOptional()
  summary?: string | null;

  @IsString()
  @IsOptional()
  still_cut?: string | null;
}
