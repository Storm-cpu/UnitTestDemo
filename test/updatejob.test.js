import test from 'ava';
import sinon from 'sinon';
import { BadRequestError, NotFoundError } from '../errors/index.js';
import Job from '../models/Job.js';
import { updateJob } from '../controllers/jobsController.js';
import { StatusCodes } from 'http-status-codes';
import { MESSAGES } from '../constants/index.js';

test.beforeEach(t => {
    t.context.sandbox = sinon.createSandbox();

    // Tạo mock cho Job.findOne và Job.findOneAndUpdate
    t.context.sandbox.stub(Job, 'findOne');
    t.context.sandbox.stub(Job, 'findOneAndUpdate');
});

test.afterEach.always(t => t.context.sandbox.restore());

test.serial('updateJob - TC1: should update job and return job data when all data is valid', async t => {
    const req = {
        params: {
            id: '123'
        },
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
        _id: req.params.id,
        position: req.body.position,
        company: req.body.company,
        createdBy: req.user.userId
    };

    Job.findOne.resolves(job);
    Job.findOneAndUpdate.resolves(job);

    await updateJob(req, res);

    t.true(res.status.calledWith(StatusCodes.OK));
    t.true(res.json.calledWith({ updatedJob: job }));
});

test.serial('updateJob - TC2: should throw BadRequestError when position is missing', async t => {
    const req = {
        params: {
            id: '123'
        },
        body: {
            company: 'Test Company'
        },
        user: {
            userId: '123'
        }
    };
    const res = {};

    const error = await t.throwsAsync(updateJob(req, res));
    t.is(error.message, MESSAGES.FormNotValidate);
});

test.serial('updateJob - TC3: should throw BadRequestError when company is missing', async t => {
    const req = {
        params: {
            id: '123'
        },
        body: {
            position: 'Test Position'
        },
        user: {
            userId: '123'
        }
    };
    const res = {};

    const error = await t.throwsAsync(updateJob(req, res));
    t.is(error.message, MESSAGES.FormNotValidate);
});
