export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum AccountActivity {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  CHANGE_PASSWORD = 'CHANGE PASSWORD',
  REACTIVATE = 'REACTIVATE',
}

export enum AccountType {
  ADMIN = 'ADMIN',
  USER = 'USER',
  DOCTOR = 'DOCTOR',
}

export enum JwtName {
  ADMIN = 'adminJWT',
  USER = 'userJWT',
  DOCTOR = 'doctorJWT',
}
