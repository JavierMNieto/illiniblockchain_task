const IlliniBlockchainDevTaskAddress =
    "0x9BeaBb9880202A6124366bF302D2919c05194bF2";

const publicKey =
    "b2219eaf45636c99fcd32f967565139a7a90c83fb615ec1db128d7010f46be6fc5b40e065fe966f67e5cd775bfddb776cc4f9d5104d8466dd8f61b76005f4a57";
const message = "Javier Nieto\njmnieto2@illinois.edu\n";

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    console.log("Account balance:", (await deployer.getBalance()).toString());

    const JaviTask = await ethers.getContractFactory("JaviTask");
    const javiTask = await JaviTask.deploy(IlliniBlockchainDevTaskAddress);

    console.log("JaviTask address:", javiTask.address);

    const applicationData = EthCrypto.cipher.stringify(
        await EthCrypto.encryptWithPublicKey(publicKey, message)
    );

    await javiTask.connect(owner).sendApplication(applicationData);

    console.log("Application data sent: ", applicationData);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
