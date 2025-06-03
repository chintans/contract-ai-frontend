Great. I’ll prepare in-depth documentation on the Vitest test framework, tailored for use with Angular 19 and standalone components. It will include best practices, TypeScript-specific guidance, code examples, and a migration guide from Karma. The documentation will be structured to suit the needs of an LLM coding agent.

I’ll get back to you once it’s ready.


# Using Vitest with Angular 19 (Standalone Components)

## Overview of the Vitest Framework and Architecture

Vitest is a **next-generation testing framework** built on top of Vite. It leverages Vite’s fast ESM-based build system for blazing-fast test execution and a smooth developer experience. In practice, Vitest reuses Vite’s configuration and plugins, ensuring consistency between your app and test builds. This means an Angular project that uses Vite (as of Angular 18+ the CLI uses a Vite-based builder by default) can integrate Vitest with minimal friction. Key characteristics of Vitest include:

* **Jest-Compatible API:** Vitest provides a testing API very similar to Jasmine/Jest, including global functions like `describe`, `it`, and `expect`. This makes migrating tests straightforward since the syntax and style remain familiar. You can use Jasmine-style functions (as Angular’s `fakeAsync`, `tick`, etc. rely on them) or Vitest’s own global APIs interchangeably in most cases. It even supports features like test `suite`/`describe`, hooks (`beforeEach`, `afterEach`), and assertions akin to Jasmine/Jest.

* **Speed via Vite Architecture:** Vitest is **extremely fast**. It uses Vite’s bundler (esbuild) under the hood to compile TypeScript/ESM efficiently, and runs tests in parallel using a worker-thread based system. Each test file can execute in isolation, ensuring reliability and taking advantage of modern multi-core CPUs. The smart watch mode can run only impacted tests on file changes, similar to HMR for tests.

* **Out-of-the-Box ESM & TypeScript Support:** Vitest treats ESM as a first-class citizen, avoiding the hacks needed to run ESM modules in Jest. TypeScript is supported out-of-the-box – Vitest will handle `.ts` test files without extra config, and it provides type definitions for its globals (which you can enable in your tsconfig). This means Angular’s TypeScript code (including Decorators and modern syntax) is naturally supported by Vitest’s test runner.

* **Rich Features (Mocks, Snapshots, Coverage):** Vitest includes a mocking API (`vi` global) to spy on functions or stub modules, similar to Jest’s `jest.fn()` and `jest.mock`. You can create spies, use `vi.spyOn()` to replace methods, and leverage fake timers with `vi.useFakeTimers()`. It also supports **snapshot testing** using `expect(...).toMatchSnapshot()`, which is useful for Angular component tests to capture templates. Code coverage is built in via V8 coverage integration, and Vitest even provides a UI runner (`vitest --ui`) for an interactive test experience.

Overall, Vitest’s design emphasizes **speed, simplicity, and compatibility**. It runs tests in a Node-like environment by default (with JSDOM simulating the browser), but can also execute tests in a real browser if needed. Its architecture (parallel workers, Vite-powered bundling, instant watch mode) makes it a great fit for large Angular projects where Karma’s browser-based testing was slow. The Angular team itself has acknowledged the benefits of modern test runners like Vitest in terms of performance and developer experience. *Notably, Angular 19 deprecates Karma and is evaluating modern runners as defaults going forward, making Vitest a forward-looking choice for Angular applications.*

## Integrating Vitest with Angular 19 (Standalone Components)

Integrating Vitest into an Angular 19 project (which likely uses **standalone components** and the new Vite-based build system) involves setting up the test runner and configuration. Angular’s move to a Vite-powered builder in v18+ has made this process easier. There are two primary approaches: using the **AnalogJS plugin** (or Nx plugin) for automated setup, or configuring Vitest manually.

**1. Automated Setup via AnalogJS (or Nx) Plugin:** The AnalogJS project provides a schematic that automates Vitest setup for Angular. This is useful for Angular CLI projects. To use it, install the AnalogJS platform package and run its generator:

```bash
npm install --save-dev @analogjs/platform

# Use the schematic to configure Vitest for your Angular project
ng g @analogjs/platform:setup-vitest --project <your-project-name>
```

This generator will perform several steps for you:

* **Install Vitest and related packages**: It adds Vitest and Vite (if not present) along with `@analogjs/vite-plugin-angular` (to handle Angular compilation in Vite) and `@analogjs/vitest-angular` (to integrate Angular’s testing utilities with Vitest). Packages like `jsdom` (the default DOM simulation environment) and Vitest’s coverage/UI tools are also added.

* **Generate a Vite config**: A `vite.config.ts` (or `.mts`) file is created at the root with Vitest settings. For example, the config will include the Angular Vite plugin and a `test` section like:

  ```ts
  /// <reference types="vitest" />
  import { defineConfig } from 'vite';
  import angular from '@analogjs/vite-plugin-angular';

  export default defineConfig(({ mode }) => ({
    plugins: [angular()],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['src/test-setup.ts'],
      include: ['**/*.spec.ts'],
      reporters: ['default'],
      // you can add other options here, e.g. threads, coverage, etc.
    },
    define: {
      'import.meta.vitest': mode !== 'production',
    },
  }));
  ```

  This configuration tells Vitest to use **JSDOM** as the test environment (simulating a browser in Node), load **global test APIs** (`globals: true` means you can use `describe/it/expect` without imports), and execute all `*.spec.ts` files in the project. It also specifies a **setup file** (`src/test-setup.ts`) which we discuss next, and defines `import.meta.vitest` for conditional logic (allowing code to detect test mode if needed).

