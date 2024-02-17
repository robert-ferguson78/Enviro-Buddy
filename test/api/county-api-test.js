import { EventEmitter } from "events";
import { assert } from "chai";
import { playtimeService } from "./playtime-service.js";
import { assertSubset } from "../test-utils.js";

import { maggie, mozart, testCountys } from "../fixtures.js";

EventEmitter.setMaxListeners(25);

suite("County API tests", () => {
  let user = null;

  setup(async () => {
    await playtimeService.deleteAllCountys();
    await playtimeService.deleteAllUsers();
    user = await playtimeService.createUser(maggie);
    mozart.userid = user._id;
  });

  teardown(async () => {});

  test("create county", async () => {
    const returnedCounty = await playtimeService.createCounty(mozart);
    assert.isNotNull(returnedCounty);
    assertSubset(mozart, returnedCounty);
  });

  test("delete a county", async () => {
    const county = await playtimeService.createCounty(mozart);
    const response = await playtimeService.deleteCounty(county._id);
    assert.equal(response.status, 204);
    try {
      const returnedCounty = await playtimeService.getCounty(county.id);
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No County with this id", "Incorrect Response Message");
    }
  });

  test("create multiple countys", async () => {
    for (let i = 0; i < testCountys.length; i += 1) {
      testCountys[i].userid = user._id;
      // eslint-disable-next-line no-await-in-loop
      await playtimeService.createCounty(testCountys[i]);
    }
    let returnedLists = await playtimeService.getAllCountys();
    assert.equal(returnedLists.length, testCountys.length);
    await playtimeService.deleteAllCountys();
    returnedLists = await playtimeService.getAllCountys();
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
