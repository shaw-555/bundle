import { handleError } from '.errors';
import { main } from './cli-main';

main({
  skipNodeModuleBundle: true,
}).catch(handleError);
