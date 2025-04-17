import yaml from 'js-yaml';
import fs from 'fs';
import logger from '@root/utils/logger';

export const chainConfigLoader = () => {
  try {
    const chainConfig: any = yaml.load(
      fs.readFileSync(`${__dirname}/../../../../config.yaml`, 'utf8'),
    );
    return {
      ethereum: chainConfig.ethereum,
      bsc: chainConfig.bsc,
    };
  } catch (error) {
    logger.error(`${error.message}`, (error as Error).stack);
    return null;
  }
};
