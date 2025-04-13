import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateOauthUserDTO {
  @IsString()
  @IsNotEmpty()
  provider_user_id!: string;

  @IsString()
  @IsOptional()
  access_token?: string;

  @IsString()
  @IsOptional()
  refresh_token?: string;
}
