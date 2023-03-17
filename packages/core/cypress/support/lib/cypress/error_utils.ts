import _ from 'lodash';
import $errorMessages from './error_messages';
import $utils from './utils';

const mergeErrProps = (origErr: Error, ...newProps): Error => {
  return _.extend(origErr, ...newProps);
};
const makeErrFromErr = (err, options: any = {}) => {
  if (_.isString(err)) {
    err = cypressErr({ message: err });
  }

  let { onFail, errProps } = options;

  // assume onFail is a command if
  // onFail is present and isn't a function
  if (onFail && !_.isFunction(onFail)) {
    const log = onFail;

    // redefine onFail and automatically
    // hook this into our command
    onFail = (err) => {
      return log.error(err);
    };
  }

  if (onFail) {
    err.onFail = onFail;
  }

  if (errProps) {
    _.extend(err, errProps);
  }

  return err;
};

const throwErrByPath = (errPath, options: any = {}): never => {
  const err = errByPath(errPath, options.args);

  if (options.stack) {
    err.stack = err.message;
  } else if (Error.captureStackTrace) {
    // gets rid of internal stack lines that just build the error
    Error.captureStackTrace(err, throwErrByPath);
  }

  throw makeErrFromErr(err, options);
};

export class InternalCypressError extends Error {
  onFail?: Function;
  isRecovered?: boolean;

  constructor(message) {
    super(message);

    this.name = 'InternalCypressError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InternalCypressError);
    }
  }
}

export class CypressError extends Error {
  docsUrl?: string;
  retry?: boolean;
  userInvocationStack?: any;
  onFail?: Function;
  isRecovered?: boolean;

  constructor(message) {
    super(message);

    this.name = 'CypressError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CypressError);
    }
  }

  setUserInvocationStack(stack) {
    this.userInvocationStack = stack;

    return this;
  }
}

const internalErr = (err): InternalCypressError => {
  const newErr = new InternalCypressError(err.message);

  return mergeErrProps(newErr, err);
};

const cypressErr = (err): CypressError => {
  const newErr = new CypressError(err.message);

  return mergeErrProps(newErr, err) as CypressError;
};

const replaceErrMsgTokens = (errMessage, args) => {
  if (!errMessage) {
    return errMessage;
  }

  const replace = (str, argValue, argKey) => {
    return str.replace(new RegExp(`\{\{${argKey}\}\}`, 'g'), argValue);
  };

  const getMsg = function(args = {}) {
    return _.reduce(
      args,
      (message, argValue, argKey) => {
        if (_.isArray(message)) {
          return _.map(message, (str) => replace(str, argValue, argKey));
        }

        return replace(message, argValue, argKey);
      },
      errMessage,
    );
  };

  // replace more than 2 newlines with exactly 2 newlines
  return $utils.normalizeNewLines(getMsg(args), 2);
};

// recursively try for a default docsUrl
const docsUrlByParents = (msgPath) => {
  msgPath = msgPath
    .split('.')
    .slice(0, -1)
    .join('.');

  if (!msgPath) {
    return; // reached root
  }

  const obj = _.get($errorMessages, msgPath);

  if (obj.hasOwnProperty('docsUrl')) {
    return obj.docsUrl;
  }

  return docsUrlByParents(msgPath);
};

const errByPath = (msgPath, args?) => {
  const msgValue = _.get($errorMessages, msgPath);

  if (!msgValue) {
    return internalErr({ message: `Error message path '${msgPath}' does not exist` });
  }

  let msgObj = msgValue;

  if (_.isFunction(msgValue)) {
    msgObj = msgValue(args);
  }

  if (_.isString(msgObj)) {
    msgObj = {
      message: msgObj,
    };
  }

  const docsUrl = (msgObj.hasOwnProperty('docsUrl') && msgObj.docsUrl) || docsUrlByParents(msgPath);

  return cypressErr({
    message: replaceErrMsgTokens(msgObj.message, args),
    docsUrl: docsUrl ? replaceErrMsgTokens(docsUrl, args) : undefined,
  });
};

const throwErr = (err, options: any = {}): never => {
  throw makeErrFromErr(err, options);
};

export default {
  throwErrByPath,
  throwErr,
};
