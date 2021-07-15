import * as uuid from 'uuid';
import cors from 'cors';
import bodyParser from 'body-parser';
import multer from 'multer';
import { X } from '../../../packages.js';
import clsNamespace from '../../clsNamespace.js';
import logger from '../logger.js';

const MAX_FILE_KILOBYTE_SIZE = 100;
const MAX_FILE_BYTE_SIZE = 1024 * MAX_FILE_KILOBYTE_SIZE;

export default {
    cors : cors({ origin: '*' }),
    json : bodyParser.json({
        limit  : 1024 * 1024,
        verify : (req, res, buf) => {
            try {
                JSON.parse(buf);
            } catch (e) {
                res.send({
                    status : 0,
                    error  : {
                        code    : 'BROKEN_JSON',
                        message : 'Please, verify your json'
                    }
                });
                throw new Error('BROKEN_JSON');
            }
        }
    }),
    clsMiddleware : (req, res, next) => {
        clsNamespace.bind(req);
        clsNamespace.bind(res);

        const traceID = uuid.v4();

        clsNamespace.run(() => {
            clsNamespace.set('traceID', traceID);

            logger.info({
                pathname : req._parsedUrl.pathname,
                method   : req.method,
                body     : req.body,
                query    : req.query
            });

            next();
        });
    },
    multer : multer({
        limits : {
            parts    : 1,
            fileSize : MAX_FILE_BYTE_SIZE
        },
        fileFilter : (req, file, cb) => {
            if (file.mimetype === 'text/plain') {
                cb(null, true);
            } else {
                cb(new X({
                    code   : 'FORMAT_ERROR',
                    fields : { movies: 'NOT_ALLOWED_MIMETYPE' }
                }));
            }
        }
    }),
    // eslint-disable-next-line no-unused-vars
    error : (err, req, res, next) => {
        if (err instanceof X) {
            res.send({
                status : 0,
                error  : err.toHash()
            });
        } else {
            logger(
                'fatal',
                {
                    'REQUEST_URL'    : req.url,
                    'REQUEST_PARAMS' : req.params,
                    'REQUEST_BODY'   : req.body,
                    'ERROR_STACK'    : err.stack
                }
            );

            res.send({
                status : 0,
                error  : {
                    code    : 'SERVER_ERROR',
                    message : 'Please, contact your system administartor!'
                }
            });
        }
    }
};
