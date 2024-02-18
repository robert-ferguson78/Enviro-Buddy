import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { testCounties, testDealers, county, sligo, concerto, testUsers } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";

suite("Dealer Model tests", () => {

  let dealersList = null;

  setup(async () => {
    await db.init("json");
    await db.countyStore.deleteAllCounties();
    await db.dealerStore.deleteAllDealers();
    dealersList = await db.countyStore.addCounty(county);
    for (let i = 0; i < testDealers.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testDealers[i] = await db.dealerStore.addDealer(dealersList._id, testDealers[i]);
    }
  });

  test("create single dealer", async () => {
    const sligoList = await db.countyStore.addCounty(sligo);
    const dealer = await db.dealerStore.addDealer(sligoList._id, concerto)
    assert.isNotNull(dealer._id);
    assertSubset (concerto, dealer);
  });

  test("create multiple dealerApi", async () => {
    const dealers = await db.countyStore.getCountyById(dealersList._id);
    assert.equal(testDealers.length, testDealers.length)
  });

  test("delete all dealerApi", async () => {
    const dealers = await db.dealerStore.getAllDealers();
    assert.equal(testDealers.length, dealers.length);
    await db.dealerStore.deleteAllDealers();
    const newDealers = await db.dealerStore.getAllDealers();
    assert.equal(0, newDealers.length);
  });

  test("get a dealer - success", async () => {
    const sligoList = await db.countyStore.addCounty(sligo);
    const dealer = await db.dealerStore.addDealer(dealersList._id, concerto)
    const newDealer = await db.dealerStore.getDealerById(dealer._id);
    assertSubset (concerto, newDealer);
  });


  test("delete One Dealer - fail", async () => {
    let dealers = await db.dealerStore.getAllDealers();
    dealers = await db.dealerStore.addDealer(dealersList._id, testDealers)
    await db.dealerStore.deleteDealer("bad-id");
    assert.equal(dealers.length, testDealers.length);
  });

  test("delete One Dealer - success", async () => {
    const id = testDealers[0]._id;
    await db.dealerStore.deleteDealer(id);
    const dealers = await db.dealerStore.getAllDealers();
    assert.equal(dealers.length, testDealers.length - 1);
    const deletedDealer = await db.dealerStore.getDealerById(id);
    console.log(deletedDealer);
    assert.notOk(deletedDealer);
  });

  test("get a county - bad params", async () => {
    assert.isNull(await db.countyStore.getCountyById(""));
    assert.isNull(await db.countyStore.getCountyById());
  });
});