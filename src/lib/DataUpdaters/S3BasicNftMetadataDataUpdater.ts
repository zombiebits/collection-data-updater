import { BigNumber } from "ethers";
import S3ConfigurationInterface from "../Util/S3/S3ConfigurationInterface";
import S3BasicFileDataUpdater from "./S3BasicFileDataUpdater";

export default class S3BasicNftMetadataDataUpdater extends S3BasicFileDataUpdater {
  public constructor(
    resourceName: string,
    s3Config: S3ConfigurationInterface,
    sourcePath: string,
    destinationPath: string,
    private metadataUpdater: (tokenId: BigNumber, metadata: any) => any,
    fileExtension: string = ".json",
  ) {
    super(resourceName, s3Config, sourcePath, destinationPath, fileExtension);
  }

  protected async revealToken(tokenId: BigNumber): Promise<void> {
    if (await this.destinationDataExists(tokenId)) {
      console.log(`Skipping "${this.resourceName}" for token ${tokenId.toString()} (already revealed)...`);

      return;
    }

    console.log(`Revealing "${this.resourceName}" for token ${tokenId.toString()}...`);

    try {
      const sourceData = await this.s3.getObject({
        Bucket: this.s3Config.bucketName,
        Key: this.buildSourceObjectKey(tokenId),
      }).promise();

      let sourceContent = this.metadataUpdater(tokenId, JSON.parse(sourceData.Body.toString()));

      await this.s3.upload({
        Bucket: this.s3Config.bucketName,
        Key: this.buildDestinationObjectKey(tokenId),
        ContentType: sourceData.ContentType,
        Body: JSON.stringify(sourceContent, null, 2),
        ACL: "public-read",
      }).promise();
    } catch (error) {
      console.error(`Error copying "${this.resourceName}" for token ${tokenId.toString()}.`);
      console.error(error);
    }
  }
}
