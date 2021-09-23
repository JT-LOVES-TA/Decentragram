const { assert } = require('chai')
require('web3')

const Decentragram = artifacts.require('./Decentragram.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Decentragram', ([deployer, author, tipper]) => {
  let decentragram

  before(async () => {
    decentragram = await Decentragram.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await decentragram.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await decentragram.name()
      assert.equal(name, 'Decentragram')
    })
  })

  describe('images', async () => {

    let result, imageCount;
    const hash = 'MeMyselfAndI';


    before(async () => {
      result = await decentragram.uploadImage(hash, 'Image description', { from: author })
      imageCount = await decentragram.imageCount()
    })



    it("Creates images", async () => {

      assert.equal(imageCount, 1);
      const event = result.logs[0].args;
      assert.equal(event.id.toNumber(), imageCount.toNumber(), "Id is correct.")
      assert.equal(event.hash, hash, "Hash is correct")
      assert.equal(event.description, 'Image description', "Description is correct")
      assert.equal(event.tipamount, '0', "tipamount is correct")
      assert.equal(event.author, author, "author is correct")


      result = await decentragram.uploadImage('', 'Image description', { from: author }).should.be.rejected;
      result = await decentragram.uploadImage(hash, '', { from: author }).should.be.rejected;


    })

    it("Lists images in the struct", async () => {
      const image = await decentragram.images(imageCount)
      assert.equal(image.id.toNumber(), imageCount.toNumber(), "Id is correct.")
      assert.equal(image.hash, hash, "Hash is correct")
      assert.equal(image.description, 'Image description', "Description is correct")
      assert.equal(image.tipamount, '0', "tipamount is correct")
      assert.equal(image.author, author, "author is correct")
    })

    it("Tip functionning", async () => {

      let oldAuthorBalance;
      oldAuthorBalance = await web3.eth.getBalance(author)
      oldAuthorBalance = new web3.utils.BN(oldAuthorBalance)
      result = await decentragram.tipImageOwner(imageCount, { from: tipper, value: web3.utils.toWei('1', 'Ether') })

      const event = result.logs[0].args;
      assert.equal(event.id.toNumber(), imageCount.toNumber(), "Id is correct.")
      assert.equal(event.hash, hash, "Hash is correct")
      assert.equal(event.description, 'Image description', "Description is correct")
      assert.equal(event.tipamount, '1000000000000000000', "tipamount is correct")
      assert.equal(event.author, author, "author is correct")

      let newAuthorBalance;
      newAuthorBalance = await web3.eth.getBalance(author)
      newAuthorBalance = new web3.utils.BN(newAuthorBalance)

      let tipImageOwner;
      tipImageOwner = await web3.utils.toWei('1', 'Ether')
      tipImageOwner = new web3.utils.BN(tipImageOwner)

      const expectedBalance = oldAuthorBalance.add(tipImageOwner)
      assert.equal(expectedBalance.toString(), newAuthorBalance.toString());

      await decentragram.tipImageOwner(imageCount+1, { from: tipper, value: web3.utils.toWei('1', 'Ether') }).should.be.rejected



    })

  })
})