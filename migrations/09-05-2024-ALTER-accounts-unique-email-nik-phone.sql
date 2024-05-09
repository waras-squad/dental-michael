ALTER TABLE users ADD CONSTRAINT unique_user_email UNIQUE (email),
ADD UNIQUE (nik);

ALTER TABLE admins ADD UNIQUE (email);

ALTER TABLE doctors ADD UNIQUE (email),
ADD UNIQUE (phone);