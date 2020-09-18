import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AwsService {
  s3 = new S3();
  params: any;

  constructor() {
    // AWS.config.credentials = new AWS.Credentials({
      // accessKeyId: environment.AWS_ACCESS_KEY_ID,
      // secretAccessKey: environment.AWS_SECRET_ACCESS_KEY,
    // });

  //   this.params = {
  //     Bucket: environment.S3_BUCKET,
  //     Key: 'index.html'
  //   };
  }

  getObj(Inkey){
    // this.params = {
    //   Bucket: environment.S3_BUCKET,
    //   Key: Inkey
    // };

    AWS.config.update({
      accessKeyId: environment.AWS_ACCESS_KEY_ID,
      secretAccessKey: environment.AWS_SECRET_ACCESS_KEY,
    });

    this.s3 = new S3({
      accessKeyId: environment.AWS_ACCESS_KEY_ID,
      secretAccessKey: environment.AWS_SECRET_ACCESS_KEY,
      region: environment.AWS_REGION
    });

    // let s3 = new S3();
    const url = this.s3.getSignedUrl('getObject', {
      Bucket: environment.S3_BUCKET,
      Key: 'post-001-p-500.jpeg',
      Expires: 10
    });

    return url;
  }
}
