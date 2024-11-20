/* eslint-disable prettier/prettier */
// src/services/preferences.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { PreferencesService } from '../services/preferences.service';
import { getModelToken } from '@nestjs/mongoose';
import { UserPreference } from '../models/user-preference.schema';
import { Model } from 'mongoose';
import { NotFoundException, BadRequestException } from '@nestjs/common';

const mockUserPreference = (
  userId = 'user123',
  email = 'user@example.com',
  preferences = {
    marketing: true,
    newsletter: false,
    updates: true,
    frequency: 'weekly',
    channels: { email: true, sms: false, push: true },
  },
  timezone = 'America/New_York',
) => ({
  userId,
  email,
  preferences,
  timezone,
  lastUpdated: new Date(),
  createdAt: new Date(),
});

describe('PreferencesService', () => {
  let service: PreferencesService;
  let model: Model<UserPreference>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PreferencesService,
        {
          provide: getModelToken('UserPreference'),
          useValue: {
            findOne: jest.fn(),
            findOneAndUpdate: jest.fn(),
            deleteOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PreferencesService>(PreferencesService);
    model = module.get<Model<UserPreference>>(getModelToken('UserPreference'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPreference', () => {
    it('should create a new preference', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValue(null);
      jest.spyOn(model.prototype, 'save').mockResolvedValue(mockUserPreference());

      const dto = mockUserPreference();
      const result = await service.createPreference(dto as any);

      expect(model.findOne).toHaveBeenCalledWith({ userId: dto.userId });
      expect(result).toEqual(expect.objectContaining(dto));
    });

    it('should throw BadRequestException if preference already exists', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValue(mockUserPreference());

      const dto = mockUserPreference();
      await expect(service.createPreference(dto as any)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getPreference', () => {
    it('should return user preference', async () => {
      const pref = mockUserPreference();
      jest.spyOn(model, 'findOne').mockResolvedValue(pref as any);

      const result = await service.getPreference(pref.userId);
      expect(model.findOne).toHaveBeenCalledWith({ userId: pref.userId });
      expect(result).toEqual(pref);
    });

    it('should throw NotFoundException if preference not found', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValue(null);
      await expect(service.getPreference('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updatePreference', () => {
    it('should update and return the updated preference', async () => {
      const pref = mockUserPreference();
      const updateDto = { timezone: 'America/Los_Angeles' };
      const updatedPref = { ...pref, ...updateDto, lastUpdated: new Date() };

      jest.spyOn(model, 'findOneAndUpdate').mockResolvedValue(updatedPref as any);

      const result = await service.updatePreference(pref.userId, updateDto as any);
      expect(model.findOneAndUpdate).toHaveBeenCalledWith(
        { userId: pref.userId },
        { ...updateDto, lastUpdated: expect.any(Date) },
        { new: true },
      );
      expect(result).toEqual(updatedPref);
    });

    it('should throw NotFoundException if preference to update does not exist', async () => {
      jest.spyOn(model, 'findOneAndUpdate').mockResolvedValue(null);
      await expect(service.updatePreference('nonexistent', { timezone: 'UTC' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('deletePreference', () => {
    it('should delete the preference and return a success message', async () => {
      jest.spyOn(model, 'deleteOne').mockResolvedValue({ deletedCount: 1 } as any);

      const result = await service.deletePreference('user123');
      expect(model.deleteOne).toHaveBeenCalledWith({ userId: 'user123' });
      expect(result).toEqual({ message: 'Preferences for userId user123 deleted successfully.' });
    });

    it('should throw NotFoundException if preference to delete does not exist', async () => {
      jest.spyOn(model, 'deleteOne').mockResolvedValue({ deletedCount: 0 } as any);
      await expect(service.deletePreference('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });
});
