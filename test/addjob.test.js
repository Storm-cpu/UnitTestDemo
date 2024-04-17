import test from 'ava';
import sinon from 'sinon';
import Job from '../models/Job.js';
import { createJob } from '../controllers/jobsController.js';
import { StatusCodes } from 'http-status-codes';
import { MESSAGES } from '../constants/index.js';

test.beforeEach(t => {
    t.context.sandbox = sinon.createSandbox();

    // Tạo mock cho Job.create
    t.context.sandbox.stub(Job, 'create');
});

test.afterEach.always(t => t.context.sandbox.restore());

test.serial('createJob - TC1: should create new job and return job data when all data is valid', async t => {
    const req = {
        body: {
            position: 'Test Position',
            company: 'Test Company'
        },
        user: {
            userId: '123'
        }
    };
    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub()
    };

    const job = {
        position: req.body.position,
        company: req.body.company
    };

    Job.create.resolves(job);

    await createJob(req, res);

    t.true(res.status.calledWith(StatusCodes.CREATED));
    t.true(res.json.calledWith({ job }));
});

test.serial('createJob - TC2: should throw BadRequestError when position is missing', async t => {
    const req = {
        body: {
            company: 'Test Company'
        },
        user: {
            userId: '123'
        }
    };
    const res = {};

    const error = await t.throwsAsync(createJob(req, res));
    t.is(error.message, MESSAGES.FormNotValidate);
});

test.serial('createJob - TC3: should throw BadRequestError when company is missing', async t => {
    const req = {
        body: {
            position: 'Test Position'
        },
        user: {
            userId: '123'
        }
    };
    const res = {};

    const error = await t.throwsAsync(createJob(req, res));
    t.is(error.message, MESSAGES.FormNotValidate);
});
