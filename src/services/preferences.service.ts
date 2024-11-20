/* eslint-disable prettier/prettier */
// src/services/preferences.service.ts

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UserPreference } from '../models/user-preference.schema';
import { CreatePreferenceDto } from '../dto/create-preference.dto';
import { UpdatePreferenceDto } from '../dto/update-preference.dto';

@Injectable()
export class PreferencesService {
  constructor(
    @InjectModel('UserPreference') private readonly preferenceModel: Model<UserPreference>,
  ) {}

  /**
   * Create a new user preference
   * @param createPreferenceDto - Data Transfer Object containing user preference details
   * @returns The created user preference
   */
  async createPreference(createPreferenceDto: CreatePreferenceDto): Promise<UserPreference> {
    const existingPreference = await this.preferenceModel.findOne({ userId: createPreferenceDto.userId });
    if (existingPreference) {
      throw new BadRequestException('User preferences already exist.');
    }

    const createdPreference = new this.preferenceModel({
      ...createPreferenceDto,
      lastUpdated: new Date(),
      createdAt: new Date(),
    });

    return createdPreference.save();
  }

  /**
   * Retrieve user preference by userId
   * @param userId - Unique identifier for the user
   * @returns The user preference
   */
  async getPreference(userId: string): Promise<UserPreference> {
    const preference = await this.preferenceModel.findOne({ userId }).exec();
    if (!preference) {
      throw new NotFoundException(`Preferences for userId ${userId} not found.`);
    }
    return preference;
  }

  /**
   * Update user preference by userId
   * @param userId - Unique identifier for the user
   * @param updatePreferenceDto - Data Transfer Object containing updated preference details
   * @returns The updated user preference
   */
  async updatePreference(userId: string, updatePreferenceDto: UpdatePreferenceDto): Promise<UserPreference> {
    const updatedPreference = await this.preferenceModel.findOneAndUpdate(
      { userId },
      { ...updatePreferenceDto, lastUpdated: new Date() },
      { new: true },
    ).exec();

    if (!updatedPreference) {
      throw new NotFoundException(`Preferences for userId ${userId} not found.`);
    }

    return updatedPreference;
  }

  /**
   * Delete user preference by userId
   * @param userId - Unique identifier for the user
   * @returns A success message upon deletion
   */
  async deletePreference(userId: string): Promise<{ message: string }> {
    const result = await this.preferenceModel.deleteOne({ userId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Preferences for userId ${userId} not found.`);
    }
    return { message: `Preferences for userId ${userId} deleted successfully.` };
  }
}
