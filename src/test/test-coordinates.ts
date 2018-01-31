import { J2000 } from '../coordinates/j2000'
import { Epoch } from '../epoch'
import { Vector } from '../vector'
import { RAD2DEG } from '../constants'
import * as assert from 'assert'

const TEST_J2K = new J2000(
    new Epoch(0), new Vector([8228, 389, 6888]), new Vector([-0.7, 6.6, -0.6])
)

describe('J2000', function () {
    describe('#.toKeplerian()', function () {
        it('should convert to Keplerian elements', function () {
            let { epoch, a, e, i, o, w, v } = TEST_J2K.toKeplerian()
            assert.equal(epoch.epoch, TEST_J2K.epoch.epoch)
            assert.equal(a, 13360.642770119148)
            assert.equal(e, 0.22049791840816513)
            assert.equal(i * RAD2DEG, 39.93754927254844)
            assert.equal(o * RAD2DEG, 269.85555147445865)
            assert.equal(w * RAD2DEG, 125.72438198841463)
            assert.equal(v * RAD2DEG, 326.46253415447933)
        })
    })
})