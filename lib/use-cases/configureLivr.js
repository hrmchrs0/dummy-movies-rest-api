import LIVR from 'livr';
import extraRules from 'livr-extra-rules';

LIVR.Validator.defaultAutoTrim(true);
LIVR.Validator.registerDefaultRules(extraRules);
