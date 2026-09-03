/**
 * Minimal mock of the Max/LiveAPI environment for unit tests.
 * Extend this mock rather than skipping a test (CLAUDE.md rule).
 * Phase 2 grows it alongside lom.ts (observers, paths, goto/get/set).
 */

type ObserverCallback = (args: unknown[]) => void;

export class MockLiveAPI {
  /** Ids are 0 while a set is loading — the mock defaults to the hostile case. */
  id = 0;
  path = '';
  private readonly properties = new Map<string, unknown>();

  constructor(private readonly callback?: ObserverCallback) {}

  set(property: string, value: unknown): void {
    this.properties.set(property, value);
  }

  get(property: string): unknown {
    return this.properties.get(property);
  }

  /** Simulate a LOM observer notification firing. */
  notify(args: unknown[]): void {
    this.callback?.(args);
  }
}
