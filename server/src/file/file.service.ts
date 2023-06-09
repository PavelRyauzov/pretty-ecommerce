import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';

declare const Buffer;

@Injectable()
export class FileService {
  async createFileFromBase64(
    base64: string,
    destDir: string,
    from1CFlag: boolean,
  ): Promise<string> {
    base64 = base64.replace(/\\r|\\n/g, '');
    let data;
    if (from1CFlag) {
      [data] = base64.split(',');
    } else {
      [, data] = base64.split(',');
    }
    const binaryData = Buffer.from(data, 'base64');

    const mimeType = 'jpg';

    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    const fileName = uuid.v4();
    const filePath = path.join(destDir, fileName + '.' + mimeType);

    fs.writeFile(filePath, binaryData, { flag: 'w' }, (error) => {
      if (error) {
        console.error(`Error writing file: ${error}`);
        throw error;
      }
    });

    return filePath;
  }
}
