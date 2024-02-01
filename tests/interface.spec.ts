import * as mute8_react from "../packages/mute8-react/mute8-react"
import * as mute8 from "../packages/mute8/mute8"

test('Test exported JS mehods', () => {
    // common 
    expect(mute8_react.newStore).toBeTruthy()
    expect(mute8.newStore).toBeTruthy()

    // only mute8
    expect(mute8.newStoreProxy).toBeTruthy()
});

// Test exported types/interfaces

import { newStore as newStore1 } from "../packages/mute8/mute8"
import { newStore as newStore2 } from "../packages/mute8-react/mute8-react"

import { Store as Store1 } from "../packages/mute8/mute8"
import { Store as Store2 } from "../packages/mute8-react/mute8-react"

import { SubFn as SubFn1 } from "../packages/mute8/mute8"
import { SubFn as SubFn2 } from "../packages/mute8-react/mute8-react"

import { Sub as Sub1 } from "../packages/mute8/mute8"
import { Sub as Sub2 } from "../packages/mute8-react/mute8-react"

import { VoidFn as VoidFn1 } from "../packages/mute8/mute8"
import { VoidFn as VoidFn2 } from "../packages/mute8-react/mute8-react"

import { AsyncFn as AsyncFn1 } from "../packages/mute8/mute8"
import { AsyncFn as AsyncFn2 } from "../packages/mute8-react/mute8-react"

type ExportAssert<T> = T & any

test('Test exported TS interfaces/exports', () => {
    null as ExportAssert<typeof newStore1>;
    null as ExportAssert<typeof newStore2>;

    null as ExportAssert<Store1<any, any, any>>;
    null as ExportAssert<Store2<any, any, any>>;

    null as ExportAssert<SubFn1<any>>;
    null as ExportAssert<SubFn2<any>>;

    null as ExportAssert<Sub1>;
    null as ExportAssert<Sub2>;

    null as ExportAssert<VoidFn1>;
    null as ExportAssert<VoidFn2>;

    null as ExportAssert<VoidFn1>;
    null as ExportAssert<VoidFn2>;

    null as ExportAssert<AsyncFn1>;
    null as ExportAssert<AsyncFn2>;
});

