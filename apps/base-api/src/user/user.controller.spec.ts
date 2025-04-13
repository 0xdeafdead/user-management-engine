import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { of, throwError } from 'rxjs';
import { CreateUserDTO } from './DTOs/createUser.dto';
import { UpdateUserDTO } from './DTOs/updateUser.dto';
import { NotFoundException } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const now = new Date();
  const mockUsers: User[] = [
    {
      id: 'user_01',
      email: 'user_01@test.com',
      createdAt: now,
      updatedAt: now,
      firstName: 'testName',
      lastName: 'testLastName',
      disabled: false,
    },
    {
      id: 'user_02',
      email: 'user_02@test.com',
      createdAt: now,
      updatedAt: now,
      firstName: 'testName2',
      lastName: 'testLastName2',
      disabled: false,
    },
  ];

  const serviceMock = {
    getAllUsers: jest.fn(),
    getOneUser: jest.fn(),
    updateUser: jest.fn(),
    disableUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('should return an array of users', (done) => {
      serviceMock.getAllUsers.mockReturnValueOnce(of(mockUsers));
      controller.getAllUsers().subscribe({
        next: (res) => {
          expect(serviceMock.getAllUsers).toHaveBeenCalled();
          expect(Array.isArray(res)).toBeTruthy();
          expect(res).toMatchObject(mockUsers);
          done();
        },
      });
    });
  });

  describe('getOne', () => {
    const id = 'user_01';
    it('should return a single user', (done) => {
      serviceMock.getOneUser.mockReturnValueOnce(of(mockUsers[0]));
      controller.getOne(id).subscribe({
        next: (res) => {
          expect(serviceMock.getOneUser).toHaveBeenCalled();
          expect(res).toMatchObject(mockUsers[0]);
          done();
        },
      });
    });
  });

  describe('updateUser', () => {
    const email = 'user_01@test.com';
    const updateUserDTO: UpdateUserDTO = {
      firstName: 'testName',
      lastName: 'testLastName',
    };
    it('should return an error if user is not found', (done) => {
      serviceMock.updateUser.mockReturnValueOnce(
        throwError(
          () => new NotFoundException(`Not found user with email ${email}`)
        )
      );
      controller.updateUser(email, updateUserDTO).subscribe({
        error: (err) => {
          expect(serviceMock.updateUser).toHaveBeenCalled();
          expect(serviceMock.updateUser).toHaveBeenCalledWith(
            email,
            updateUserDTO
          );
          expect(err).toBeInstanceOf(NotFoundException);
          done();
        },
      });
    });
  });

  describe('deleteUser', () => {
    const id = 'user_01';
    it('should return a disabled user when a user is deleted', (done) => {
      serviceMock.disableUser.mockReturnValueOnce(of({ disabled: true }));
      controller.disableUser(id).subscribe({
        next: (res) => {
          expect(serviceMock.disableUser).toHaveBeenCalled();
          expect(res.disabled).toBeTruthy();
          done();
        },
      });
    });
  });
});