* **Generate a test setup file**: The schematic creates `src/test-setup.ts` to bootstrap Angular’s testing environment in Vitest. In Karma, Angular tests used a `test.ts` (main test entry) to initialize the `TestBed`. With Vitest, this setup file plays a similar role. For a typical (zoned) Angular app, `test-setup.ts` includes:

  ```ts
  import '@analogjs/vitest-angular/setup-zone';
  import { getTestBed } from '@angular/core/testing';
  import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

  getTestBed().initTestEnvironment(
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting()
  );
  ```

  This code ensures the Angular testing module is initialized with a **browser dynamic platform** in the Vitest environment. The `setup-zone` import configures Zone.js integration so that Angular’s async testing utilities (`fakeAsync`, `whenStable()`, etc.) work properly under Vitest. If your Angular app is configured to run **without zone.js** (zoneless change detection), Analog provides an alternative `setup-snapshots` script and a special `ZonelessTestModule` to initialize the environment without zones.

* **Update Angular configuration**: The Angular CLI’s config (`angular.json`) is updated so that the `ng test` command uses the Vitest builder. The generator replaces the test target’s builder with `@analogjs/vitest-angular:test`. This means `ng test` will invoke Vitest instead of Karma. (Alternatively, you can add a new target for Vitest and keep `ng test` for Karma until you fully switch, but typically Karma is removed.)

* **Update TypeScript config**: The **tsconfig.spec.json** is modified to work with Vitest. It adds Vitest’s types (`"types": ["jasmine", "vitest/globals"]`) so that global functions like `vi` and `expect` are recognized by TypeScript. It may also set a slightly higher `target` (e.g. ES2016) if needed for certain features. The `src/test-setup.ts` file is included in the compilation so that it’s executed before tests. For example, after running the setup schematic, your `tsconfig.spec.json` might include:

  ```json
  {
    "extends": "./tsconfig.json",
    "compilerOptions": {
      "outDir": "./out-tsc/spec",
      "target": "es2016",
      "types": ["jasmine", "vitest/globals"]
    },
    "files": ["src/test-setup.ts"],
    "include": ["src/**/*.spec.ts", "src/**/*.d.ts"]
  }
  ```

After this automated setup, you can run tests with the same command as before (`ng test`). Under the hood, this will execute Vitest’s test runner. You can also run Vitest directly via npm scripts – for example, add `"test": "vitest"` in your **package.json** to invoke Vitest in watch mode. Vitest’s watch mode is interactive and will refresh tests as you edit code. In a Continuous Integration (CI) context, you might use `vitest run --coverage` to run all tests once with coverage.

> **Nx Note:** If you use Nx for your Angular workspace, Nx has similar support for Vitest. You can run `nx add @nx/vite` then `nx g @nx/vite:vitest --project <name>` to add Vitest. This sets up a very similar configuration (using the Analog Vite plugin under the hood). Nx even allows generating new Angular projects with Vitest as the default test runner (`--unitTestRunner=vitest`).

**2. Manual Setup:** If you prefer a manual approach or more control, you can integrate Vitest without the schematic:

* Install the required packages: `npm install --save-dev vitest vite @analogjs/vite-plugin-angular @analogjs/vitest-angular jsdom`. These include the Vitest runner, Vite, and Analog’s Angular plugins for Vite/Vitest. (Also add `@vitest/coverage-v8` and `@vitest/ui` for coverage and the UI runner if desired.)

* Add a `vite.config.ts` configuration as shown above, including the Angular plugin and a `test` section. Ensure `test.environment` is set to `'jsdom'` (or `'happy-dom'` as an alternative lightweight DOM), and `test.setupFiles` points to your setup file.

* Create the `src/test-setup.ts` to init the Angular test environment (with either zone or zoneless setup as needed, identical to what the schematic would generate). Import Angular’s `BrowserDynamicTestingModule` and call `getTestBed().initTestEnvironment(...)` as shown earlier.

* Update your **angular.json** manually: change the test target builder to `@analogjs/vitest-angular:test` (or simply remember to use `vitest` via npm script instead of `ng test`). If you remove the Karma builder, you can also delete the old `karma.conf.js` and `src/test.ts` (the latter is replaced by our `test-setup.ts`).

* Adjust **tsconfig.spec.json**: include `"vitest/globals"` in the types array (and remove `"jasmine"` if you plan to fully drop Jasmine). Add the `test-setup.ts` to files, and ensure the `target` is an ES2015+ target (since Vitest runs tests in Node which supports modern syntax).

Using either approach, Vitest should now be integrated. At this point, running `ng test` or `npm run test` will spin up Vitest. The first run will be a cold start (vitest will build the project tests using Vite), but subsequent test runs (especially in watch mode) will be extremely fast thanks to Vite’s caching and module graph.

**Integration Tips:**

