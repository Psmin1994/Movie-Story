import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

// JWT Payload 타입 정의
export class JwtUserDTO {
  @IsString()
  @IsNotEmpty()
  id!: string; // 사용자 ID

  @IsString()
  @IsOptional()
  provider?: string;
}
