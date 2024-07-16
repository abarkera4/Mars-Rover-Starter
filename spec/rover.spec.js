const Rover = require('../rover.js');
const Message = require('../message.js');
const Command = require('../command.js');

describe("Rover class", function() {

  test("constructor sets position and default values for mode and generatorWatts", function(){
    let newRover = new Rover(1);
    expect(newRover.position).toEqual(1);
    expect(newRover.mode).toEqual('NORMAL');
    expect(newRover.generatorWatts).toEqual(110);
  });

  test("response returned by receiveMessage contains the name of the message", function() {
    let newRover = new Rover(1);
    let message = new Message("testName", [new Command("STATUS_CHECK")]);
    expect(newRover.receiveMessage(message).message).toEqual("testName");
  });

  test("response returned by receiveMessage includes two results if two commands are sent in the message", function (){
    let newRover = new Rover(1);
    let newCommand = [new Command("STATUS_CHECK"), new Command("MODE_CHANGE", "LOW_POWER")];
    let message = new Message("testName", newCommand);
    expect(newRover.receiveMessage(message).results).toHaveLength(2);
  });

  test("responds correctly to the status check command", function() {
    let newRover = new Rover(1);
    let newCommand = [new Command("STATUS_CHECK")];
    let message = new Message("Status Check", newCommand);
    let response = newRover.receiveMessage(message).results[0].roverStatus;
    expect(response.generatorWatts).toEqual(110);
    expect(response.mode).toEqual("NORMAL");
    expect(response.position).toEqual(1);
  });

  test("responds correctly to the mode change command", function (){
    let newRover = new Rover(1);
    let newCommand = [new Command("MODE_CHANGE", "LOW_POWER")];
    let message = new Message("Mode Change", newCommand);
    let response = newRover.receiveMessage(message).results[0];
    expect(response.completed).toBe(true);
  });

  test("responds with a false completed value when attempting to move in LOW_POWER mode", function (){
    let newRover = new Rover(1);
    let newCommand = [
      new Command("MODE_CHANGE", "LOW_POWER"),
      new Command("MOVE", 20)
    ];
    let message = new Message("Move in Low Power", newCommand);

    let initialPosition = newRover.position;
    let response = newRover.receiveMessage(message).results;

    expect(response[0].completed).toBe(true);
    expect(response[1].completed).toBe(false);
    expect(newRover.position).toEqual(initialPosition);
  });

  test("responds correctly to move command in NORMAL mode", function (){
    let newRover = new Rover(1);
    let newCommand = [new Command("MOVE", 20)];
    let message = new Message("Move in Normal Mode", newCommand);
    let response = newRover.receiveMessage(message).results;
    expect(response[0].completed).toBe(true);
    expect(newRover.position).toEqual(20);
  });

  // 7 tests here!

});