import test from 'ava';
import sinon from 'sinon';
import { StatusCodes } from 'http-status-codes';
import User from '../models/User.js'; // Thay thế bằng model User thực tế của bạn
import { login } from '../controllers/authController.js';
import { MESSAGES } from '../constants/index.js';

test.afterEach.always(t => {
    if (User.findOne.restore) {
        User.findOne.restore();
    }
});

test.serial('login - TC1: should login successfully when email and password are correct', async t => {
    const req = {
        body: {
            email: 'lamchitinh@gmail.com',
            password: 'Lamchitinh.2'
        }
    };
    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
        cookie: sinon.stub()
    };

    const user = {
        email: req.body.email,
        comparePassword: sinon.stub().resolves(true),
        createJWT: () => 'token'
    };

    const findOneStub = sinon.stub(User, 'findOne');
    findOneStub.returns({
        select: sinon.stub().returns(Promise.resolve(user))
    });

    await login(req, res);

    t.true(res.status.calledWith(StatusCodes.OK));
});

test.serial('login - TC2: should throw MESSAGES.IsCredential when password is incorrect', async t => {
    const req = {
        body: {
            email: 'lamchitinh@gmail.com',
            password: 'Lamchitinh.3'
        }
    };
    const res = {};

    const user = {
        email: req.body.email,
        comparePassword: sinon.stub().resolves(false),
        createJWT: () => 'token'
    };

    const findOneStub = sinon.stub(User, 'findOne');
    findOneStub.returns({
        select: sinon.stub().resolves(user)
    });

    const error = await t.throwsAsync(login(req, res));
    t.is(error.message, MESSAGES.IsCredential);
});

test.serial('login - TC3: should throw MESSAGES.IsCredential when email does not exist', async t => {
    const req = {
        body: {
            email: 'abcxyz@gmail.com',
            password: 'Lamchitinh.3'
        }
    };
    const res = {};

    const findOneStub = sinon.stub(User, 'findOne');
    findOneStub.returns({
        select: sinon.stub().resolves(null)
    });

    const error = await t.throwsAsync(login(req, res));
    t.is(error.message, MESSAGES.IsCredential);
});

