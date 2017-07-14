/**
 * Copyright 2016, IOOF Holdings Limited.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { select, put, getContext } from 'redux-saga/effects'
import configureStore from 'redux-mock-store'
import { asGlobal } from 'redux-subspace'
import subspaced from '../../src/sagas/subspaced'

describe('subspaced Tests', () => {
    
    it('should get substate for saga', () => {

        let state = {
            subState: {
                value: "expected"
            },
            value: "wrong"
        }

        let mockStore = configureStore()(state)

        function* saga() {
            const value = yield select((state) => state.value)
            yield put({ type: "SET_VALUE", value })
        }

        const subspacedSaga = subspaced(saga, state => state.subState)

        const iterator = subspacedSaga()

        expect(iterator.next().value).to.deep.equal(getContext('store'))
        iterator.next(mockStore)
        expect(iterator.next({ type: "TEST" }).done).to.be.true

        expect(mockStore.getActions()).to.deep.equal([{ type: "SET_VALUE", value: "expected" }])
    })
    
    it('should namespace actions for saga', () => {
        
        let state = {
            subState: {
                value: "expected"
            },
            value: "wrong"
        }

        let mockStore = configureStore()(state)

        function* saga() {
            const value = yield select((state) => state.value)
            yield put({ type: "SET_VALUE", value })
        }

        const subspacedSaga = subspaced(saga, state => state.subState, "test")

        const iterator = subspacedSaga()

        expect(iterator.next().value).to.deep.equal(getContext('store'))
        iterator.next(mockStore)
        expect(iterator.next({ type: "test/TEST" }).done).to.be.true

        expect(mockStore.getActions()).to.deep.equal([{ type: "test/SET_VALUE", value: "expected" }])
    })
    
    it('should accept global actions for saga', () => {
        
        let state = {
            subState: {
                value: "expected"
            },
            value: "wrong"
        }

        let mockStore = configureStore()(state)

        function* saga() {
            const value = yield select((state) => state.value)
            yield put({ type: "SET_VALUE", value })
        }

        const subspacedSaga = subspaced(saga, state => state.subState, "test")

        const iterator = subspacedSaga()

        expect(iterator.next().value).to.deep.equal(getContext('store'))
        iterator.next(mockStore)
        expect(iterator.next(asGlobal({ type: "TEST" })).done).to.be.true

        expect(mockStore.getActions()).to.deep.equal([{ type: "test/SET_VALUE", value: "expected" }])
    })
    
    it('should not namespace global actions for saga', () => {
        
        let state = {
            subState: {
                value: "expected"
            },
            value: "wrong"
        }

        let mockStore = configureStore()(state)

        function* saga() {
            const value = yield select((state) => state.value)
            yield put(asGlobal({ type: "SET_VALUE", value }))
        }

        const subspacedSaga = subspaced(saga, state => state.subState, "test")

        const iterator = subspacedSaga()

        expect(iterator.next().value).to.deep.equal(getContext('store'))
        iterator.next(mockStore)
        expect(iterator.next({ type: "test/TEST" }).done).to.be.true

        expect(mockStore.getActions()).to.deep.equal([asGlobal({ type: "SET_VALUE", value: "expected" })])
    })
})