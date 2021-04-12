import { CanActivate, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from 'src/users/users.service';
import * as jwt from 'jsonwebtoken';
import { jwtConstants } from 'src/utils/constants';

@Injectable()
export class WsGuard implements CanActivate {
  constructor(private userService: UsersService) {}

  canActivate(
    context: any,
  ): boolean | any | Promise<boolean | any> | Observable<boolean | any> {
    const bearerToken = context.args[0].handshake.headers.authorization;
    try {
      let decoded = { username: '' };

      if (bearerToken) {
        decoded = jwt.verify(bearerToken, jwtConstants.secret) as any;
      }
      return new Promise((resolve, reject) => {
        return this.userService
          .findByUsername(decoded.username)
          .then((user) => {
            if (user) {
              resolve(user);
            } else {
              reject(false);
            }
          });
      });
    } catch (ex) {
      console.log(ex);
      return false;
    }
  }
}
