import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { testCountys, mozart } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";

suite("County Model tests", () => {

  setup(async () => {
    db.init("mongo");
    await db.countyStore.deleteAllCountys();
    for (let i = 0; i < testCountys.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testCountys[i] = await db.countyStore.addCounty(testCountys[i]);
    }
  });

  test("create a county", async () => {
    const county = await db.countyStore.addCounty(mozart);
    assertSubset(mozart, county);
    assert.isDefined(county._id);
  });

  test("delete all countys", async () => {
    let returnedCountys = await db.countyStore.getAllCountys();
    assert.equal(returnedCountys.length, 3);
    await db.countyStore.deleteAllCountys();
    returnedCountys = await db.countyStore.getAllCountys();
    assert.equal(returnedCountys.length, 0);
  });

  test("get a county - success", async () => {
    const county = await db.countyStore.addCounty(mozart);
    const returnedCounty = await db.countyStore.getCountyById(county._id);
    assertSubset(mozart, county);
  });

  test("delete One Playist - success", async () => {
    const id = testCountys[0]._id;
    await db.countyStore.deleteCountyById(id);
    const returnedCountys = await db.countyStore.getAllCountys();
    assert.equal(returnedCountys.length, testCountys.length - 1);
    const deletedCounty = await db.countyStore.getCountyById(id);
    assert.isNull(deletedCounty);
  });

  test("get a county - bad params", async () => {
    assert.isNull(await db.countyStore.getCountyById(""));
    assert.isNull(await db.countyStore.getCountyById());
  });

  test("delete One County - fail", async () => {
    await db.countyStore.deleteCountyById("bad-id");
    const allCountys = await db.countyStore.getAllCountys();
    assert.equal(testCountys.length, allCountys.length);
  });
});