* If you encounter errors about modules being ESM vs CommonJS (for example, some libraries might complain “Cannot use import statement outside a module”), you may need to tweak the Vite config. Vitest (via Vite) sometimes needs to **optimize or inline certain dependencies**. You can add an option like `test.server.deps.inline` or `deps.exclude` in the config to handle these. For instance, if using Ionic, add the Ionic Angular package to the inline deps so Vite can transform it to ESM. This resolves issues with packages shipped only in CommonJS.

* JSDOM provides a headless DOM implementation. This covers most browser APIs (DOM methods, selectors, localStorage, etc.) that Angular components might use. However, it does not implement layout, CSS, or real rendering. For purely **visual** tests, consider Vitest’s experimental **browser mode** (which actually launches a headless browser via Playwright). In Angular, you can enable this by removing `environment: 'jsdom'` and adding a `test.browser` config in Vite (with a browser launcher). This is optional; for most unit tests JSDOM suffices, but it’s good to know if you need to test something relying on real browser behavior (e.g. canvas, CSS, etc.).

With Vitest wired up, you can begin writing and running tests for your Angular 19 application. The next sections cover how to write tests for standalone components using Vitest, and best practices to follow.

## Best Practices for Testing Angular Standalone Components with Vitest

When writing tests for Angular 19 projects that use **standalone components**, you’ll largely use Angular’s standard testing utilities (the `TestBed`, component fixtures, etc.), just running under the Vitest framework. Many best practices from Karma/Jasmine still apply, but here are specific tips for Vitest + Angular:

* **Use TestBed with Standalone Components:** Angular’s `TestBed` is still the core of unit testing components and services. With standalone components (which don’t require NgModules), you should include the component under test in the `imports` of your `TestBed.configureTestingModule` (instead of `declarations`). This makes the component available for instantiation. Likewise, if the component depends on other standalone components, directives, or pipes, include them in the `imports` array as well. Any services it uses can be provided via the `providers` array using Angular’s new standalone provider functions (like `provideHttpClient`, `provideRouter`, etc.) or via providing doubles/mocks. For example:

  ```ts
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightSearchComponent],  // the standalone component under test
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        /* ... other providers or mocks ... */
      ],
    }).compileComponents();
  });
  ```

  In this snippet (based on an Angular standalone component test), the component `FlightSearchComponent` is imported directly, and essential services like HttpClient are provided via standalone APIs. **Best Practice:** Provide only the needed collaborators. With standalone components, you no longer import large testing modules unnecessarily – you can import exactly the component and use fine-grained provider functions for its dependencies. This leads to faster and more isolated tests.

* **Organize Test Code Clearly:** Continue to use `describe` blocks to group related tests for a component or service. Each component, service, or directive should have its own spec file (e.g. `counter.component.spec.ts`, co-located with `counter.component.ts`). Within a spec, use a top-level `describe` named after the unit under test, then use nested `describe` or multiple `it` cases for different scenarios. Keep each test case focused on one behavior. Use **setup logic in `beforeEach`** to avoid repeating boilerplate (like creating the TestBed, initializing the fixture, etc.). In Vitest (as in Jasmine), `beforeEach` and `afterEach` run before/after each test in the suite, helping to reset state. Vitest will isolate each test file in a separate environment by default, but you should still avoid any shared mutable state between tests within the file (reset or re-create services as needed in each test). Angular’s TestBed will by default tear down and clean up the test module after each test run (since Angular v12+, `destroyAfterEach` is true by default), which helps prevent bleed-through between tests.

* **Leverage Angular Testing Utilities:** Angular offers powerful utilities that work with Vitest just as they did with Karma:

  * Use `fakeAsync()` and `tick()` for testing code with `setTimeout`, `Promise` microtasks, or Angular’s `async` operations. Make sure to import `fakeAsync, tick` from `@angular/core/testing`. They work in Vitest since Zone.js is set up via `setup-zone`. For example, you can simulate the passage of time in a test, and it will flush the Zone’s tasks correctly.
  * Use `waitForAsync` (formerly `async`) for testing asynchronous code that involves real promise resolution or when awaiting fixture stability. `waitForAsync` will ensure that async operations complete before the test assertions run.
  * Use `TestBed.inject()` to retrieve services or the `HttpTestingController` in your tests rather than directly instantiating services (this ensures they respect the provided configuration and any Angular-specific behavior).
  * If you have **component harnesses** or are using the Angular Testing Library (ATL), those can also be used with Vitest (the test runner doesn’t affect their usage).

* **DOM Interaction and Assertions:** With JSDOM, you can interact with the component’s rendered template via the fixture. Use `fixture.nativeElement` or `fixture.debugElement` to query DOM elements. For example, `fixture.nativeElement.querySelector('button').click()` will simulate a click (as JSDOM supports basic events). After such interactions, call `fixture.detectChanges()` to apply Angular’s change detection. Then you can assert on the updated DOM or component state. This approach remains the same as with Karma. One difference: JSDOM doesn’t layout or render pixels, so properties like element dimensions will be default values. But content, attributes, and classes will be present for assertions.

