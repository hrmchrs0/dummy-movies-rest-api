import * as uuid from 'uuid';
import cors from 'cors';
import bodyParser from 'body-parser';
import multer from 'multer';
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
                cb(new Error('mimetype_unacceptable'));
            }
        }
    })
};
