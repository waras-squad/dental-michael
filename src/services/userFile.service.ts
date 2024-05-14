import { db } from '@/db';
import { Admin, userFiles } from '@/db/schemas';
import { UploadUserFileDTO } from '@/validators';
import { AccountActivityLogService } from './accountActivityLog.service';
import { AccountActivity, AccountType } from '@/enum';
import { customError } from '@/helpers';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/const';
import { uploadFiles } from '@/utils/aws-s3.util';

export class UserFileService {
  static async uploadFile(
    user_id: string,
    { files, type }: UploadUserFileDTO,
    admin?: Admin
  ) {
    const paths = await uploadFiles(files);

    try {
      await db.transaction(async (tx) => {
        for (let i = 0; i < files.length; i++) {
          const payload = {
            user_id,
            name: files[i].name,
            path: paths[i],
            type: type ?? files[i].type,
          };
          await tx.insert(userFiles).values(payload);

          await AccountActivityLogService.insertToLog(tx, {
            target_id: user_id,
            target_type: AccountType.USER,
            actor_id: admin?.id ?? user_id,
            actor_type: admin ? AccountType.ADMIN : AccountType.USER,
            action: AccountActivity.UPLOAD_FILE,
            details: payload,
          });
        }
      });
      console.log(SUCCESS_MESSAGES.UPLOAD_FILES(user_id));
      return { paths };
    } catch (error) {
      console.error(error.message);
      return customError(500, ERROR_MESSAGES.UPLOAD_FILE);
    }
  }
}