* **Snapshot Testing (Optional):** One new practice enabled by Vitest is snapshot testing. You can take a snapshot of a component’s DOM output and compare it in future runs. For example: `expect(fixture).toMatchSnapshot()`. Under the hood, this serializes the DOM structure of the component’s debug element. Snapshots can be useful to detect unexpected changes in template output. Use them judiciously (as over-reliance can make tests brittle), but they can be great for complex components’ markup verification. Make sure to run Vitest in watch or update mode to manage snapshots when intentional changes happen.

* **Test Only One Unit per File:** Even with standalone components eliminating NgModules, it’s best to **test one component (or service, etc.) at a time** in isolation. If a component has child components that are themselves complex, you might stub or mock them. Angular provides ways to override component metadata in tests (e.g., `TestBed.overrideComponent` to replace a component’s imports with a dummy component). This is advanced, but for simple cases you can rely on standalone components’ self-contained nature or include real dependencies if they are simple. The goal is to keep tests focused and fast. Vitest’s parallel execution means if you try to test too much in one spec, it won’t be able to parallelize as effectively. Many small, focused spec files are ideal.

* **Maintain Type Safety in Tests:** Write tests in TypeScript as strictly as you write application code. For example, when spying on a service method, ensure the spy’s signature matches the actual method’s signature (more on this in the next section). Use the types from Angular testing APIs – e.g., `let fixture: ComponentFixture<MyComponent> = TestBed.createComponent(MyComponent)`. This helps the LLM (and developers) catch errors early. With Vitest, ensure your IDE picks up Vitest’s type definitions (by configuring tsconfig as shown) so that methods like `expect()` and `vi.fn()` have proper types.

In summary, **organize your tests** by feature, keep them independent, and use Angular’s testing APIs to handle setup/teardown. The switch to Vitest does not fundamentally change *how* you write Angular tests – it changes *how* they run (faster, and in Node by default). The following sections illustrate some practical examples.

## TypeScript Considerations and Patterns for Writing Tests

Angular is a TypeScript framework, and writing tests in TS ensures you get compile-time checking for your tests. Here are some TypeScript-specific considerations when using Vitest with Angular:

* **Type Definitions for Vitest:** After integrating Vitest, ensure your `tsconfig.spec.json` includes the Vitest types so that global functions are recognized. As shown earlier, add `"vitest/globals"` to the `"types"` array. This will provide type info for `describe`, `it`, `expect`, `vi`, etc. If you are still including `"jasmine"` types for compatibility, you might see duplicate globals, but TypeScript generally can handle this (you might need to adjust the lib ordering if there are conflicts). Including `"node"` in types is also useful since JSDOM runs in a Node environment and you may use Node APIs in tests.

* **Using `vi` for Mocks and Spies:** Vitest’s global `vi` object offers functions to create spies and mocks. For instance, `vi.fn()` creates a generic spy function, and `vi.spyOn(obj, 'method')` spies on an existing object’s method. In TypeScript, you can type these to ensure the spy’s signature matches expectations. For example:

  ```ts
  const fakeService = {
    getData: vi.fn<Promise<string>, []>(() => Promise.resolve('test'))
  };
  ```

  This creates a `getData` spy that returns a Promise<string> with no arguments (the generic syntax `<ReturnType, [ArgTypes]>`). Often, though, you can let TypeScript infer types: `vi.fn(() => /*...*/)` will infer from the returned value. If replacing a method on an existing instance, `vi.spyOn(service, 'method')` returns a typed Spy instance. If you continue to use Jasmine’s `spyOn`, that works too – it’s globally available and has type definitions, but using one spy library (vitest’s) consistently is cleaner.

* **Interface and Class Mocks:** When providing test doubles in Angular’s DI, you can leverage TypeScript to enforce they match the interface or class. For example, if `AuthService` is an interface with method `login()`, you can do:

  ```ts
  const authServiceMock: jasmine.SpyObj<AuthService> = jasmine.createSpyObj('AuthService', ['login']);
  TestBed.configureTestingModule({
    providers: [{ provide: AuthService, useValue: authServiceMock }]
  });
  ```

  This uses Jasmine’s `createSpyObj` with a Generic to strongly-type the mock. If using Vitest’s `vi`, you would manually create an object that satisfies the interface:

  ```ts
  const authServiceMock: AuthService = { 
    login: vi.fn().mockResolvedValue(true) 
  } as AuthService;
  ```

  Note the `as AuthService` to satisfy structural typing. The takeaway: **use TypeScript’s generics or type assertions to ensure your mocks cover the needed interface**, preventing your tests from diverging from actual contract.

* **Strict Type-Checking in Tests:** It’s recommended to keep `"strict": true` in your tsconfig for tests. This will catch errors like missing properties on mocks, or incorrect usage of Angular testing APIs. For example, if you try to access a DOM element that might be `null`, TypeScript will remind you to handle that (perhaps by using `expect(element).not.toBeNull()` before accessing, or using non-null assertion if logically guaranteed).

* **Testing Angular Types:** Some Angular APIs use specific types that you should use in tests for clarity:

  * Use `ComponentFixture<MyComponent>` for fixture types, so you get autocompletion on `fixture.componentInstance` (which will be `MyComponent`).
  * If testing an `@Output` EventEmitter, note that its `emit` method is `void` return – so when spying, use the correct type to avoid assuming it returns a value.
  * When using `HttpTestingController`, it has methods like `expectOne()` that return `TestRequest` objects. Use the types from `@angular/common/http/testing` to work with these (e.g. `req: TestRequest = httpMock.expectOne(...)`). This ensures you call the correct methods on the test request (`flush`, etc.).

