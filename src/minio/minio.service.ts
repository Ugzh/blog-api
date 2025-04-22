import { Injectable } from '@nestjs/common';
import * as Minio from 'minio';
import { MemoryStoredFile } from 'nestjs-form-data';

@Injectable()
export class MinioService {
  private readonly minioClient: Minio.Client;

  constructor() {
    this.minioClient = new Minio.Client({
      endPoint: 'localhost',
      port: 9000,
      useSSL: false,
      accessKey: 'u17G6tgyyOK1RKc3IWeA',
      secretKey: '1oB4IG6bChiw6qW9M6TrkCy82iw9haK1l3fQadDm',
    });
  }

  async getUrlImage(objectName: MemoryStoredFile) {
    return this.minioClient.presignedUrl(
      'GET',
      'images',
      objectName.originalName,
      10000,
      {
        'response-content-type': objectName.mimeType,
      },
    );
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
