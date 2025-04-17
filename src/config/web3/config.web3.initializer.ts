import 'dotenv/config';
import { ethers } from 'ethers';
import { SupportedChain } from '../../constants/shared';
import { IWeb3InitProvider, IWeb3InitParams } from './config.web3.provider';
import { chainConfigLoader } from './chain.config.loader';
import { env } from '../../constants/env';
import GaslessRelayerABI from '../../abi/GaslessRelayer';
import Web3 from 'web3';

enum ChainKey {
  EthereumMainnet = 'ethereum_mainnet',
  EthereumTestnet = 'ethereum_testnet',
  BscMainnet = 'bsc_mainnet',
  BscTestnet = 'bsc_testnet',
}

type ChainKeyOptions = {
  [key in ChainKey]?: IWeb3InitParams;
};
export class Web3Config implements IWeb3InitProvider {
  private static cachedWeb3Params: ChainKeyOptions = {};

  public getWeb3Params(chain: SupportedChain): IWeb3InitParams {
    const network = !env.isProduction ? 'testnet' : 'mainnet';
    const chainNetwork = `${chain}_${network}`;

    if (Web3Config.cachedWeb3Params.hasOwnProperty(chainNetwork)) {
      return Web3Config.cachedWeb3Params[chainNetwork];
    }
    const newlyInitChainParams = this.getInternalWeb3Params(chain);
    Web3Config.cachedWeb3Params[chainNetwork] = newlyInitChainParams;
    return newlyInitChainParams;
  }

  private getInternalWeb3Params(chain: SupportedChain): IWeb3InitParams {
    switch (chain) {
      case SupportedChain.ETHEREUM: {
        const { ethereum } = chainConfigLoader();
        return this.initWeb3Params(ethereum);
      }
      case SupportedChain.BSC: {
        const { bsc } = chainConfigLoader();
        return this.initWeb3Params(bsc);
      }
      default:
        throw new TypeError(`Unsupported chain was provided ${chain}`);
    }
  }

  private initWeb3Params(chainConfig): IWeb3InitParams {
    if (!env.isProduction) {
      const chainId = chainConfig.testnet.chainId;
      const gaslessRelayerContractAddress =
        chainConfig.testnet.gaslessRelayerContractAddress;
      const rpcUrl = chainConfig.testnet.rpcUrl;
      const web3 = new Web3(rpcUrl);

      const gaslessRelayerContract = new ethers.Contract(
        gaslessRelayerContractAddress,
        GaslessRelayerABI,
        ethers.getDefaultProvider(rpcUrl),
      );

      return {
        chainId,
        gaslessRelayerContractAddress,
        rpcUrl,
        gaslessRelayerContract,
        web3,
      };
    }

    const chainId = chainConfig.mainnet.chainId;
    const gaslessRelayerContractAddress =
      chainConfig.mainnet.gaslessRelayerContractAddress;
    const rpcUrl = chainConfig.mainnet.rpcUrl;
    const web3 = new Web3(rpcUrl);

    const gaslessRelayerContract = new ethers.Contract(
      gaslessRelayerContractAddress,
      GaslessRelayerABI,
      ethers.getDefaultProvider(rpcUrl),
    );

    return {
      chainId,
      gaslessRelayerContractAddress,
      rpcUrl,
      gaslessRelayerContract,
      web3,
    };
  }
}
