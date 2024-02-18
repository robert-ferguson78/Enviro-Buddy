import { EventEmitter } from "events";
import { assert } from "chai";
import { playtimeService } from "./playtime-service.js";
import { assertSubset } from "../test-utils.js";

import { maggie, sligo, testCounties } from "../fixtures.js";

EventEmitter.setMaxListeners(25);

suite("County API tests", () => {
  let user = null;

  setup(async () => {
    await playtimeService.deleteAllCounties();
    await playtimeService.deleteAllUsers();
    user = await playtimeService.createUser(maggie);
    sligo.userid = user._id;
  });

  teardown(async () => {});

  test("create county", async () => {
    const returnedCounty = await playtimeService.createCounty(sligo);
    assert.isNotNull(returnedCounty);
    assertSubset(sligo, returnedCounty);
  });

  test("delete a county", async () => {
    const county = await playtimeService.createCounty(sligo);
    const response = await playtimeService.deleteCounty(county._id);
    assert.equal(response.status, 204);
    try {
      const returnedCounty = await playtimeService.getCounty(county.id);
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No County with this id", "Incorrect Response Message");
    }
  });

  test("create multiple counties", async () => {
    for (let i = 0; i < testCounties.length; i += 1) {
      testCounties[i].userid = user._id;
      // eslint-disable-next-line no-await-in-loop
      await playtimeService.createCounty(testCounties[i]);
    }
    let returnedLists = await playtimeService.getAllCounties();
    assert.equal(returnedLists.length, testCounties.length);
    await playtimeService.deleteAllCounties();
    returnedLists = await playtimeService.getAllCounties();
    assert.equal(returnedLists.length, 0);
  });

  test("remove non-existant county", async () => {
    try {
      const response = await playtimeService.deleteCounty("not an id");
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No County with this id", "Incorrect Response Message");
    }
  });
});
