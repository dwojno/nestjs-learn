import { Repository, EntityRepository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import {
  ConflictException,
  InternalServerErrorException
} from '@nestjs/common';
import { USER_EXIST } from '../config/databaseErrors';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp({ username, password }: AuthCredentialsDto): Promise<void> {
    const user = new User();
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);
    user.username = username;
    try {
      await user.save();
    } catch (err) {
      if (err.code === USER_EXIST) {
        throw new ConflictException();
      }
      throw new InternalServerErrorException();
    }
  }

  async validateUserPassword({
    username,
    password
  }: AuthCredentialsDto): Promise<string> {
    const user = await this.findOne({ username });
    if (user && (await user.validatePass(password))) {
      return user.username;
    }
    return null;
  }

  private hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
