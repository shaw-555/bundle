import { Plugin } from 'esbuild';
import { tsconfigPathsToRegExp, match } from 'bundle-require';

const NON_NODE_MODULE_RE = /^[A-Z]:[\\\/]|^\.{0,2}[\/]|^\.{1,2}$/;

export const externalPlugin = ({
  external,
  noExternal,
  skipNodeModulesBundle,
  tsconfigResolvePaths
}: {
  external?: (string | RegExp)[]
  noExternal?: (string | RegExp)[]
  skipNodeModulesBundle?: boolean
  tsconfigResolvePaths?: Record<string, string[]>
}): Plugin => {
  return {
    name: 'external',

    setup(build) {
      if (skipNodeModulesBundle) {
        const resolvePatterns = tsconfigPathsToRegExp(
          tsconfigResolvePaths || {}
        )
        build.onResolve({ filter: /.*/} , (args) => {
          if (match(args.path, resolvePatterns)) {
            return
          }
          if (match(args.path, noExternal)) {
            return
          }
          if (match(args.path, external)) {
            return { external: true}
          }
          if (!NON_NODE_MODULE_RE.test(args.path)) {
            return {
              path: args.path,
              external: true
            }
          }
        })
      } else {
        build.onResolve({ filter: /.*/} , (args) => {
          if (match(args.path, noExternal)) {
            return
          }
          if (match(args.path, external)) {
            return { external: true}
          }
        })
      }
    }
  }
}