/* eslint-disable prettier/prettier */
// src/dto/create-preference.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class ChannelsDto {
  @ApiProperty({ description: 'Enable email notifications', example: true })
  @IsBoolean()
  email: boolean;

  @ApiProperty({ description: 'Enable SMS notifications', example: false })
  @IsBoolean()
  sms: boolean;

  @ApiProperty({ description: 'Enable Push notifications', example: true })
  @IsBoolean()
  push: boolean;
}

class PreferencesDetailDto {
  @ApiProperty({
    description: 'Opt-in for marketing notifications',
    example: true,
  })
  @IsBoolean()
  marketing: boolean;

  @ApiProperty({ description: 'Opt-in for newsletter', example: false })
  @IsBoolean()
  newsletter: boolean;

  @ApiProperty({ description: 'Opt-in for updates', example: true })
  @IsBoolean()
  updates: boolean;

  @ApiProperty({
    description: 'Frequency of notifications',
    enum: ['daily', 'weekly', 'monthly', 'never'],
    example: 'weekly',
  })
  @IsEnum(['daily', 'weekly', 'monthly', 'never'])
  frequency: 'daily' | 'weekly' | 'monthly' | 'never';

  @ApiProperty({ type: ChannelsDto })
  @IsObject()
  @ValidateNested()
  @Type(() => ChannelsDto)
  channels: ChannelsDto;
}

export class CreatePreferenceDto {
  @ApiProperty({
    description: 'Unique identifier for the user',
    example: 'user123',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ type: PreferencesDetailDto })
  @IsObject()
  @ValidateNested()
  @Type(() => PreferencesDetailDto)
  preferences: PreferencesDetailDto;

  @ApiProperty({ description: 'User timezone', example: 'America/New_York' })
  @IsString()
  timezone: string;
}
