import { BigNumber } from "ethers";
import CollectionStatusProviderInterface from "../CollectionStatusProviderInterface";

export default class TestingCollectionStatusProvider implements CollectionStatusProviderInterface {
  private totalSupply: BigNumber;
  private MAX_TOKENS: BigNumber;
  private startTokenId: BigNumber;

  public constructor(
    totalSupply: number = 1990,
    MAX_TOKENS: number = 10000,
    startTokenId: number = 1,
  ) {
    this.totalSupply = BigNumber.from(totalSupply);
    this.MAX_TOKENS = BigNumber.from(this.MAX_TOKENS);
    this.startTokenId = BigNumber.from(startTokenId);
  }

  public async getTokenIds(): Promise<BigNumber[]> {
    return [...Array(this.MAX_TOKENS).keys()].map(i => this.startTokenId.add(i));
  }

  public async isTokenRevealed(tokenId: BigNumber): Promise<boolean> {
    return tokenId.lte(this.totalSupply);
  }

  public async refresh(): Promise<void> {
    // Nothing to do here...
  }
}
