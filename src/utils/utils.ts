import { ethers } from 'ethers';
import Web3 from 'web3';
const web3 = new Web3();

export const isValidAddress = (walletAddress: string) =>
  ethers.isAddress(walletAddress);

export function toUnits(balance: any) {
  return toFixed(ethers.formatEther(balance), 4);
}

function toFixed(num, fixed) {
  const re = new RegExp(`^-?\\d+(?:.\\d{0,${fixed || -1}})?`);
  return Number(num.toString().match(re)[0]);
}

export function toChecksumAddress(address: string): string {
  return web3.utils.toChecksumAddress(address);
}
