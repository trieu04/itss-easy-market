import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserDataEntity } from "../../entities/user-data.entity";
import { isEmail } from "class-validator";
import { UserEntity } from "../../entities/user.entity";

@Injectable()
export class UserDataService {
  constructor(
    @InjectRepository(UserDataEntity) private userDataRepo: Repository<UserDataEntity>,
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
  ) { }

  async getUserData(id: string) {
    let userId = id;
    if (isEmail(id)) {
      const user = await this.userRepo.findOneOrFail({
        where: {
          email: id,
        },
      });
      userId = user.id;
    }

    let userData = await this.userDataRepo.findOne({
      where: { userId },
    });

    if (!userData) {
      userData = this.userDataRepo.create({
        userId,
        data: {},
      });
      await this.userDataRepo.save(userData);
    }

    return userData;
  }

  async updateUserData(id: string, data: any) {
    let userId = id;
    if (isEmail(id)) {
      const user = await this.userRepo.findOneOrFail({
        where: {
          email: id,
        },
      });
      userId = user.id;
    }

    if (!data) {
      throw new BadRequestException();
    }

    await this.userDataRepo.update(
      { userId },
      { data },
    );

    const updated = await this.userDataRepo.findOne({ where: { userId } });
    return updated;
  }
}
