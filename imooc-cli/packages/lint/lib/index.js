import Command from '@sharpcli/command'
import { log, printErrorLog, makeList } from '@sharpcli/utils'


class LintCommand extends Command {
  get command() {
    return 'lint'
  }

  get description() {
    return 'lint project'
  }

  get options() {
    return []
  }

  async action() {
    log.verbose('lint')
    
  }
}

function Lint(instance) {
  return new LintCommand(instance)
}

export default Lint
