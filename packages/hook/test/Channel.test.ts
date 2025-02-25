/**
 * Copyright (c) Meta Platforms, Inc. and affiliates. All Rights Reserved.
 */

import "jest";
import { Channel } from "../src/Channel";

type ChannelEvents = {
  ev1: [],
  ev2: [i: number],
  ev3: [i: number, s: string]
}

describe("test Channel", () => {
  test("empty callback", () => {
    const channel = new Channel<Pick<ChannelEvents, 'ev1'>>();
    expect(channel.emit('ev1')).toBe(undefined);
  });

  test("simple callback", () => {
    const channel = new Channel<ChannelEvents>();
    const fn1 = jest.fn((i: number) => { });
    const fn2 = jest.fn<void, ChannelEvents['ev1']>();

    channel.on('ev2').add(fn1);
    channel.on('ev1').add(fn2);

    channel.emit('ev2', 20);
    expect(fn2).toBeCalledTimes(0);
    expect(fn1).toBeCalledTimes(1);
    expect(fn1.mock.calls[0]).toEqual([20]);
  });

  test("multiple callbacks", () => {
    const channel = new Channel<ChannelEvents>();
    const fn1 = jest.fn<void, ChannelEvents['ev3']>();
    const fn2 = jest.fn<void, ChannelEvents['ev3']>();

    channel.on('ev3').add(fn1);
    channel.on('ev3').add(fn2);

    channel.emit('ev3', 20, "hi");

    expect(fn1).toBeCalledTimes(1);
    expect(fn1.mock.calls[0]).toEqual([20, "hi"]);

    expect(fn2).toBeCalledTimes(1);
    expect(fn2.mock.calls[0]).toEqual([20, "hi"]);
  });

  test("multiple callbacks - simpler api", () => {
    const channel = new Channel<ChannelEvents>();
    const fn1 = jest.fn<void, ChannelEvents['ev3']>();
    const fn2 = jest.fn<void, ChannelEvents['ev3']>();

    channel.addListener('ev3', fn1);
    channel.addListener('ev3', fn2);

    channel.emit('ev3', 20, "hi");

    expect(fn1).toBeCalledTimes(1);
    expect(fn1.mock.calls[0]).toEqual([20, "hi"]);

    expect(fn2).toBeCalledTimes(1);
    expect(fn2.mock.calls[0]).toEqual([20, "hi"]);
  });

});
