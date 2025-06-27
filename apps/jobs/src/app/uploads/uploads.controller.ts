import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, DiskStorageOptions } from 'multer';
import { UPLOAD_FILE_PATH } from './upload';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { Express } from 'express';

const changeFileName: DiskStorageOptions['filename'] = (
  _req,
  file,
  callback
) => {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random()) * 1e9;
  const filename = `${file.fieldname}-${uniqueSuffix}.json`;
  callback(null, filename);
};

const filterFile: MulterOptions['fileFilter'] = (_req, file, callback) => {
  if (file.mimetype !== 'application/json') {
    return callback(
      new BadRequestException('Only JSON files are allowed!'),
      false
    );
  }

  callback(null, true);
};

const diskStorageOptions: DiskStorageOptions = {
  destination: UPLOAD_FILE_PATH,
  filename: changeFileName,
};

const fileInterceptorOptions: MulterOptions = {
  storage: diskStorage(diskStorageOptions),
  fileFilter: filterFile,
};

@Controller('uploads')
export class UploadsController {
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', fileInterceptorOptions))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return {
      message: 'File Uploaded successfully',
      filename: file.filename,
    };
  }
}
