import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { testCountys, testDealers, beethoven, sligo, concerto, testUsers } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";

suite("Dealer Model tests", () => {

  let beethovenList = null;

  setup(async () => {
    await db.init("mongo");
    await db.countyStore.deleteAllCountys();
    await db.dealerStore.deleteAllDealers();
    beethovenList = await db.countyStore.addCounty(beethoven);
    for (let i = 0; i < testDealers.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testDealers[i] = await db.dealerStore.addDealer(beethovenList._id, testDealers[i]);
    }
  });

  test("create single track", async () => {
    const sligoList = await db.countyStore.addCounty(sligo);
    const track = await db.dealerStore.addDealer(sligotList._id, concerto)
    assert.isNotNull(track._id);
    assertSubset (concerto, track);
  });

  test("create multiple trackApi", async () => {
    const dealers = await db.countyStore.getCountyById(beethovenList._id);
    assert.equal(testDealers.length, testDealers.length)
  });

  test("delete all trackApi", async () => {
    const dealers = await db.dealerStore.getAllDealers();
    assert.equal(testDealers.length, dealers.length);
    await db.dealerStore.deleteAllDealers();
    const newDealers = await db.dealerStore.getAllDealers();
    assert.equal(0, newDealers.length);
  });

  test("get a track - success", async () => {
    const sligoList = await db.countyStore.addCounty(sligo);
    const track = await db.dealerStore.addDealer(sligoList._id, concerto)
    const newDealer = await db.dealerStore.getDealerById(track._id);
    assertSubset (concerto, newDealer);
  });

  test("delete One Dealer - success", async () => {
    const id = testDealers[0]._id;
    await db.dealerStore.deleteDealer(id);
    const dealers = await db.dealerStore.getAllDealers();
    assert.equal(dealers.length, testCountys.length - 1);
    const deletedDealer = await db.dealerStore.getDealerById(id);
    assert.isNull(deletedDealer);
  });

  test("get a county - bad params", async () => {
    assert.isNull(await db.dealerStore.getDealerById(""));
    assert.isNull(await db.dealerStore.getDealerById());
  });

  test("delete One User - fail", async () => {
    await db.dealerStore.deleteDealer("bad-id");
    const dealers = await db.dealerStore.getAllDealers();
    assert.equal(dealers.length, testCountys.length);
  });
});