* **Migrating `async/await` Patterns:** Vitest allows using `async` functions in tests. You might replace some uses of Angular’s `waitForAsync` with plain `async`/`await` in your test functions, since Vitest will handle an `async it(...)` by awaiting it. For example, instead of:

  ```ts
  it('does something asynchronously', waitForAsync(() => {
    service.getData().then(result => {
      expect(result).toBe('value');
    });
  }));
  ```

  You can write:

  ```ts
  it('does something asynchronously', async () => {
    const result = await service.getData();
    expect(result).toBe('value');
  });
  ```

  This can be more natural with TypeScript’s `async` syntax. (Ensure the function you call returns a promise or is `await`-able.) Keep in mind, though, Angular’s testing utilities like `waitForAsync` also take care of test zone stabilization. If you had code that triggers change detection or timers, `waitForAsync` might still be needed, or you use `fakeAsync`/`tick` instead. Use the approach that matches your scenario.

* **Zone.js vs Fake Timers:** If you use `fakeAsync` and `tick()` in Angular tests, do **not** use Vitest’s `vi.useFakeTimers()` in the same test – this could conflict with Zone.js timers. Angular’s fakeAsync wraps the browser APIs and Jasmine/Vitest timers to control time. It’s best to let Angular/Zone manage these. In general, you won’t call Vitest’s timer functions in Angular tests; stick to Angular’s fakeAsync for simulating time passage in component logic (like waiting for debounce or delay).

* **Compiler Options for Standalone:** Angular 19 introduces a `strictStandalone` compiler flag that ensures all components are standalone. If you enable this, any non-standalone component usage is a compile error. In tests, if you try to use a component that isn’t standalone and haven’t imported its module, compilation will fail – which is good. It pushes you to either migrate that component to standalone or include the module. This flag can catch misconfigurations in tests too. It’s off by default (unless you opt in via tsconfig), but consider it for projects fully embracing standalone components.

In summary, treat test code as first-class code: maintain type accuracy, use proper types for Angular testing APIs, and take advantage of Vitest’s type-friendly features. This will help both human developers and tools (like an AI coding agent) understand and navigate your tests without errors.

## Examples: Writing Test Cases for Components, Services, and Directives

Let's walk through a few **realistic example tests** using Vitest in an Angular 19 context. These examples assume we have a Vitest setup as described above, and focus on standalone components.

### Testing a Standalone Component

Consider a simple Counter component that is standalone (no NgModule needed). It might look like this:

```typescript
// counter.component.ts (standalone component example)
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-counter',
  standalone: true,
  template: `<button (click)="increment()">{{count}}</button>`
})
export class CounterComponent {
  @Input() start = 0;
  @Output() countChanged = new EventEmitter<number>();
  count = 0;

  ngOnInit() {
    this.count = this.start;
  }
  increment() {
    this.count++;
    this.countChanged.emit(this.count);
  }
}
```

The component displays a button with a number and emits an event with the new count whenever the button is clicked. Now, here’s how we can test this component’s behavior using Vitest and Angular’s TestBed:

```typescript
import { TestBed } from '@angular/core/testing';
import { CounterComponent } from './counter.component';

describe('CounterComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CounterComponent]  // import the standalone component
    }).compileComponents();
  });

  it('should render the initial count and increment on click', () => {
    const fixture = TestBed.createComponent(CounterComponent);
    // Set an @Input() value before initial change detection
    fixture.componentInstance.start = 5;
    fixture.detectChanges();  // triggers ngOnInit and initial binding

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.textContent).toBe('5');  // initial count is displayed

    // Spy on the EventEmitter
    const emitSpy = vi.spyOn(fixture.componentInstance.countChanged, 'emit');

    // Simulate a button click
    button.click();
    fixture.detectChanges();  // apply change detection after click

    expect(fixture.componentInstance.count).toBe(6);
    expect(button.textContent).toBe('6');
    expect(emitSpy).toHaveBeenCalledWith(6);  // output event should emit new count
  });
});
```

In this test, we configured the testing module with the `CounterComponent` in imports (because it’s standalone). We then created the component via `TestBed.createComponent`. We set the `start` input property to 5 before calling `detectChanges()`, so that when the component initializes (`ngOnInit` runs), it sets `count` to 5. We then simulate a user clicking the button by calling `button.click()`. After the click, we run `fixture.detectChanges()` again to update the template with the new count. Finally, we assert that the count has incremented and that the `countChanged.emit` was called with the correct value. We used Vitest’s `vi.spyOn` to spy on the `EventEmitter.emit` method; alternatively, we could subscribe to the `countChanged` output and collect emitted values. Both approaches are valid. The above test demonstrates typical component testing patterns: setting up inputs, simulating user interaction, and checking outputs (both DOM and event outputs).

### Testing a Service with HttpClient

Now let's test a service that depends on Angular’s HttpClient. We’ll use Angular’s HTTP testing utilities to avoid making real HTTP calls. Assume a simple `DataService`:

