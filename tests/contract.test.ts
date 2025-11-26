import { describe, it, expect } from "vitest";
import {
  CONTRACT_ABI,
  ENTRY_FEE_ETH,
  COUNTDOWN_DURATION_SECONDS,
  QUEUE_SIZE,
} from "@/lib/contract";

describe("Contract Configuration", () => {
  it("should have correct entry fee", () => {
    expect(ENTRY_FEE_ETH).toBe("0.001");
  });

  it("should have 42-minute countdown duration", () => {
    expect(COUNTDOWN_DURATION_SECONDS).toBe(42 * 60);
    expect(COUNTDOWN_DURATION_SECONDS).toBe(2520);
  });

  it("should have queue size of 100", () => {
    expect(QUEUE_SIZE).toBe(100);
  });

  it("should have valid ABI with required functions", () => {
    const functionNames = CONTRACT_ABI.filter(
      (item) => item.type === "function"
    ).map((item) => item.name);

    expect(functionNames).toContain("sendOne");
    expect(functionNames).toContain("endGame");
    expect(functionNames).toContain("batchPayout");
    expect(functionNames).toContain("getTimeRemaining");
    expect(functionNames).toContain("getCurrentQueuePositions");
    expect(functionNames).toContain("getUserStats");
    expect(functionNames).toContain("canEndGame");
    expect(functionNames).toContain("getEstimatedPayout");
  });

  it("should have required events in ABI", () => {
    const eventNames = CONTRACT_ABI.filter((item) => item.type === "event").map(
      (item) => item.name
    );

    expect(eventNames).toContain("EntryAdded");
    expect(eventNames).toContain("CountdownReset");
    expect(eventNames).toContain("GameEnded");
    expect(eventNames).toContain("BatchPayoutExecuted");
  });

  it("sendOne function should be payable", () => {
    const sendOneFunc = CONTRACT_ABI.find(
      (item) => item.type === "function" && item.name === "sendOne"
    );
    expect(sendOneFunc?.stateMutability).toBe("payable");
  });

  it("batchPayout function should be nonpayable", () => {
    const batchPayoutFunc = CONTRACT_ABI.find(
      (item) => item.type === "function" && item.name === "batchPayout"
    );
    expect(batchPayoutFunc?.stateMutability).toBe("nonpayable");
  });
});
