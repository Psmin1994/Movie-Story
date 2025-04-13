import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateOauthUserDTO {
  @IsString()
  @IsNotEmpty()
  provider!: string;

  @IsString()
  @IsNotEmpty()
  provider_user_id!: string;

  @IsString()
  @IsNotEmpty()
  nickname!: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsString()
  @IsNotEmpty()
  access_token!: string;

  @IsString()
  @IsNotEmpty()
  refresh_token!: string;
}
