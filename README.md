
A compact example of a utility that wraps a Svelte `$state` store, auto‑generates getters/setters for every field in `AppFrontEndState`, and offers a few convenience helpers (`incrementCounter`, `current`, `snapshot`).

The example is a made up front-end state. You would use your own real shizz obviously. 

## File layout
```
src/
 └─ lib/
     ├─ defaultFrontEndState.ts   # default values for the state
     ├─ AppFrontEndState.ts       # type definition (see below)
     └─ FrontEndStateService.ts   # implementation
```

## `AppFrontEndState`
```typescript
export type AppFrontEndState = {
    counter: number;
    ramenMode: boolean;
    preferredFileStem: string;
};
```

## `FrontEndStateService.ts`
```typescript
import { defaultFrontEndState } from './defaultFrontEndState';
import type { AppFrontEndState } from './AppFrontEndState';

export class FrontEndStateService {
    private readonly _state: AppFrontEndState = $state(defaultFrontEndState);

    constructor() {
        this.createAccessors();
    }

    /** Auto‑generate a getter/setter for each key */
    private createAccessors() {
        const keys = Object.keys(this._state) as (keyof AppFrontEndState)[];
        for (const key of keys) {
            Object.defineProperty(this, key, {
                get: () => this._state[key],
                set: (v: any) => { this._state[key] = v; },
                enumerable: true,
                configurable: true,
            });
        }
    }

    /** Example helper – increments the numeric counter */
    incrementCounter() {
        this._state.counter++;
    }

    /** Live reference to the underlying store */
    get current(): AppFrontEndState {
        return this._state;
    }

    /** Immutable snapshot (useful for persisting or debugging) */
    get snapshot(): AppFrontEndState {
        return $state.snapshot(this._state) as AppFrontEndState;
    }
}

/* Export a ready‑to‑use singleton */
export const frontEndState =
    new FrontEndStateService() as FrontEndStateService & AppFrontEndState;
```

## Quick usage
```typescript
import { frontEndState } from '$lib/FrontEndStateService';

// Read / write like normal properties
frontEndState.counter = 5;
console.log(frontEndState.ramenMode);

// Use the helper method
frontEndState.incrementCounter();

// Obtain an immutable copy
const saved = frontEndState.snapshot;
```

Any component that accesses `frontEndState.<field>` will reactively re‑render when that field changes because the getters/setters operate on a Svelte `$state` store.

## Extending

* **Add a new field** – update `AppFrontEndState` and `defaultFrontEndState`; the accessor loop picks it up automatically.
* **Add custom helpers** – define extra methods on `FrontEndStateService` that manipulate `_state` as needed.

## License

MIT © 2025 Proton (Lumo). Feel free to adapt and reuse.
