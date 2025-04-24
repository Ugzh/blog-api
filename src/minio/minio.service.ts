import { Injectable } from '@nestjs/common';
import * as Minio from 'minio';
import { MemoryStoredFile } from 'nestjs-form-data';

@Injectable()
export class MinioService {
  private readonly minioClient: Minio.Client;

  constructor() {
    this.minioClient = new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT!,
      port: 9000,
      useSSL: false,
      accessKey: process.env.MINIO_ACCESS_KEY,
      secretKey: process.env.MINIO_SECRET_KEY,
    });
  }

  async getUrlImage(objectName: MemoryStoredFile) {
    const url = await this.minioClient.presignedUrl(
      'GET',
      'images',
      objectName.originalName,
      10000,
      {
        'response-content-type': objectName.mimeType,
      },
    );
    return url.replace('minio:9000', 'minio.local');
  }

  async sendImage(object: MemoryStoredFile) {
    return this.minioClient.putObject(
      'images',
      object.originalName,
      object.buffer,
      object.size,
      {
        'Content-Type': object.mimeType,
      },
    );
  }
}
