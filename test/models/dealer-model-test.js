import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { testCountys, testDealers, beethoven, mozart, concerto, testUsers } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";

suite("Dealer Model tests", () => {

  let beethovenList = null;

  setup(async () => {
    await db.init("mongo");
    await db.countyStore.deleteAllCountys();
    await db.trackStore.deleteAllDealers();
    beethovenList = await db.countyStore.addCounty(beethoven);
    for (let i = 0; i < testDealers.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testDealers[i] = await db.trackStore.addDealer(beethovenList._id, testDealers[i]);
    }
  });

  test("create single track", async () => {
    const mozartList = await db.countyStore.addCounty(mozart);
    const track = await db.trackStore.addDealer(mozartList._id, concerto)
    assert.isNotNull(track._id);
    assertSubset (concerto, track);
  });

  test("create multiple trackApi", async () => {
    const tracks = await db.countyStore.getCountyById(beethovenList._id);
    assert.equal(testDealers.length, testDealers.length)
  });

  test("delete all trackApi", async () => {
    const tracks = await db.trackStore.getAllDealers();
    assert.equal(testDealers.length, tracks.length);
    await db.trackStore.deleteAllDealers();
    const newDealers = await db.trackStore.getAllDealers();
    assert.equal(0, newDealers.length);
  });

  test("get a track - success", async () => {
    const mozartList = await db.countyStore.addCounty(mozart);
    const track = await db.trackStore.addDealer(mozartList._id, concerto)
    const newDealer = await db.trackStore.getDealerById(track._id);
    assertSubset (concerto, newDealer);
  });

  test("delete One Dealer - success", async () => {
    const id = testDealers[0]._id;
    await db.trackStore.deleteDealer(id);
    const tracks = await db.trackStore.getAllDealers();
    assert.equal(tracks.length, testCountys.length - 1);
    const deletedDealer = await db.trackStore.getDealerById(id);
    assert.isNull(deletedDealer);
  });

  test("get a county - bad params", async () => {
    assert.isNull(await db.trackStore.getDealerById(""));
    assert.isNull(await db.trackStore.getDealerById());
  });

  test("delete One User - fail", async () => {
    await db.trackStore.deleteDealer("bad-id");
    const tracks = await db.trackStore.getAllDealers();
    assert.equal(tracks.length, testCountys.length);
  });
});
