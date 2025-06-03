
import '@analogjs/vitest-angular/setup-zone';

import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { getTestBed } from '@angular/core/testing';

getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

// Vitest doesn't expose Jasmine globals like `spyOn` by default. Provide minimal
// shims so existing tests written for Jasmine continue to work.
import { vi, expect } from 'vitest';

(globalThis as any).spyOn = vi.spyOn;
(globalThis as any).jasmine = {
  createSpy: (name?: string) => {
    const spy = vi.fn();
    (spy as any).and = {
      returnValue(value: unknown) {
        spy.mockReturnValue(value);
        return spy;
      },
      resolveTo(value: unknown) {
        spy.mockResolvedValue(value);
        return spy;
      }
    };
    return spy;
  },
  createSpyObj: (_name: string, methods: string[]) => {
    const obj: Record<string, any> = {};
    for (const m of methods) {
      const spy = vi.fn();
      (spy as any).and = {
        returnValue(value: unknown) {
          spy.mockReturnValue(value);
          return spy;
        },
        resolveTo(value: unknown) {
          spy.mockResolvedValue(value);
          return spy;
        }
      };
      obj[m] = spy;
    }
    return obj;
  }
};

expect.extend({
  toBeTrue(received: unknown) {
    const pass = received === true;
    return {
      pass,
      message: () => `expected ${received} to be true`
    };
  },
  toBeFalse(received: unknown) {
    const pass = received === false;
    return {
      pass,
      message: () => `expected ${received} to be false`
    };
  }
});

