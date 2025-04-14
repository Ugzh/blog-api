import { UserRoleEnum } from '../../user/_utils/user-role.enum';

export default interface JwtPayloadInterface {
  id: string;
  role: UserRoleEnum;
  email: string;
}