```typescript
// data.service.ts
@Injectable({ providedIn: 'root' })
export class DataService {
  constructor(private http: HttpClient) {}
  getItems() {
    return this.http.get<string[]>('/api/items');
  }
}
```

To test this service, we want to verify that it makes an HTTP GET request to the correct URL and properly handles the response. We use `HttpClientTestingModule` or the newer provider functions to intercept HTTP calls. Here’s the test using `HttpTestingController`:

```typescript
import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { provideHttpClient, HttpClientTestingModule } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { DataService } from './data.service';

describe('DataService', () => {
  let service: DataService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // Option 1: use provide functions
      providers: [ 
        DataService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
      // Option 2: use HttpClientTestingModule
      // imports: [ HttpClientTestingModule ],
      // providers: [ DataService ],
    });
    service = TestBed.inject(DataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verify that no unmatched HTTP requests remain
    httpMock.verify();
  });

  it('should fetch items via GET request', () => {
    const mockItems = ['Alpha', 'Beta', 'Gamma'];

    // Call the service method, which should trigger an HTTP request
    service.getItems().subscribe(items => {
      // Assert the result when it arrives
      expect(items).toEqual(mockItems);
    });

    // Expect that a single GET request has been made to the correct URL
    const req = httpMock.expectOne('/api/items');
    expect(req.request.method).toBe('GET');

    // Provide a mock response to the request
    req.flush(mockItems);
    // After flushing, the subscribe above will receive data and the expectation in it will be evaluated
  });
});
```

In the setup, we configured the testing module with `DataService` and used `provideHttpClient()` and `provideHttpClientTesting()` to register HttpClient and the testing controller. This ensures that when `DataService` calls `http.get`, it goes through the test controller instead of an actual HTTP request. (We commented an alternative: using `imports: [HttpClientTestingModule]` which accomplishes the same in older style; the provider functions are the modern approach.) We retrieve the `HttpTestingController` to control and assert the HTTP interactions.

In the test, after calling `service.getItems()`, we use `httpMock.expectOne` to verify that a single request was made to `/api/items`. This also returns a mock request object. We assert the HTTP method was GET, then call `req.flush(mockItems)` to simulate a server responding with our `mockItems` data. This will resolve the observable returned by `getItems()`, and the subscriber’s expectation (`expect(items).toEqual(mockItems)`) will run and pass. We also included `httpMock.verify()` in an `afterEach` to ensure no unexpected HTTP calls were left pending after each test, which is a good practice to catch stray requests.

This service test shows how **fast** Vitest executes such tests. There is no browser involved; all of this runs in a Node environment with JSDOM. The pattern of using `HttpTestingController` is identical to Karma-based tests, illustrating that switching to Vitest doesn’t break these Angular testing patterns.

### Testing a Directive

Testing directives, especially attribute directives, often involves creating a host component in the test to apply the directive. With standalone directives, you can do this inline without a separate host component file. Let’s say we have a simple highlight directive:

```typescript
// highlight.directive.ts
import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true
})
export class HighlightDirective {
  constructor(private el: ElementRef) {
    this.el.nativeElement.style.backgroundColor = 'yellow';
  }
}
```

This directive simply sets the background color of the host element to yellow. To test it, we’ll create a dummy component in our spec that uses this directive in its template:

```typescript
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HighlightDirective } from './highlight.directive';

@Component({
  template: `<p appHighlight>Highlighted Text</p>`,
  standalone: true,
  imports: [HighlightDirective]  // apply the directive in this host component
})
class HostComponent {}

describe('HighlightDirective', () => {
  it('should highlight the host element with a yellow background', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent]  // use the host component which includes the directive
    }).createComponent(HostComponent);
    fixture.detectChanges();  // triggers directive logic

    const paragraph: HTMLParagraphElement = fixture.nativeElement.querySelector('p');
    expect(paragraph.style.backgroundColor).toBe('yellow');
  });
});
```

In this test, we dynamically declared a `HostComponent` right in the spec. This component’s template contains a `<p>` with the `appHighlight` attribute, which will cause `HighlightDirective` to be instantiated on that element. We include `HighlightDirective` in the host component’s imports (since HostComponent is standalone too). In the test, we configure the TestBed to use `HostComponent` as the imported component (which in turn brings in the directive). When we create the component and call `detectChanges()`, the directive’s constructor runs and sets the style. We then simply verify that the paragraph’s background color style is yellow, confirming the directive worked.

This approach demonstrates a **pattern for directive testing**: create a lightweight inline host component in the spec and apply the directive. With standalone APIs, this is very straightforward, as we don’t need to declare anything in an NgModule. We can define and use the host component immediately. The test itself is simple – it checks a side effect of the directive on the DOM. Because JSDOM doesn’t actually render colors, we rely on reading the `style` property, which in JSDOM reflects what we set (in this case, `'yellow'`). This is sufficient for our test assertion.

### Additional Example: Pipe Testing (Optional)

*For completeness, if you were testing a pipe (standalone pipe), the approach is similar: you can either use the pipe in a host template or call it via pipe’s transform method in a test. Since the question didn’t explicitly ask, we won’t detail a pipe example, but note that standalone pipes can be tested by including them in a TestBed `imports` or by directly instantiating and calling `pipe.transform()`.*

