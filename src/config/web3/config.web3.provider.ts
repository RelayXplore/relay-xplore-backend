import { Contract } from 'ethers';
import Web3 from 'web3';
import { SupportedChain } from '../../constants/shared';

export interface IWeb3InitParams {
  chainId: number;
  gaslessRelayerContractAddress: string;
  rpcUrl: string;
  gaslessRelayerContract: Contract;
  web3: Web3;
}

export interface IWeb3InitProvider {
  getWeb3Params(providedChain: SupportedChain): IWeb3InitParams;
}
