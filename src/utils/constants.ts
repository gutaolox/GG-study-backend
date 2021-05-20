export const jwtConstants = {
  secret: 'secretKey',
  rounds: 10,
};

export enum Role {
  User = 'User',
  Admin = 'Admin',
  Student = 'Student',
  Professor = 'Professor',
}
