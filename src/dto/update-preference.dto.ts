/* eslint-disable prettier/prettier */
// src/dto/update-preference.dto.ts

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ChannelsDto {
  @ApiPropertyOptional({ description: 'Enable email notifications', example: true })
  @IsBoolean()
  @IsOptional()
  email?: boolean;

  @ApiPropertyOptional({ description: 'Enable SMS notifications', example: false })
  @IsBoolean()
  @IsOptional()
  sms?: boolean;

  @ApiPropertyOptional({ description: 'Enable Push notifications', example: true })
  @IsBoolean()
  @IsOptional()
  push?: boolean;
}

class PreferencesDetailDto {
  @ApiPropertyOptional({ description: 'Opt-in for marketing notifications', example: true })
  @IsBoolean()
  @IsOptional()
  marketing?: boolean;

  @ApiPropertyOptional({ description: 'Opt-in for newsletter', example: false })
  @IsBoolean()
  @IsOptional()
  newsletter?: boolean;

  @ApiPropertyOptional({ description: 'Opt-in for updates', example: true })
  @IsBoolean()
  @IsOptional()
  updates?: boolean;

  @ApiPropertyOptional({ description: 'Frequency of notifications', enum: ['daily', 'weekly', 'monthly', 'never'], example: 'weekly' })
  @IsEnum(['daily', 'weekly', 'monthly', 'never'])
  @IsOptional()
  frequency?: 'daily' | 'weekly' | 'monthly' | 'never';

  @ApiPropertyOptional({ type: ChannelsDto })
  @IsObject()
  @ValidateNested()
  @Type(() => ChannelsDto)
  @IsOptional()
  channels?: ChannelsDto;
}

export class UpdatePreferenceDto {
  @ApiPropertyOptional({ type: PreferencesDetailDto })
  @IsObject()
  @ValidateNested()
  @Type(() => PreferencesDetailDto)
  preferences?: PreferencesDetailDto;

  @ApiPropertyOptional({ description: 'User timezone', example: 'America/Los_Angeles' })
  @IsString()
  @IsOptional()
  timezone?: string;
}
