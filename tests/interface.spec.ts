import * as mute8_react from "../packages/mute8-react/mute8-react"
import * as mute8 from "../packages/mute8/mute8"

test('Test exported JS mehods', () => {
    // common 
    expect(mute8_react.newState).toBeTruthy()
    expect(mute8.newState).toBeTruthy()

    // only mute8
    expect(mute8.newStateProxy).toBeTruthy()
});

// Test exported types/interfaces

import { newState as newState1 } from "../packages/mute8/mute8"
import { newState as newState2 } from "../packages/mute8-react/mute8-react"

import { State as State1 } from "../packages/mute8/mute8"
import { State as State2 } from "../packages/mute8-react/mute8-react"

import { SubFn as SubFn1 } from "../packages/mute8/mute8"
import { SubFn as SubFn2 } from "../packages/mute8-react/mute8-react"

import { Sub as Sub1 } from "../packages/mute8/mute8"
import { Sub as Sub2 } from "../packages/mute8-react/mute8-react"

import { VoidFn as VoidFn1 } from "../packages/mute8/mute8"
import { VoidFn as VoidFn2 } from "../packages/mute8-react/mute8-react"

type ExportAssert<T> = T & any

test('Test exported TS interfaces/exports', () => {
    null as ExportAssert<typeof newState1>;
    null as ExportAssert<typeof newState2>;

    null as ExportAssert<State1<any, any>>;
    null as ExportAssert<State2<any, any>>;

    null as ExportAssert<SubFn1<any>>;
    null as ExportAssert<SubFn2<any>>;

    null as ExportAssert<Sub1>;
    null as ExportAssert<Sub2>;

    null as ExportAssert<VoidFn1>;
    null as ExportAssert<VoidFn2>;
});

