import { assert } from "chai";
import { assertSubset } from "../test-utils.js";
import { playtimeService } from "./playtime-service.js";
import { maggie, maggieCredentials, testUsers } from "../fixtures.js";
import { db } from "../../src/models/db.js";

const users = new Array(testUsers.length);
let maggieUser = "";

// setup
suite("User API tests", () => {
  setup(async () => {
    playtimeService.clearAuth();
    await playtimeService.authenticate(maggieCredentials);
    await playtimeService.deleteAllUsers();
    for (let i = 0; i < testUsers.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      users[0] = await playtimeService.createUser(testUsers[i]);
    }
    maggieUser = await playtimeService.createUser(maggie);
  });
  teardown(async () => {});

  // test to create a user
  test("create a user", async () => {
    await playtimeService.authenticate(maggieCredentials);
    const newUser = await playtimeService.createUser(maggie);
    assertSubset(maggie, newUser);
    assert.isDefined(newUser._id);
  });

  // test to delete all users
  test("delete all users - success due to admin credentials", async () => {
    playtimeService.clearAuth();
    await playtimeService.authenticate(maggieCredentials);
    let returnedUsers = await playtimeService.getAllUsers();
    assert.equal(returnedUsers.length, 4);
    await playtimeService.createUser(maggie);
    await playtimeService.authenticate(maggieCredentials);
    await playtimeService.deleteAllUsers();
    returnedUsers = await playtimeService.getAllUsers();
    assert.equal(returnedUsers.length, 0);
    // added to check that user deletion prompted placemark deletion
    const returnedPlacemarks = await playtimeService.getAllPlacemarks();
    assert.equal(returnedPlacemarks.length, 0);
  });

  // test to delete all users - should fail due to user vs admin creds
  test("delete all users - fail due to not being an admin", async () => {
    try {
      await playtimeService.deleteAllUsers();
    } catch (error) {
      assert.equal(error.response.data.statusCode, 403);
    }
  });

  // test to delete a single user
  test("delete a user", async () => {
    await playtimeService.authenticate(maggieCredentials);
    console.log(maggieUser._id);
    await playtimeService.deleteUser(maggieUser._id);
    assert.deepEqual(users.length, 3);
  });

  // test to delete a single user - should fail due to user vs admin creds
  test("delete a user - fail due to not being an admin", async () => {
    try {
      await playtimeService.authenticate(maggieCredentials);
      await playtimeService.deleteUser(maggie._id);
    } catch (error) {
      assert.equal(error.response.data.statusCode, 403);
    }
  });

  // test to get a user by id
  test("get a user", async () => {
    const returnedUser = await playtimeService.getUser(users[0]._id);
    assert.deepEqual(users[0], returnedUser);
  });

  // test to attempt to retrieve a user with invalid data
  test("get a user - bad id", async () => {
    try {
      const returnedUser = await playtimeService.getUser("1234");
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No User with this id");
      assert.equal(error.response.data.statusCode, 503);
    }
  });

  // test to attempt to retrieve a user that has been deleted
  test("get a user - deleted user", async () => {
    playtimeService.clearAuth();
    await playtimeService.authenticate(maggieCredentials);
    await playtimeService.deleteAllUsers();
    await playtimeService.createUser(maggie);
    await playtimeService.authenticate(maggieCredentials);
    try {
      const returnedUser = await playtimeService.getUser(users[0]._id);
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No User with this id");
      assert.equal(error.response.data.statusCode, 404);
    }
  });
});