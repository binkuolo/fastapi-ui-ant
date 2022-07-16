import { getFederationToken } from '@/services/user/api';
import { message } from 'antd';
import type { RcFile } from 'antd/lib/upload';
import COS from 'cos-js-sdk-v5';

// 腾讯云cos对象存储
class HeadImageUpload {
  file: RcFile;
  FederationConfig: USER.FederationToken | undefined;
  client: COS | undefined;
  success: (url: string) => void;
  progress: (percent: number) => void;
  file_path: string = '';
  constructor(file: RcFile, success: (url: string) => void, progress: (percent: number) => void) {
    this.file = file;
    this.success = success;
    this.progress = progress;
  }
  // 获取临时密钥
  getFederationTokenData = async () => {
    const result = await getFederationToken({ file_type: this.file.name.split('.')[1] });
    if (result.code == 200) {
      this.FederationConfig = result.data;
      return this.cos_client();
    }
    message.error(result.message);
  };
  // cos初始化配置
  cos_client = () => {
    if (this.FederationConfig) {
      this.client = new COS({
        getAuthorization: (options, callback) => {
          callback(this.FederationConfig!);
        },
      });
      return this.cosPutObject();
    }
    message.error('配置参数无效');
  };
  // 上传对象
  cosPutObject = () => {
    if (this.FederationConfig && this.client && this.file) {
      this.client.putObject(
        {
          ...this.FederationConfig,
          Body: this.file,
          onProgress: (progressData) => {
            // 上传进度
            this.progress(progressData.percent);
            console.log(JSON.stringify(progressData));
          },
        },
        (err, res) => {
          if (err) {
            message.error(err.message);
            return;
          }
          this.file_path = 'http://' + res.Location;
          return this.cosRecognition();
        },
      );
    }
  };
  // 图片内容安全识别
  cosRecognition = () => {
    if (this.FederationConfig && this.client) {
      this.client.request(
        {
          ...this.FederationConfig,
          Method: 'GET',
          Query: { 'ci-process': 'sensitive-content-recognition' },
        },
        (err, res: any) => {
          if (res) {
            // console.log(res.RecognitionResult.Label == 'Normal'); 正常图片返回 Normal
            // const Label = [
            //   'Politics', 政治
            //   'Porn', 色情
            //   'Ads', 广告
            // ]
            if (res.RecognitionResult.Label !== 'Normal') {
              // 敏感图片直接删除
              return this.cosDeleteObject();
            }
            this.success(this.file_path);
          }
        },
      );
    }
  };
  // 删除对象
  cosDeleteObject = () => {
    message.error('请勿上传敏感图片！');
    if (this.client && this.FederationConfig) {
      this.client.deleteObject({ ...this.FederationConfig }, (err, res) => {
        console.log(err || res);
        if (res) {
          message.info('文件已被删除!');
        }
      });
    }
  };
}

export default HeadImageUpload;
