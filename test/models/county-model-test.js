import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { testCounties, sligo } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";

suite("County Model tests", () => {

  setup(async () => {
    db.init("firestore");
    await db.countyStore.deleteAllCounties();
    for (let i = 0; i < testCounties.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testCounties[i] = await db.countyStore.addCounty(testCounties[i]);
    }
  });

  test("create a county", async () => {
    const county = await db.countyStore.addCounty(sligo);
    assertSubset(sligo, county);
    assert.isDefined(county._id);
  });

  test("delete all counties", async () => {
    let returnedCounties = await db.countyStore.getAllCounties();
    assert.equal(returnedCounties.length, 7);
    await db.countyStore.deleteAllCounties();
    returnedCounties = await db.countyStore.getAllCounties();
    assert.equal(returnedCounties.length, 0);
  });

  test("get a county - success", async () => {
    const county = await db.countyStore.addCounty(sligo);
    console.log("info here");
    console.log(county);
    const returnedCounty = await db.countyStore.getCountyById(county._id);
    console.log(returnedCounty);
    assertSubset(sligo, county);
  });

  test("delete One County - success", async function() {
    this.timeout(5000);
    const id = testCounties[0]._id;
    await db.countyStore.deleteCountyById(id);
    const returnedCounties = await db.countyStore.getAllCounties();
    assert.equal(returnedCounties.length, testCounties.length - 1);
    const deletedCounty = await db.countyStore.getCountyById(id);
    assert.isNull(deletedCounty);
});

  test("get a county - bad params", async () => {
    assert.isNull(await db.countyStore.getCountyById(""));
    assert.isNull(await db.countyStore.getCountyById());
  });

  test("delete One County - fail", async () => {
    await db.countyStore.deleteCountyById("bad-id");
    const allCounties = await db.countyStore.getAllCounties();
    assert.equal(testCounties.length, allCounties.length);
  });
});