These examples illustrate testing each kind of unit in Angular (component, service, directive) using Vitest. You can see that aside from the initial configuration differences (Vitest vs Karma), the test code is nearly identical to traditional Angular tests. That is by design – Angular’s testing framework (TestBed, etc.) is decoupled from the test runner, so you get to keep the productivity of those APIs with the speed of Vitest’s runner.

## Migrating from Karma/Jasmine to Vitest in Angular 19

Migrating an existing Angular project (especially an older one using Karma + Jasmine) to Vitest involves a series of steps. Here’s a **migration checklist** covering configuration changes, dependency updates, and common pitfalls:

* **Remove Karma Dependencies:** Start by removing the packages related to Karma and Jasmine’s browser runner. This typically includes `karma`, `karma-cli`, `karma-chrome-launcher`, `karma-jasmine`, `karma-coverage`, and `karma-jasmine-html-reporter`. You can do this with npm or yarn (e.g. `npm uninstall karma karma-chrome-launcher karma-jasmine ...`). You can keep `jasmine-core` and `@types/jasmine` for now, especially if your tests use Jasmine-specific APIs – Vitest does not require Jasmine, but the Analog plugin suggests keeping them for compatibility. Angular’s `fakeAsync` and other utilities can integrate with either Jasmine or Vitest’s environment, and leaving Jasmine types in place can minimize code changes initially.

* **Install Vitest and Tools:** Add the Vitest-related packages as devDependencies. At minimum, install `vitest` and `vite`. For Angular, also install the `@analogjs/vite-plugin-angular` and `@analogjs/vitest-angular` packages (these ensure Angular’s compiler and zone are handled). Don’t forget to add a DOM simulator like `jsdom` if you plan to use the default JSDOM environment. If you want coverage or the UI runner: `@vitest/coverage-v8` and `@vitest/ui`. For example:

  ```bash
  npm install --save-dev vitest vite jsdom @analogjs/vite-plugin-angular @analogjs/vitest-angular
  ```

  If you use Nx, installing `@nx/vite` (which Analog’s plugin will bring in) is also required to ensure the Angular project works with Vite. The versions should match your Angular version compatibility (for Angular 19, use the latest AnalogJS plugin versions).

* **Add Vite Config for Vitest:** Create a `vite.config.ts` in the project root if not present. As shown earlier, configure the `test` options within it: set `globals: true`, `environment: 'jsdom'` (or `'happy-dom'`), `setupFiles: ['src/test-setup.ts']`, and include patterns for spec files. The Angular Vite plugin (`angular()`) should be added to `plugins`, so that Vite knows how to handle Angular’s components and templates. This config will serve both your dev server and the test runner (Vitest will merge its own defaults with this config).

* **Create the Test Setup File:** If your project was using the Angular CLI’s default, you likely have a `src/test.ts` which did `TestBed.initTestEnvironment(...)`. Replace this with a new `src/test-setup.ts` (you can literally rename test.ts to test-setup.ts and adjust it). Ensure it calls `getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting())` exactly once. If you use zone.js (most apps do), import the zone setup script (e.g. `import '@angular/core/testing'; import 'zone.js/testing';` in older Angular, or in our case `@analogjs/vitest-angular/setup-zone` which handles zone and fakeAsync patches). The Analog example above is a good template. The key is that this file must be specified in the Vitest config so it runs **before any tests**, establishing the Angular testing environment.

* **Update angular.json:** Change the `test` target for your application to use Vitest’s builder. If you used the Analog schematic, this is done for you, but manually: open `angular.json` (or `project.json` for that project in Angular 15+ workspace config) and find the test configuration. It might look like this originally (for Karma):

  ```json
  "test": {
    "builder": "@angular-devkit/build-angular:karma",
    "options": {
      "main": "src/test.ts",
      "polyfills": "src/polyfills.ts",
      "karmaConfig": "src/karma.conf.js",
      ...
    }
  }
  ```

  This should be replaced (or a new target added) as:

  ```json
  "test": {
    "builder": "@analogjs/vitest-angular:test",
    "options": {
      // (no additional options needed for Vitest)
    }
  }
  ```

  . With this, running `ng test` will invoke Vitest. Note that the old Karma-specific options (`main`, `karmaConfig`, etc.) are not used by the Vitest builder and can be removed. The Vitest builder knows to look for `vite.config.ts` and will utilize that. If you prefer not to use the Angular CLI to run tests, you can skip this and just use Vitest via CLI or npm script, but integrating it here makes for a seamless replacement.

* **Update NPM Scripts:** Ensure your `package.json` has a convenient script to run tests. The Angular CLI’s default is `"test": "ng test"`. You might keep that (it will now run Vitest via the builder), or you can point it directly to Vitest. For example, you can change it to `"test": "vitest"` to run Vitest in watch mode, and perhaps add `"test:ci": "vitest run"` to run tests once in CI. The Angularspace guide suggests using `npm run test` as usual after migration.

