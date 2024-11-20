/* eslint-disable prettier/prettier */
// src/controllers/preferences.controller.ts

import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PreferencesService } from '../services/preferences.service';
import { CreatePreferenceDto } from '../dto/create-preference.dto';
import { UpdatePreferenceDto } from '../dto/update-preference.dto';
import { UserPreference } from '../models/user-preference.schema';

@ApiTags('Preferences')
@Controller('preferences')
export class PreferencesController {
  constructor(private readonly preferencesService: PreferencesService) {}

  @ApiOperation({ summary: 'Create user preferences' })
  @ApiResponse({ status: 201, description: 'The user preferences have been successfully created.', type: UserPreference })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @Post()
  createPreference(@Body() createPreferenceDto: CreatePreferenceDto) {
    return this.preferencesService.createPreference(createPreferenceDto);
  }

  @ApiOperation({ summary: 'Get user preferences' })
  @ApiResponse({ status: 200, description: 'The user preferences.', type: UserPreference })
  @ApiResponse({ status: 404, description: 'Preferences not found.' })
  @Get(':userId')
  getPreference(@Param('userId') userId: string) {
    return this.preferencesService.getPreference(userId);
  }

  @ApiOperation({ summary: 'Update user preferences' })
  @ApiResponse({ status: 200, description: 'The user preferences have been successfully updated.', type: UserPreference })
  @ApiResponse({ status: 404, description: 'Preferences not found.' })
  @Patch(':userId')
  updatePreference(@Param('userId') userId: string, @Body() updatePreferenceDto: UpdatePreferenceDto) {
    return this.preferencesService.updatePreference(userId, updatePreferenceDto);
  }

  @ApiOperation({ summary: 'Delete user preferences' })
  @ApiResponse({ status: 200, description: 'The user preferences have been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Preferences not found.' })
  @Delete(':userId')
  deletePreference(@Param('userId') userId: string) {
    return this.preferencesService.deletePreference(userId);
  }
}
