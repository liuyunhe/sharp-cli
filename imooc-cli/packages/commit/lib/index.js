import Command from '@sharpcli/command'
import { log, printErrorLog, makeList } from '@sharpcli/utils'

class CommitCommand extends Command {
  get command() {
    return 'commit'
  }

  get description() {
    return 'commit project'
  }

  get options() {
    return []
  }

  async action() {
    log.verbose('commit')
  }
}

function Commit(instance) {
  return new CommitCommand(instance)
}

export default Commit