* **Adjust Test Imports if Necessary:** One advantage of Vitest is that you usually **don’t need to import `expect` or other globals**; they’re automatically in scope when `globals: true` is set. So you can remove any `import { expect } from '@angular/core/testing';` (Angular’s testing package re-exported Jasmine’s expect) or similar lines – these were uncommon, but just in case. Also, if your tests were using `import { describe, it } from 'vitest'` (not typical in Angular, but possible), you might either remove those (rely on globals) or keep them – but do not mix importing `it` from Vitest and using Angular’s `fakeAsync`. It’s safer to use the global `it`/`describe` provided by Vitest’s environment, which is what the Angular testing utilities expect (they monkey-patch those for fakeAsync). In summary, **most tests won’t require changes** to the imports at all, since the functions have the same names and similar behavior.

* **Ensure Zone.js is Included:** In Karma, `zone.js` and `zone.js/testing` were typically imported automatically by the CLI (via `test.ts`). In the Vitest setup, make sure you still import `zone.js` in your test environment if your app is not zoneless. The Analog setup script we imported (`setup-zone`) actually handles importing `zone.js/testing` for you. If doing manually, you might need `import 'zone.js/dist/zone'` and `import 'zone.js/dist/zone-testing'` in your setup file (for Angular 14-15 style). Missing this will cause Angular’s async tests to fail or hang. So double-check that your `test-setup.ts` effectively brings in zone-testing.

* **Run and Fix Tests:** Now run `npm test`. If everything is set up, Vitest should execute your tests. You might see some new failures or warnings:

  * **Unhandled Promise rejections**: Vitest might show errors if any of your tests had unhandled promises (Jasmine/Karma sometimes swallowed these). Fix any async test that doesn’t properly handle promises (either `await` them or use `expect.assertions` in Vitest to mark expected promises).
  * **Deprecation warnings**: Angular might warn if you use the deprecated `async()` utility (recommend switching to `waitForAsync` or `fakeAsync`).
  * **Snapshot failures**: If you converted some tests to snapshot tests, on first run Vitest will create snapshots. On subsequent runs, if they differ, you need to verify if changes were intentional and update snapshots with `vitest -u` if so.

* **Common Pitfalls & Gotchas:**

  * **Global leaks or test isolation issues**: Because Vitest runs tests in parallel, be mindful of any state that is truly global in your tests (e.g., modifying global `window` or static variables). These can lead to flaky tests if two test files run concurrently. Angular’s TestBed is module-scoped and isolated per file, so that’s usually fine. But if needed, you can run Vitest with `--threads false` to disable parallelism, or mark specific tests as `serial` (not commonly needed for Angular unit tests).
  * **Timing issues**: Vitest by default doesn’t fake timers globally (unlike Jest which might). If you had tests that relied on Jasmine’s clock or `setTimeout` real timing, they should behave the same. But if you use Vitest’s `vi.useFakeTimers()`, be careful as mentioned earlier, since Angular’s zone/fakeAsync might conflict. Prefer Angular’s own fakeAsync for those tests.
  * **Differences in environment**: Remember, under JSDOM, some browser APIs are stubbed. For example, `window.alert` or `window.scrollTo` might be no-ops (or not implemented) and could cause tests to fail if your code calls them. You may need to provide mocks for such globals in tests (e.g., `vi.stubGlobal('scrollTo', () => {})`). In Karma (real browser), those existed (even if just a stub). This is a minor adjustment if it comes up.
  * **CSS and HTML parsing**: JSDOM can parse and manipulate HTML, but it doesn’t apply CSS. If your tests looked at computed styles or relied on layout (rare in unit tests), they might not work. You can switch to the experimental browser mode of Vitest if truly needed, or better, abstract those parts in the component so they can be unit tested without real layout.
  * **Pollyfills**: Ensure that any required polyfills for your code are either included in your app or added in tests. Angular 19 with modern browsers target might not need many, but if you target older browsers, your Karma setup might have included polyfills that in Node are not present. Vitest will use Node’s environment, so things like ES2015+ features are available by default (Node 18+ covers a lot), but if you need specific browser APIs polyfilled (e.g., `matchMedia`), include a polyfill or a mock for them in tests.

* **Iterative Migration (if needed)**: You don’t have to remove Karma on day one. You could temporarily maintain both test runners (Karma and Vitest) to compare results. For example, keep `ng test` for Karma and add a new npm script for Vitest. Ensure your tests pass in Vitest, then you can fully remove Karma. Given Angular’s plans to deprecate Karma, migrating sooner rather than later is beneficial.

By following these steps, you replace the old Karma/Jasmine setup with Vitest in an Angular 19 project. Developers will immediately notice the test speed improvements. Vitest’s watcher will rerun tests in seconds (often less) compared to Karma’s rebuilding and browser refresh which could take much longer for large projects. Also, Vitest’s console output is clean and informative, and you can use the interactive UI (`vitest --ui`) to see tests and coverage in a browser if you like (this is separate from Karma; it’s a dev tool for viewing results, not for running tests in the browser).

**Summary:** Migrating to Vitest involves updating configs (to use Vite), adding a setup for Angular’s TestBed, and adapting any test code that was tied to the old runner. With Angular 19’s standalone components and Vite-powered build, Vitest fits naturally into the toolchain, providing a modern, efficient testing experience for Angular applications. The result is faster feedback loops, a simpler configuration (no more complex Karma webpack configs), and a testing approach that aligns with the future direction of Angular’s tooling.
