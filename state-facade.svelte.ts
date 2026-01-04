// Even safer solution, with read/write access and generated accessors! 
// This example is for managing the Front End State of a Tauri App


import {defaultTauriState} from "$lib/statics/defaults.svelte"; // not defined in this example
import type {TauriIPC} from "../../routes/workspace/types"; // not defined in this example

class TauriStateService {
    private _state: TauriIPC;

    constructor() {
        this._state = $state(defaultTauriState);
        this.createAccessors();
    }

    private createAccessors() {
        const keys = Object.keys(this._state) as (keyof TauriIPC)[];

        for (const key of keys) {
            this.defineAccessor(key);
        }
    }

    private defineAccessor<K extends keyof TauriIPC>(key: K) {
        Object.defineProperty(this, key, {
            get: () => this._state[key],
            set: (value: TauriIPC[K]) => {
                this._state[key] = value;
            },
            enumerable: true,
            configurable: true
        });
    }

    get current(): TauriIPC {
        return this._state;
    }

    get snapshot(): TauriIPC {
        return $state.snapshot(this._state) as TauriIPC;
    }

    update(v: TauriIPC) {
        this._state = v;
    }
}

// Add type assertion to make TypeScript happy
export const TauriIPCService = new TauriStateService() as TauriStateService & TauriIPC;
