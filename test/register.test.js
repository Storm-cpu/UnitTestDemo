import test from 'ava';
import sinon from 'sinon';
import { StatusCodes } from 'http-status-codes';
import User from '../models/User.js'; // Thay thế bằng model User thực tế của bạn
import { register } from '../controllers/authController.js';
import { MESSAGES } from '../constants/index.js';

test.afterEach.always(t => {
    if (User.findOne.restore) {
        User.findOne.restore();
    }
    if (User.create.restore) {
        User.create.restore();
    }
});

test.serial('register - TC1: should create new user and redirect to home when all data is valid', async t => {
    const req = {
        body: {
            name: 'Tinh',
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
        name: req.body.name,
        email: req.body.email,
        createJWT: () => 'token'
    };

    const findOneStub = sinon.stub(User, 'findOne');
    findOneStub.resolves(false);

    const createStub = sinon.stub(User, 'create');

    createStub.resolves(user);

    await register(req, res);

    t.true(res.status.calledWith(StatusCodes.CREATED));

    findOneStub.restore();
    createStub.restore();
});


test.serial('register - TC2: should throw MESSAGES.EmailIsExit when email already exists', async t => {
    const req = {
        body: {
            name: 'Tinh',
            email: 'chitinh@gmail.com',
            password: 'Lamchitinh.2'
        }
    };
    const res = {};

    const findOneStub = sinon.stub(User, 'findOne');
    findOneStub.resolves(true);

    const error = await t.throwsAsync(register(req, res));
    t.is(error.message, MESSAGES.EmailIsExit);
});


test.serial('register - TC3: should throw MESSAGES.FormNotValidate when password is missing', async t => {
    const req = {
        body: {
            name: 'Tinh',
            email: 'lamchitinh@gmail.com',
            password: ''
        }
    };
    const res = {};

    const error = await t.throwsAsync(register(req, res));
    t.is(error.message, MESSAGES.FormNotValidate);
});


