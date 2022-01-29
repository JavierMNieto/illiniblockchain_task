const { expect } = require("chai");
const { ethers, network } = require("hardhat");
const EthCrypto = require("eth-crypto");

const publicKey =
    "b2219eaf45636c99fcd32f967565139a7a90c83fb615ec1db128d7010f46be6fc5b40e065fe966f67e5cd775bfddb776cc4f9d5104d8466dd8f61b76005f4a57";
const message =
    "Javier Nieto\njmnieto2@illinois.edu\nhttps://github.com/JavierMNieto/illiniblockchain_task";

describe("JaviTask", function () {
    let illiniTask, javiTask;

    beforeEach(async function () {
        const IlliniBlockchainDevTask = await ethers.getContractFactory(
            "IlliniBlockchainDevTask"
        );
        illiniTask = await IlliniBlockchainDevTask.deploy(
            ethers.BigNumber.from(`0x${publicKey}`)
        );
        await illiniTask.deployed();

        const JaviTask = await ethers.getContractFactory("JaviTask");
        javiTask = await JaviTask.deploy(illiniTask.address);
        await javiTask.deployed();
    });

    it("Should initialize owner on creation", async function () {
        const [owner] = await ethers.getSigners();
        expect(await javiTask.owner()).to.equal(owner.address);
    });

    it("Should send application data to Illini contract and selfdestruct with sendApplicaiton", async function () {
        const [owner, addr1] = await ethers.getSigners();

        const applicationData = EthCrypto.cipher.stringify(
            await EthCrypto.encryptWithPublicKey(publicKey, message)
        );

        console.info("Application data: ", applicationData);

        // Send application data from addr1
        await expect(javiTask.connect(addr1).sendApplication(applicationData))
            .to.be.reverted;

        // Send application data from owner
        await expect(javiTask.connect(owner).sendApplication(applicationData))
            .to.emit(illiniTask, "Task")
            .withArgs(applicationData, javiTask.address, owner.address);

        // Check that the contract is destroyed
        const code = await network.provider.send("eth_getCode", [
            javiTask.address,
        ]);
        expect(code).to.equal("0x");
    });
});
